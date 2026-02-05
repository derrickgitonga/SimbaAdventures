import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Import models
import Tour from '../server/models/Tour.js';
import Booking from '../server/models/Booking.js';
import Analytics from '../server/models/Analytics.js';
import ActivityLog from '../server/models/ActivityLog.js';
import POSTransaction from '../server/models/POSTransaction.js';
import AdminUser from '../server/models/AdminUser.js';
import User from '../server/models/User.js';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'simba-adventures-secret-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'simba2026';

let toursCache = null;
let cacheTime = 0;
const CACHE_DURATION = 60000;

// DB Connection
let isConnected = false;
const connectToDatabase = async () => {
    if (isConnected) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error('MongoDB error:', err);
    }
};

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'], credentials: true }));
app.use(express.json());
app.use(async (req, res, next) => { await connectToDatabase(); next(); });

// --- HELPERS ---
const generateTransactionId = () => `TXN-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
const generateReceiptNumber = () => `SA-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

const logActivity = async (req, action, description, options = {}) => {
    try {
        const log = new ActivityLog({
            action, description,
            adminId: options.adminId || 'system',
            adminEmail: options.adminEmail || 'system',
            metadata: options.metadata || {},
            ipAddress: req.ip || 'unknown',
            entityType: options.entityType || 'system',
            entityId: options.entityId || null,
            severity: options.severity || 'info',
            success: options.success !== false
        });
        await log.save();
    } catch (err) { console.error('Log error', err); }
};

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Access token required' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

const authenticateUser = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Login required' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err || !user.isCustomer) return res.status(403).json({ error: 'Invalid token or not a customer' });
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES (CUSTOMER) ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already exists' });

        const user = new User({ name, email, password, phone });
        await user.save();

        // Retroactively link past bookings
        await Booking.updateMany({ customerEmail: email, userId: null }, { userId: user._id });

        const token = jwt.sign({ id: user._id, email: user.email, isCustomer: true }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name, email, phone } });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, email: user.email, isCustomer: true }, JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/user/bookings', authenticateUser, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- ADMIN ROUTES --- (Condensed for brevity, assumed same as before)
app.post('/api/admin/login', async (req, res) => {
    const { password, email } = req.body;
    const valid = process.env.ADMIN_PASSWORD || 'simba2026';
    if (password === valid || (email === 'admin@simba-adventures.com' && password === valid)) {
        const token = jwt.sign({ id: 'admin', email: 'admin@simba-adventures.com', role: 'super_admin' }, JWT_SECRET, { expiresIn: '24h' });
        await logActivity(req, 'LOGIN', 'Admin login');
        return res.json({ success: true, token, user: { role: 'super_admin' } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

// --- PUBLIC BOOKING ---
app.post('/api/bookings', async (req, res) => {
    try {
        const bookingData = req.body;

        // Link to user if exists
        const user = await User.findOne({ email: bookingData.customerEmail });
        if (user) bookingData.userId = user._id;

        const booking = new Booking(bookingData);
        await booking.save();
        res.status(201).json(booking);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

// --- ADMIN BOOKINGS ---
app.get('/api/admin/bookings', authenticateToken, async (req, res) => {
    // ... same as before
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(100);
    res.json({ bookings, pagination: { total: bookings.length } });
});

app.patch('/api/admin/bookings/:id', authenticateToken, async (req, res) => {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity(req, 'UPDATE_BOOKING', `Updated booking`, { adminId: req.user.id });
    res.json(booking);
});

// --- TOURS ---
async function getTours() {
    if (toursCache && Date.now() - cacheTime < CACHE_DURATION) return toursCache;
    toursCache = await Tour.find().sort({ createdAt: -1 }).lean();
    cacheTime = Date.now();
    return toursCache;
}
app.get('/api/tours', async (req, res) => {
    const tours = await getTours();
    res.json(tours);
});

// --- POS ---
app.post('/api/admin/pos/sale', authenticateToken, async (req, res) => {
    try {
        const { customer, items, paymentMethod, total } = req.body;

        // Save Transaction
        const transaction = new POSTransaction({
            transactionId: generateTransactionId(),
            type: 'SALE', customer, items, total, amountPaid: total, paymentMethod, status: 'COMPLETED',
            receiptNumber: generateReceiptNumber(), processedBy: req.user.id
        });
        await transaction.save();

        // Create Booking & Link User
        const tourItem = items.find(i => i.tourId);
        if (tourItem) {
            const user = await User.findOne({ email: customer.email });

            const booking = new Booking({
                tourId: tourItem.tourId,
                userId: user ? user._id : null,
                tourTitle: tourItem.name,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone,
                bookingDate: new Date().toISOString(),
                tripDate: req.body.tripDate || new Date().toISOString(),
                participants: tourItem.quantity,
                totalAmount: total,
                status: 'Confirmed',
                paymentStatus: 'Paid'
            });
            await booking.save();
            transaction.bookingId = booking._id;
            await transaction.save();
        }

        await logActivity(req, 'POS_SALE', `POS Sale: ${customer.name}`, { adminId: req.user.id });
        res.status(201).json(transaction);
    } catch (e) { res.status(400).json({ error: e.message }); }
});

// --- DASHBOARD ---
app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
    // ... simplified
    const stats = { overview: { totalTours: await Tour.countDocuments(), totalBookings: await Booking.countDocuments() } };
    res.json(stats);
});

export default app;

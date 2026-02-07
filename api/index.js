import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import Tour from '../server/models/Tour.js';
import Booking from '../server/models/Booking.js';
import Analytics from '../server/models/Analytics.js';
import ActivityLog from '../server/models/ActivityLog.js';
import POSTransaction from '../server/models/POSTransaction.js';
import AdminUser from '../server/models/AdminUser.js';
import User from '../server/models/User.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required');
}

if (!ADMIN_PASSWORD) {
    throw new Error('ADMIN_PASSWORD environment variable is required');
}

let toursCache = null;
let cacheTime = 0;
const CACHE_DURATION = 60000;

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

const optionalAuth = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return next();
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (!err) req.user = user;
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
    if (password === ADMIN_PASSWORD || (email === 'admin@simba-adventures.com' && password === ADMIN_PASSWORD)) {
        const token = jwt.sign({ id: 'admin', email: 'admin@simba-adventures.com', role: 'super_admin' }, JWT_SECRET, { expiresIn: '24h' });
        await logActivity(req, 'LOGIN', 'Admin login');
        return res.json({ success: true, token, user: { role: 'super_admin' } });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
});

// --- PUBLIC BOOKING ---
app.post('/api/bookings', optionalAuth, async (req, res) => {
    try {
        const bookingData = req.body;

        if (req.user && req.user.isCustomer) {
            bookingData.userId = req.user.id;
        }

        const user = await User.findOne({ email: bookingData.customerEmail });
        if (user && !bookingData.userId) {
            bookingData.userId = user._id;
        }

        const booking = new Booking(bookingData);
        await booking.save();

        await logActivity(req, 'CREATE_BOOKING', `New booking: ${booking.customerName} - ${booking.tourTitle}`, {
            entityType: 'booking',
            entityId: booking._id.toString(),
            metadata: {
                customer: booking.customerName,
                tour: booking.tourTitle,
                amount: booking.totalAmount,
                participants: booking.participants
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// --- ADMIN BOOKINGS ---
app.get('/api/admin/bookings', authenticateToken, async (req, res) => {
    try {
        const { status, from, to, limit, page } = req.query;
        const query = {};

        if (status) query.status = status;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const skip = (pageNum - 1) * limitNum;

        const [bookings, total] = await Promise.all([
            Booking.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            Booking.countDocuments(query)
        ]);

        await logActivity(req, 'VIEW_BOOKING', 'Viewed bookings list', {
            adminId: req.user.id,
            entityType: 'booking',
            metadata: { count: bookings.length, filters: req.query }
        });

        res.json({
            bookings,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/admin/bookings/:id', authenticateToken, async (req, res) => {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await logActivity(req, 'UPDATE_BOOKING', `Updated booking`, { adminId: req.user.id });
    res.json(booking);
});

app.delete('/api/admin/bookings/:id', authenticateToken, async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        await logActivity(req, 'DELETE_BOOKING', `Deleted booking`, { adminId: req.user.id });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
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

app.post('/api/admin/tours', authenticateToken, async (req, res) => {
    try {
        const tour = new Tour(req.body);
        await tour.save();
        toursCache = null;
        await logActivity(req, 'CREATE_TOUR', `Created tour: ${tour.title}`, { adminId: req.user.id });
        res.status(201).json(tour);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/admin/tours/:id', authenticateToken, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
        toursCache = null;
        await logActivity(req, 'UPDATE_TOUR', `Updated tour`, { adminId: req.user.id });
        res.json(tour);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/admin/tours/:id', authenticateToken, async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        toursCache = null;
        await logActivity(req, 'DELETE_TOUR', `Deleted tour`, { adminId: req.user.id });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- POS ---
app.post('/api/admin/pos/sale', authenticateToken, async (req, res) => {
    try {
        const { customer, items, paymentMethod, total } = req.body;

        const transaction = new POSTransaction({
            transactionId: generateTransactionId(),
            type: 'SALE', customer, items, total, amountPaid: total, paymentMethod, status: 'COMPLETED',
            receiptNumber: generateReceiptNumber(), processedBy: req.user.id
        });
        await transaction.save();

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
    try {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [totalTours, totalBookings, thisMonthBookings, lastMonthBookings, pendingBookings, recentBookings, topTours] = await Promise.all([
            Tour.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Booking.countDocuments({ createdAt: { $gte: lastMonth, $lt: startOfMonth } }),
            Booking.countDocuments({ status: 'Pending' }),
            Booking.find().sort({ createdAt: -1 }).limit(10).lean(),
            Booking.aggregate([
                { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
                { $group: { _id: '$tourTitle', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ]);

        const revenue = await Booking.aggregate([
            { $match: { createdAt: { $gte: startOfMonth }, status: { $in: ['Confirmed', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const lastMonthRevenue = await Booking.aggregate([
            { $match: { createdAt: { $gte: lastMonth, $lt: startOfMonth }, status: { $in: ['Confirmed', 'Completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        const currentRevenue = revenue[0]?.total || 0;
        const previousRevenue = lastMonthRevenue[0]?.total || 0;
        const revenueChange = previousRevenue > 0 ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100) : 0;
        const bookingsChange = lastMonthBookings > 0 ? Math.round(((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100) : 0;

        await logActivity(req, 'VIEW_DASHBOARD', 'Viewed admin dashboard', {
            adminId: req.user.id,
            entityType: 'dashboard'
        });

        res.json({
            overview: {
                totalTours,
                totalBookings,
                thisMonthBookings,
                pendingBookings,
                revenue: currentRevenue,
                revenueChange,
                bookingsChange
            },
            recentBookings,
            topTours
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/pos/summary', authenticateToken, async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const [todayStats, weekStats, monthStats, recentTransactions] = await Promise.all([
            POSTransaction.aggregate([
                { $match: { createdAt: { $gte: startOfDay }, type: 'SALE' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            POSTransaction.aggregate([
                { $match: { createdAt: { $gte: startOfWeek }, type: 'SALE' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            POSTransaction.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, type: 'SALE' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            POSTransaction.find().sort({ createdAt: -1 }).limit(10).lean()
        ]);

        res.json({
            today: todayStats[0] || { total: 0, count: 0 },
            week: weekStats[0] || { total: 0, count: 0 },
            month: monthStats[0] || { total: 0, count: 0 },
            recentTransactions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/activity-logs', authenticateToken, async (req, res) => {
    try {
        const { action, severity, from, to, page, limit } = req.query;
        const query = {};

        if (action) query.action = action;
        if (severity) query.severity = severity;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 25;
        const skip = (pageNum - 1) * limitNum;

        const [logs, total] = await Promise.all([
            ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            ActivityLog.countDocuments(query)
        ]);

        res.json({
            logs,
            pagination: {
                page: pageNum,
                limit: limitNum,
                total,
                pages: Math.ceil(total / limitNum)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/activity-logs/summary', authenticateToken, async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const [todayTotal, actionBreakdown, recentErrors, hourlyActivity] = await Promise.all([
            ActivityLog.countDocuments({ createdAt: { $gte: startOfDay } }),
            ActivityLog.aggregate([
                { $match: { createdAt: { $gte: startOfDay } } },
                { $group: { _id: '$action', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 10 }
            ]),
            ActivityLog.find({ severity: { $in: ['error', 'critical'] }, createdAt: { $gte: startOfDay } })
                .sort({ createdAt: -1 }).limit(5).lean(),
            ActivityLog.aggregate([
                { $match: { createdAt: { $gte: startOfDay } } },
                { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
                { $sort: { _id: 1 } }
            ])
        ]);

        res.json({
            todayTotal,
            actionBreakdown,
            recentErrors,
            hourlyActivity
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default app;

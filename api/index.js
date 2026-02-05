import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

// Import models relative to project root where api/index.js lives
import Tour from '../server/models/Tour.js';
import Booking from '../server/models/Booking.js';
import Analytics from '../server/models/Analytics.js';
import ActivityLog from '../server/models/ActivityLog.js';
import POSTransaction from '../server/models/POSTransaction.js';
import AdminUser from '../server/models/AdminUser.js';

dotenv.config();

const app = express();
// Vercel serverless: No app.listen()

const JWT_SECRET = process.env.JWT_SECRET || 'simba-adventures-secret-2026';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'simba2026';

let toursCache = null;
let cacheTime = 0;
const CACHE_DURATION = 60000;

// Cached DB Connection for Serverless
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

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

// Helper: Ensure DB is connected
app.use(async (req, res, next) => {
    await connectToDatabase();
    next();
});

// --- HELPER FUNCTIONS ---
const generateTransactionId = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TXN-${timestamp}-${random}`;
};

const generateReceiptNumber = () => {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const seq = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `SA-${dateStr}-${seq}`;
};

const logActivity = async (req, action, description, options = {}) => {
    try {
        const log = new ActivityLog({
            action,
            description,
            adminId: options.adminId || 'admin',
            adminEmail: options.adminEmail || 'admin@simba-adventures.com',
            metadata: options.metadata || {},
            ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown',
            entityType: options.entityType || 'system',
            entityId: options.entityId || null,
            severity: options.severity || 'info',
            success: options.success !== false
        });
        await log.save();
        return log;
    } catch (error) {
        console.error('Activity log error:', error);
    }
};

// --- MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access token required' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid or expired token' });
        req.user = user;
        next();
    });
};

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (!err) req.user = user;
        });
    }
    next();
};

async function getToursFromCache() {
    if (toursCache && Date.now() - cacheTime < CACHE_DURATION) {
        return toursCache;
    }
    toursCache = await Tour.find().sort({ createdAt: -1 }).lean();
    cacheTime = Date.now();
    return toursCache;
}

// --- ROUTES ---

// Health Check
app.get('/api/health', (req, res) => res.json({ status: 'ok', serverless: true }));

// --- ADMIN AUTH ---
app.post('/api/admin/login', async (req, res) => {
    const { password, email } = req.body;
    try {
        if (password === ADMIN_PASSWORD || (email === 'admin@simba-adventures.com' && password === ADMIN_PASSWORD)) {
            const token = jwt.sign(
                { id: 'admin', email: 'admin@simba-adventures.com', role: 'super_admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );
            await logActivity(req, 'LOGIN', 'Admin logged in successfully');
            return res.json({
                success: true,
                token,
                user: { id: 'admin', email: 'admin@simba-adventures.com', name: 'Administrator', role: 'super_admin' }
            });
        }
        await logActivity(req, 'LOGIN', 'Failed login attempt', { severity: 'warning', success: false });
        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/admin/logout', authenticateToken, async (req, res) => {
    await logActivity(req, 'LOGOUT', 'Admin logged out', { adminId: req.user.id });
    res.json({ success: true });
});

app.get('/api/admin/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

// --- TOURS ---
app.get('/api/tours', async (req, res) => {
    const { slug, featured, limit } = req.query;
    try {
        const tours = await getToursFromCache();
        if (featured === 'true') {
            return res.json(tours.filter(t => t.featured).slice(0, parseInt(limit) || 3));
        }
        if (slug) {
            const tour = tours.find(t => t.slug === slug);
            return tour ? res.json(tour) : res.status(404).json({ error: 'Tour not found' });
        }
        res.json(tours);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/admin/tours', authenticateToken, async (req, res) => {
    try {
        const tours = await Tour.find().sort({ createdAt: -1 }).lean();
        await logActivity(req, 'VIEW_TOUR', 'Viewed tours list', { adminId: req.user.id });
        res.json(tours);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/admin/tours', authenticateToken, async (req, res) => {
    try {
        const tour = new Tour(req.body);
        await tour.save();
        toursCache = null;
        await logActivity(req, 'CREATE_TOUR', `Created tour: ${tour.title}`, {
            adminId: req.user.id, entityType: 'tour', entityId: tour._id.toString()
        });
        res.status(201).json(tour);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.put('/api/admin/tours/:id', authenticateToken, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
        toursCache = null;
        await logActivity(req, 'UPDATE_TOUR', `Updated tour: ${tour.title}`, {
            adminId: req.user.id, entityType: 'tour', entityId: tour._id.toString()
        });
        res.json(tour);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.delete('/api/admin/tours/:id', authenticateToken, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        toursCache = null;
        await logActivity(req, 'DELETE_TOUR', `Deleted tour: ${tour.title}`, {
            adminId: req.user.id, entityType: 'tour', entityId: req.params.id
        });
        res.json({ success: true });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- BOOKINGS ---
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
        res.json(bookings);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

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

        res.json({ bookings, pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.post('/api/bookings', optionalAuth, async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        await logActivity(req, 'CREATE_BOOKING', `New booking: ${booking.customerName}`, {
            entityType: 'booking', entityId: booking._id.toString()
        });
        res.status(201).json(booking);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.patch('/api/admin/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const booking = await Booking.findById(req.params.id);
        if (!booking) return res.status(404).json({ error: 'Booking not found' });

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;
        await booking.save();

        await logActivity(req, 'UPDATE_BOOKING', `Updated booking: ${booking.customerName}`, {
            adminId: req.user.id, entityType: 'booking', entityId: booking._id.toString()
        });
        res.json(booking);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

// --- POS ---
app.post('/api/admin/pos/sale', authenticateToken, async (req, res) => {
    try {
        const { customer, items, paymentMethod, paymentDetails, discount, discountCode, notes, tripDate } = req.body;
        if (!items || items.length === 0) return res.status(400).json({ error: 'Items required' });

        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const total = subtotal - (discount || 0);

        const transaction = new POSTransaction({
            transactionId: generateTransactionId(),
            type: 'SALE',
            customer,
            items: items.map(item => ({ ...item, totalPrice: item.quantity * item.unitPrice })),
            subtotal,
            tax: 0,
            discount: discount || 0,
            discountCode,
            total,
            amountPaid: total,
            paymentMethod,
            paymentDetails: paymentDetails || {},
            status: 'COMPLETED',
            processedBy: req.user.id,
            notes,
            receiptNumber: generateReceiptNumber()
        });
        await transaction.save();

        const tourItem = items.find(item => item.tourId);
        if (tourItem) {
            const booking = new Booking({
                tourId: tourItem.tourId,
                tourTitle: tourItem.name,
                customerName: customer.name,
                customerEmail: customer.email,
                customerPhone: customer.phone || '',
                bookingDate: new Date().toISOString().split('T')[0],
                tripDate: tripDate || new Date(Date.now() + 604800000).toISOString().split('T')[0],
                participants: tourItem.quantity,
                totalAmount: total,
                status: 'Confirmed',
                paymentStatus: 'Paid'
            });
            await booking.save();
            transaction.bookingId = booking._id;
            await transaction.save();
        }

        await logActivity(req, 'POS_SALE', `POS Sale: ${customer.name} - $${total}`, {
            adminId: req.user.id, entityType: 'pos', entityId: transaction._id.toString()
        });
        res.status(201).json(transaction);
    } catch (error) { res.status(400).json({ error: error.message }); }
});

app.get('/api/admin/pos/summary', authenticateToken, async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay());
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [todaySales, weekSales, monthSales, recentTransactions] = await Promise.all([
            POSTransaction.aggregate([
                { $match: { createdAt: { $gte: today }, status: 'COMPLETED', type: 'SALE' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            POSTransaction.aggregate([
                { $match: { createdAt: { $gte: startOfWeek }, status: 'COMPLETED', type: 'SALE' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            POSTransaction.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, status: 'COMPLETED', type: 'SALE' } },
                { $group: { _id: null, total: { $sum: '$total' }, count: { $sum: 1 } } }
            ]),
            POSTransaction.find().sort({ createdAt: -1 }).limit(10).lean()
        ]);

        res.json({
            today: todaySales[0] || { total: 0, count: 0 },
            week: weekSales[0] || { total: 0, count: 0 },
            month: monthSales[0] || { total: 0, count: 0 },
            recentTransactions
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// --- ADMIN DASHBOARD ---
app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [totalTours, totalBookings, pendingBookings, thisMonthRevenue, recentBookings, topTours] = await Promise.all([
            Tour.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'Pending' }),
            Booking.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'Paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
            Booking.aggregate([
                { $group: { _id: '$tourTitle', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ]);

        res.json({
            overview: {
                totalTours,
                totalBookings,
                pendingBookings,
                revenue: thisMonthRevenue[0]?.total || 0,
                revenueChange: 0,
                bookingsChange: 0
            },
            recentBookings,
            topTours
        });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/admin/activity-logs', authenticateToken, async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(50);
        res.json({ logs, pagination: { total: logs.length, pages: 1 } });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

app.get('/api/admin/activity-logs/summary', authenticateToken, async (req, res) => {
    try {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const [todayLogs, actionBreakdown, recentErrors] = await Promise.all([
            ActivityLog.countDocuments({ createdAt: { $gte: today } }),
            ActivityLog.aggregate([
                { $match: { createdAt: { $gte: today } } },
                { $group: { _id: '$action', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            ActivityLog.find({ severity: { $in: ['error', 'critical'] } }).sort({ createdAt: -1 }).limit(5).lean()
        ]);
        res.json({ todayTotal: todayLogs, actionBreakdown, recentErrors, hourlyActivity: [] });
    } catch (error) { res.status(500).json({ error: error.message }); }
});

// Analytics
app.get('/api/analytics', async (req, res) => {
    try {
        const analytics = await Analytics.find().sort({ date: 1 }).limit(14).lean();
        res.json(analytics);
    } catch (error) { res.status(500).json({ error: error.message }); }
});

export default app;

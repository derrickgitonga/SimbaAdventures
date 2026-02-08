import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

import Tour from './models/Tour.js';
import Booking from './models/Booking.js';
import Analytics from './models/Analytics.js';
import ActivityLog from './models/ActivityLog.js';
import POSTransaction from './models/POSTransaction.js';
import AdminUser from './models/AdminUser.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set');
    process.exit(1);
}

if (!ADMIN_PASSWORD) {
    console.error('FATAL: ADMIN_PASSWORD environment variable is not set');
    process.exit(1);
}

let toursCache = null;
let cacheTime = 0;
const CACHE_DURATION = 60000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return next();
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (!err) {
            req.user = user;
        }
        next();
    });
};

async function getToursFromCache() {
    if (toursCache && Date.now() - cacheTime < CACHE_DURATION) {
        return toursCache;
    }
    toursCache = await Tour.find().sort({ createdAt: -1 }).lean();
    cacheTime = Date.now();
    return toursCache;
}

app.post('/api/activity/log', async (req, res) => {
    try {
        const { action, description, entityType, entityId, severity, metadata, userId, userEmail, userName, userType } = req.body;

        const log = new ActivityLog({
            action,
            description,
            userId,
            userEmail,
            userName,
            userType: userType || 'customer',
            metadata: metadata || {},
            ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
            userAgent: req.headers['user-agent'] || 'unknown',
            entityType: entityType || 'system',
            entityId: entityId || null,
            severity: severity || 'info',
            success: true
        });

        await log.save();
        res.json({ success: true });
    } catch (error) {
        console.error('Activity log error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    const { password, email } = req.body;

    try {
        if (password === ADMIN_PASSWORD || (email === 'admin@simba-adventures.com' && password === ADMIN_PASSWORD)) {
            const token = jwt.sign(
                { id: 'admin', email: 'admin@simba-adventures.com', role: 'super_admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            await logActivity(req, 'LOGIN', 'Admin logged in successfully', {
                severity: 'info',
                entityType: 'system'
            });

            return res.json({
                success: true,
                token,
                user: {
                    id: 'admin',
                    email: 'admin@simba-adventures.com',
                    name: 'Administrator',
                    role: 'super_admin'
                }
            });
        }

        await logActivity(req, 'LOGIN', 'Failed login attempt', {
            severity: 'warning',
            success: false,
            metadata: { email }
        });

        return res.status(401).json({ error: 'Invalid credentials' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/logout', authenticateToken, async (req, res) => {
    await logActivity(req, 'LOGOUT', 'Admin logged out', {
        adminId: req.user.id,
        adminEmail: req.user.email
    });
    res.json({ success: true });
});

app.get('/api/admin/verify', authenticateToken, (req, res) => {
    res.json({ valid: true, user: req.user });
});

app.get('/api/tours', async (req, res) => {
    const { slug, featured, limit } = req.query;

    try {
        const tours = await getToursFromCache();

        if (featured === 'true') {
            const featuredTours = tours.filter(t => t.featured).slice(0, parseInt(limit) || 3);
            return res.json(featuredTours);
        }

        if (slug) {
            const tour = tours.find(t => t.slug === slug);
            if (!tour) {
                return res.status(404).json({ error: 'Tour not found' });
            }
            return res.json(tour);
        }

        res.json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/tours', authenticateToken, async (req, res) => {
    try {
        const tours = await Tour.find().sort({ createdAt: -1 }).lean();

        await logActivity(req, 'VIEW_TOUR', 'Viewed tours list', {
            adminId: req.user.id,
            entityType: 'tour',
            metadata: { count: tours.length }
        });

        res.json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/admin/tours', authenticateToken, async (req, res) => {
    try {
        const tour = new Tour(req.body);
        await tour.save();

        toursCache = null;

        await logActivity(req, 'CREATE_TOUR', `Created tour: ${tour.title}`, {
            adminId: req.user.id,
            entityType: 'tour',
            entityId: tour._id.toString(),
            metadata: { title: tour.title, price: tour.price }
        });

        res.status(201).json(tour);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.put('/api/admin/tours/:id', authenticateToken, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        toursCache = null;

        await logActivity(req, 'UPDATE_TOUR', `Updated tour: ${tour.title}`, {
            adminId: req.user.id,
            entityType: 'tour',
            entityId: tour._id.toString(),
            metadata: { changes: Object.keys(req.body) }
        });

        res.json(tour);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.delete('/api/admin/tours/:id', authenticateToken, async (req, res) => {
    try {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }

        toursCache = null;

        await logActivity(req, 'DELETE_TOUR', `Deleted tour: ${tour.title}`, {
            adminId: req.user.id,
            entityType: 'tour',
            entityId: req.params.id,
            severity: 'warning',
            metadata: { title: tour.title }
        });

        res.json({ success: true });
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

app.post('/api/bookings', async (req, res) => {
    try {
        const bookingData = req.body;

        // userId is sent directly from the frontend (Clerk user ID)
        const booking = new Booking(bookingData);
        await booking.save();

        await logActivity(req, 'CREATE_BOOKING', `New booking: ${booking.customerName} - ${booking.tourTitle}`, {
            entityType: 'booking',
            entityId: booking._id.toString(),
            metadata: {
                customer: booking.customerName,
                tour: booking.tourTitle,
                amount: booking.totalAmount,
                participants: booking.participants,
                userId: booking.userId || null
            }
        });

        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.patch('/api/admin/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        const oldStatus = booking.status;
        const oldPaymentStatus = booking.paymentStatus;

        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();

        await logActivity(req, 'UPDATE_BOOKING', `Updated booking status: ${booking.status}`, {
            adminId: req.user.id,
            entityType: 'booking',
            entityId: booking._id.toString()
        });

        res.json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});





app.delete('/api/admin/bookings/:id', authenticateToken, async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        await logActivity(req, 'DELETE_BOOKING', `Deleted booking: ${booking.customerName}`, {
            adminId: req.user.id,
            entityType: 'booking',
            entityId: req.params.id,
            severity: 'warning',
            metadata: { customer: booking.customerName, tour: booking.tourTitle }
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/pos/transactions', authenticateToken, async (req, res) => {
    try {
        const { status, from, to, limit, page, method } = req.query;
        const query = {};

        if (status) query.status = status;
        if (method) query.paymentMethod = method;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
        const skip = (pageNum - 1) * limitNum;

        const [transactions, total] = await Promise.all([
            POSTransaction.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
            POSTransaction.countDocuments(query)
        ]);

        res.json({
            transactions,
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

app.post('/api/admin/pos/sale', authenticateToken, async (req, res) => {
    try {
        const { customer, items, paymentMethod, paymentDetails, discount, discountCode, notes } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'At least one item is required' });
        }

        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const discountAmount = discount || 0;
        const tax = 0;
        const total = subtotal - discountAmount + tax;

        const transaction = new POSTransaction({
            transactionId: generateTransactionId(),
            type: 'SALE',
            customer,
            items: items.map(item => ({
                ...item,
                totalPrice: item.quantity * item.unitPrice
            })),
            subtotal,
            tax,
            discount: discountAmount,
            discountCode,
            total,
            amountPaid: total,
            amountDue: 0,
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
                tripDate: req.body.tripDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
            adminId: req.user.id,
            entityType: 'pos',
            entityId: transaction._id.toString(),
            metadata: {
                transactionId: transaction.transactionId,
                customer: customer.name,
                total,
                paymentMethod,
                itemCount: items.length
            }
        });

        res.status(201).json(transaction);
    } catch (error) {
        await logActivity(req, 'POS_SALE', `POS Sale failed: ${error.message}`, {
            adminId: req.user.id,
            entityType: 'pos',
            severity: 'error',
            success: false,
            metadata: { error: error.message }
        });
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/admin/pos/refund', authenticateToken, async (req, res) => {
    try {
        const { transactionId, reason, amount } = req.body;

        const originalTransaction = await POSTransaction.findOne({ transactionId });
        if (!originalTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (originalTransaction.status === 'REFUNDED') {
            return res.status(400).json({ error: 'Transaction already refunded' });
        }

        const refundAmount = amount || originalTransaction.total;
        const isFullRefund = refundAmount >= originalTransaction.total;

        const refundTransaction = new POSTransaction({
            transactionId: generateTransactionId(),
            type: isFullRefund ? 'REFUND' : 'PARTIAL_REFUND',
            customer: originalTransaction.customer,
            items: originalTransaction.items,
            subtotal: -refundAmount,
            tax: 0,
            discount: 0,
            total: -refundAmount,
            amountPaid: -refundAmount,
            amountDue: 0,
            paymentMethod: originalTransaction.paymentMethod,
            status: 'COMPLETED',
            processedBy: req.user.id,
            notes: `Refund for ${transactionId}: ${reason}`,
            receiptNumber: generateReceiptNumber()
        });

        await refundTransaction.save();

        originalTransaction.status = isFullRefund ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
        await originalTransaction.save();

        if (originalTransaction.bookingId) {
            await Booking.findByIdAndUpdate(originalTransaction.bookingId, {
                status: 'Cancelled',
                paymentStatus: 'Refunded'
            });
        }

        await logActivity(req, 'POS_REFUND', `POS Refund: ${originalTransaction.customer.name} - $${refundAmount}`, {
            adminId: req.user.id,
            entityType: 'pos',
            entityId: refundTransaction._id.toString(),
            severity: 'warning',
            metadata: {
                originalTransactionId: transactionId,
                refundTransactionId: refundTransaction.transactionId,
                refundAmount,
                reason,
                isFullRefund
            }
        });

        res.status(201).json(refundTransaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/admin/pos/summary', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/activity-logs', authenticateToken, async (req, res) => {
    try {
        const { action, entityType, from, to, limit, page, severity } = req.query;
        const query = {};

        if (action) query.action = action;
        if (entityType) query.entityType = entityType;
        if (severity) query.severity = severity;
        if (from || to) {
            query.createdAt = {};
            if (from) query.createdAt.$gte = new Date(from);
            if (to) query.createdAt.$lte = new Date(to);
        }

        const pageNum = parseInt(page) || 1;
        const limitNum = parseInt(limit) || 50;
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [
            todayLogs,
            actionBreakdown,
            recentErrors,
            hourlyActivity
        ] = await Promise.all([
            ActivityLog.countDocuments({ createdAt: { $gte: today } }),
            ActivityLog.aggregate([
                { $match: { createdAt: { $gte: today } } },
                { $group: { _id: '$action', count: { $sum: 1 } } },
                { $sort: { count: -1 } }
            ]),
            ActivityLog.find({ severity: { $in: ['error', 'critical'] } })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            ActivityLog.aggregate([
                { $match: { createdAt: { $gte: today } } },
                { $group: { _id: { $hour: '$createdAt' }, count: { $sum: 1 } } },
                { $sort: { '_id': 1 } }
            ])
        ]);

        res.json({
            todayTotal: todayLogs,
            actionBreakdown,
            recentErrors,
            hourlyActivity
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

        const [
            totalTours,
            totalBookings,
            thisMonthBookings,
            lastMonthBookings,
            thisMonthRevenue,
            lastMonthRevenue,
            pendingBookings,
            recentBookings,
            topTours
        ] = await Promise.all([
            Tour.countDocuments(),
            Booking.countDocuments(),
            Booking.countDocuments({ createdAt: { $gte: startOfMonth } }),
            Booking.countDocuments({ createdAt: { $gte: lastMonth, $lte: endOfLastMonth } }),
            Booking.aggregate([
                { $match: { createdAt: { $gte: startOfMonth }, paymentStatus: 'Paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Booking.aggregate([
                { $match: { createdAt: { $gte: lastMonth, $lte: endOfLastMonth }, paymentStatus: 'Paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]),
            Booking.countDocuments({ status: 'Pending' }),
            Booking.find().sort({ createdAt: -1 }).limit(5).lean(),
            Booking.aggregate([
                { $group: { _id: '$tourTitle', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
                { $sort: { count: -1 } },
                { $limit: 5 }
            ])
        ]);

        const thisMonthRev = thisMonthRevenue[0]?.total || 0;
        const lastMonthRev = lastMonthRevenue[0]?.total || 0;
        const revenueChange = lastMonthRev > 0
            ? ((thisMonthRev - lastMonthRev) / lastMonthRev * 100).toFixed(1)
            : 0;

        const bookingsChange = lastMonthBookings > 0
            ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings * 100).toFixed(1)
            : 0;

        await logActivity(req, 'VIEW_DASHBOARD', 'Viewed admin dashboard', {
            adminId: req.user.id,
            entityType: 'system'
        });

        res.json({
            overview: {
                totalTours,
                totalBookings,
                thisMonthBookings,
                pendingBookings,
                revenue: thisMonthRev,
                revenueChange: parseFloat(revenueChange),
                bookingsChange: parseFloat(bookingsChange)
            },
            recentBookings,
            topTours
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/analytics', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 14;
        const analytics = await Analytics.find().sort({ date: 1 }).limit(days).lean();
        res.json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

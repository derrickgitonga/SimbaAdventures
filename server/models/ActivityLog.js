import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: [
            'LOGIN',
            'LOGOUT',
            'VIEW_DASHBOARD',
            'VIEW_TOUR',
            'CREATE_TOUR',
            'UPDATE_TOUR',
            'DELETE_TOUR',
            'VIEW_BOOKING',
            'CREATE_BOOKING',
            'UPDATE_BOOKING',
            'DELETE_BOOKING',
            'CANCEL_BOOKING',
            'CONFIRM_BOOKING',
            'POS_SALE',
            'POS_REFUND',
            'PAYMENT_RECEIVED',
            'PAYMENT_FAILED',
            'EXPORT_DATA',
            'SETTINGS_CHANGE',
            'USER_SEARCH',
            'CUSTOMER_VIEW',
            'PAGE_VIEW',
            'CUSTOMER_SIGNUP',
            'CUSTOMER_LOGIN',
            'CUSTOMER_LOGOUT',
            'CUSTOMER_VIEW_TOURS',
            'CUSTOMER_VIEW_TOUR_DETAIL',
            'CUSTOMER_SEARCH',
            'CUSTOMER_BOOKING_ATTEMPT',
            'CUSTOMER_BOOKING_SUCCESS',
            'CUSTOMER_BOOKING_FAILED',
            'CUSTOMER_VIEW_MY_BOOKINGS',
            'CUSTOMER_PROFILE_VIEW',
            'CUSTOMER_PROFILE_UPDATE'
        ]
    },
    adminId: {
        type: String,
        default: 'admin'
    },
    adminEmail: {
        type: String,
        default: 'admin@simba-adventures.com'
    },
    userId: {
        type: String,
        default: null
    },
    userEmail: {
        type: String,
        default: null
    },
    userName: {
        type: String,
        default: null
    },
    userType: {
        type: String,
        enum: ['admin', 'customer', 'system'],
        default: 'admin'
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String,
        default: 'unknown'
    },
    userAgent: {
        type: String,
        default: 'unknown'
    },
    entityType: {
        type: String,
        enum: ['tour', 'booking', 'customer', 'payment', 'system', 'pos', 'user'],
        default: 'system'
    },
    entityId: {
        type: String,
        default: null
    },
    severity: {
        type: String,
        enum: ['info', 'warning', 'error', 'critical'],
        default: 'info'
    },
    success: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1 });

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;

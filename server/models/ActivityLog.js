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
            'PAGE_VIEW'
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
        enum: ['tour', 'booking', 'customer', 'payment', 'system', 'pos'],
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

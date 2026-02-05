import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['super_admin', 'admin', 'manager', 'staff'],
        default: 'staff'
    },
    permissions: {
        dashboard: { type: Boolean, default: true },
        tours: { read: Boolean, write: Boolean, delete: Boolean },
        bookings: { read: Boolean, write: Boolean, delete: Boolean },
        pos: { read: Boolean, write: Boolean, refund: Boolean },
        analytics: { type: Boolean, default: true },
        activityLogs: { type: Boolean, default: false },
        settings: { type: Boolean, default: false },
        users: { type: Boolean, default: false }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    passwordResetToken: {
        type: String,
        default: null
    },
    passwordResetExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

adminUserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

adminUserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

adminUserSchema.methods.isLocked = function () {
    return this.lockUntil && this.lockUntil > Date.now();
};

adminUserSchema.methods.incrementLoginAttempts = async function () {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        });
    }

    const updates = { $inc: { loginAttempts: 1 } };

    if (this.loginAttempts + 1 >= 5) {
        updates.$set = { lockUntil: Date.now() + 30 * 60 * 1000 };
    }

    return this.updateOne(updates);
};

const AdminUser = mongoose.model('AdminUser', adminUserSchema);

export default AdminUser;

import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true },
    pageViews: { type: Number, default: 0 },
    uniqueVisitors: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    bookings: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.models.Analytics || mongoose.model('Analytics', analyticsSchema);

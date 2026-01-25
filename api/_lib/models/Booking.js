import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    tourId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tour', required: true },
    tourTitle: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },
    bookingDate: { type: String, required: true },
    tripDate: { type: String, required: true },
    participants: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

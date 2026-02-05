import mongoose from 'mongoose';

const posTransactionSchema = new mongoose.Schema({
    transactionId: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        required: true,
        enum: ['SALE', 'REFUND', 'PARTIAL_REFUND', 'DEPOSIT', 'BALANCE_PAYMENT']
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        default: null
    },
    tourId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour',
        default: null
    },
    customer: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, default: '' }
    },
    items: [{
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        tourId: { type: String, default: null }
    }],
    subtotal: {
        type: Number,
        required: true
    },
    tax: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    discountCode: {
        type: String,
        default: null
    },
    total: {
        type: Number,
        required: true
    },
    amountPaid: {
        type: Number,
        required: true
    },
    amountDue: {
        type: Number,
        default: 0
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['CASH', 'CARD', 'MPESA', 'BANK_TRANSFER', 'PAYPAL', 'MIXED']
    },
    paymentDetails: {
        cardLast4: { type: String, default: null },
        mpesaRef: { type: String, default: null },
        bankRef: { type: String, default: null },
        paypalRef: { type: String, default: null }
    },
    status: {
        type: String,
        required: true,
        enum: ['COMPLETED', 'PENDING', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
        default: 'COMPLETED'
    },
    processedBy: {
        type: String,
        default: 'admin'
    },
    notes: {
        type: String,
        default: ''
    },
    receiptNumber: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

posTransactionSchema.index({ createdAt: -1 });
posTransactionSchema.index({ customer: 1 });
posTransactionSchema.index({ status: 1 });
posTransactionSchema.index({ paymentMethod: 1 });
posTransactionSchema.index({ transactionId: 1 });
posTransactionSchema.index({ receiptNumber: 1 });

const POSTransaction = mongoose.model('POSTransaction', posTransactionSchema);

export default POSTransaction;

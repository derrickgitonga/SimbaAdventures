import mongoose from 'mongoose';

const tourSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    duration: { type: String, required: true },
    difficulty: { type: String, enum: ['Easy', 'Moderate', 'Challenging', 'Extreme'], required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    gallery: [String],
    shortDescription: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [String],
    inclusions: [String],
    exclusions: [String],
    itinerary: [{
        day: Number,
        title: String,
        description: String
    }],
    nextDate: { type: String, required: true },
    registrationDeadline: { type: String, required: true },
    spotsLeft: { type: Number, required: true },
    maxGroupSize: { type: Number, required: true },
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    category: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Tour || mongoose.model('Tour', tourSchema);

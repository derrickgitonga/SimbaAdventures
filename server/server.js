import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import Tour from './models/Tour.js';
import Booking from './models/Booking.js';
import Analytics from './models/Analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

let toursCache = null;
let cacheTime = 0;
const CACHE_DURATION = 60000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

async function getToursFromCache() {
    if (toursCache && Date.now() - cacheTime < CACHE_DURATION) {
        return toursCache;
    }
    toursCache = await Tour.find().sort({ createdAt: -1 }).lean();
    cacheTime = Date.now();
    return toursCache;
}

app.get('/api/tours', async (req, res) => {
    try {
        const tours = await getToursFromCache();
        res.json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tours/featured', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 3;
        const tours = await getToursFromCache();
        const featured = tours.filter(t => t.featured).slice(0, limit);
        res.json(featured);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/tours/slug/:slug', async (req, res) => {
    try {
        const tours = await getToursFromCache();
        const tour = tours.find(t => t.slug === req.params.slug);
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }
        res.json(tour);
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

app.post('/api/bookings', async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ error: error.message });
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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

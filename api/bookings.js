import dbConnect from './_lib/mongodb.js';
import Booking from './_lib/models/Booking.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    await dbConnect();

    if (req.method === 'GET') {
        try {
            const bookings = await Booking.find().sort({ createdAt: -1 }).lean();
            res.status(200).json(bookings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    } else if (req.method === 'POST') {
        try {
            const booking = new Booking(req.body);
            await booking.save();
            res.status(201).json(booking);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}

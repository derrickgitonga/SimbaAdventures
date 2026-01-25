import dbConnect from '../_lib/mongodb.js';
import Tour from '../_lib/models/Tour.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        await dbConnect();
        const limit = parseInt(req.query.limit) || 3;
        const tours = await Tour.find({ featured: true }).limit(limit).lean();
        res.status(200).json(tours);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

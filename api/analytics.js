import dbConnect from './_lib/mongodb.js';
import Analytics from './_lib/models/Analytics.js';

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
        const days = parseInt(req.query.days) || 14;
        const analytics = await Analytics.find().sort({ date: 1 }).limit(days).lean();
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

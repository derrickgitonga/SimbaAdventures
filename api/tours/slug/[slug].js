import dbConnect from '../../_lib/mongodb.js';
import Tour from '../../_lib/models/Tour.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { slug } = req.query;

    try {
        await dbConnect();
        const tour = await Tour.findOne({ slug }).lean();
        if (!tour) {
            return res.status(404).json({ error: 'Tour not found' });
        }
        res.status(200).json(tour);
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: error.message });
    }
}

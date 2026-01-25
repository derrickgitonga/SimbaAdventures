import { useQuery } from '@tanstack/react-query';
import type { AnalyticsData } from '@/data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function useAnalytics(days = 14) {
    return useQuery({
        queryKey: ['analytics', days],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/analytics?days=${days}`);
            if (!response.ok) throw new Error('Failed to fetch analytics');
            return response.json() as Promise<AnalyticsData[]>;
        },
    });
}

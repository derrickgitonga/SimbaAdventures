import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { AnalyticsData } from '@/data/mockData';

// Convert database row to AnalyticsData type
function mapAnalyticsFromDB(analytics: any): AnalyticsData {
    return {
        date: analytics.date,
        pageViews: analytics.page_views,
        uniqueVisitors: analytics.unique_visitors,
        inquiries: analytics.inquiries,
        bookings: analytics.bookings,
    };
}

// Fetch analytics data
export function useAnalytics(days = 14) {
    return useQuery({
        queryKey: ['analytics', days],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('analytics_data')
                .select('*')
                .order('date', { ascending: true })
                .limit(days);

            if (error) throw error;
            return data.map(mapAnalyticsFromDB);
        },
    });
}

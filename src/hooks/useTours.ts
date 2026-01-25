import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Tour } from '@/data/mockData';

// Convert database row to Tour type
function mapTourFromDB(tour: any): Tour {
    return {
        ...tour,
        originalPrice: tour.original_price,
        reviewCount: tour.review_count,
        shortDescription: tour.short_description,
        nextDate: tour.next_date,
        registrationDeadline: tour.registration_deadline,
        spotsLeft: tour.spots_left,
        maxGroupSize: tour.max_group_size,
    };
}

// Fetch all tours
export function useTours() {
    return useQuery({
        queryKey: ['tours'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tours')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data.map(mapTourFromDB);
        },
    });
}

// Fetch single tour by slug
export function useTour(slug: string | undefined) {
    return useQuery({
        queryKey: ['tour', slug],
        queryFn: async () => {
            if (!slug) return null;

            const { data, error } = await supabase
                .from('tours')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            return data ? mapTourFromDB(data) : null;
        },
        enabled: !!slug,
    });
}

// Fetch featured tours
export function useFeaturedTours(limit = 3) {
    return useQuery({
        queryKey: ['tours', 'featured', limit],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('tours')
                .select('*')
                .eq('featured', true)
                .limit(limit);

            if (error) throw error;
            return data.map(mapTourFromDB);
        },
    });
}

// Increment tour views
export function useIncrementTourViews() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tourId: string) => {
            const { data, error } = await supabase.rpc('increment_tour_views', {
                tour_id: tourId,
            });

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tours'] });
        },
    });
}

// Increment tour inquiries
export function useIncrementTourInquiries() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tourId: string) => {
            const { data, error } = await supabase.rpc('increment_tour_inquiries', {
                tour_id: tourId,
            });

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tours'] });
        },
    });
}

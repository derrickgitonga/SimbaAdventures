import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tour, tours } from '@/data/mockData';

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      // Simulate network delay for realistic feel, but very fast
      await new Promise(resolve => setTimeout(resolve, 300));
      return tours;
    },
    staleTime: 60000,
    gcTime: 300000,
  });
}

export function useTour(slug: string | undefined) {
  return useQuery({
    queryKey: ['tour', slug],
    queryFn: async () => {
      if (!slug) return null;
      await new Promise(resolve => setTimeout(resolve, 300));
      const tour = tours.find(t => t.slug === slug);
      if (!tour) throw new Error('Tour not found');
      return tour;
    },
    enabled: !!slug,
    staleTime: 60000,
    gcTime: 300000,
  });
}

export function useFeaturedTours(limit = 3) {
  return useQuery({
    queryKey: ['tours', 'featured', limit],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return tours.filter(t => t.featured).slice(0, limit);
    },
    staleTime: 60000,
    gcTime: 300000,
  });
}

export function useIncrementTourViews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tourId: string) => {
      // Simulate API call
      return new Promise(resolve => setTimeout(resolve, 200, { success: true }));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });
}

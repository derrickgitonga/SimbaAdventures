import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Tour } from '@/data/mockData';

const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `http://${window.location.hostname}:5000/api`;
  }
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

export function useTours() {
  return useQuery({
    queryKey: ['tours'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/tours`);
      if (!response.ok) throw new Error('Failed to fetch tours');
      return response.json() as Promise<Tour[]>;
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
      const response = await fetch(`${API_URL}/tours/slug/${slug}`);
      if (!response.ok) throw new Error('Tour not found');
      return response.json() as Promise<Tour>;
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
      const response = await fetch(`${API_URL}/tours/featured?limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch featured tours');
      return response.json() as Promise<Tour[]>;
    },
    staleTime: 60000,
    gcTime: 300000,
  });
}

export function useIncrementTourViews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tourId: string) => {
      const response = await fetch(`${API_URL}/tours/${tourId}/views`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to increment views');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });
}

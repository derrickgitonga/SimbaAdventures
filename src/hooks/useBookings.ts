import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@/data/mockData';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export function useBookings() {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/bookings`);
            if (!response.ok) throw new Error('Failed to fetch bookings');
            return response.json() as Promise<Booking[]>;
        },
    });
}

export function useCreateBooking() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
            console.log('Creating booking:', bookingData);
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Booking creation failed:', response.status, errorText);
                throw new Error(`Failed to create booking: ${response.status}`);
            }

            const result = await response.json();
            console.log('Booking created successfully:', result);
            return result;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
            queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
        },
        onError: (error) => {
            console.error('Booking mutation error:', error);
        }
    });
}

export function useUpdateBookingStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ bookingId, status, paymentStatus }: { bookingId: string; status?: string; paymentStatus?: string }) => {
            const response = await fetch(`${API_URL}/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, paymentStatus }),
            });
            if (!response.ok) throw new Error('Failed to update booking');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}

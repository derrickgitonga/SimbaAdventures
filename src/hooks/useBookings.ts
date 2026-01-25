import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Booking } from '@/data/mockData';

const isDev = import.meta.env.DEV;
const API_URL = isDev ? 'http://localhost:5000/api' : '/api';

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
            const response = await fetch(`${API_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            if (!response.ok) throw new Error('Failed to create booking');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
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

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Booking } from '@/data/mockData';

// Convert database row to Booking type
function mapBookingFromDB(booking: any): Booking {
    return {
        ...booking,
        tourId: booking.tour_id,
        tourTitle: booking.tour_title,
        customerName: booking.customer_name,
        customerEmail: booking.customer_email,
        customerPhone: booking.customer_phone,
        bookingDate: booking.booking_date,
        tripDate: booking.trip_date,
        totalAmount: booking.total_amount,
        paymentStatus: booking.payment_status,
        createdAt: booking.created_at,
    };
}

// Fetch all bookings
export function useBookings() {
    return useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data.map(mapBookingFromDB);
        },
    });
}

// Create new booking
export function useCreateBooking() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (bookingData: Omit<Booking, 'id' | 'createdAt'>) => {
            const { data, error } = await supabase
                .from('bookings')
                .insert({
                    id: `B${Date.now()}`,
                    tour_id: bookingData.tourId,
                    tour_title: bookingData.tourTitle,
                    customer_name: bookingData.customerName,
                    customer_email: bookingData.customerEmail,
                    customer_phone: bookingData.customerPhone,
                    booking_date: bookingData.bookingDate,
                    trip_date: bookingData.tripDate,
                    participants: bookingData.participants,
                    total_amount: bookingData.totalAmount,
                    status: bookingData.status,
                    payment_status: bookingData.paymentStatus,
                })
                .select()
                .single();

            if (error) throw error;
            return data ? mapBookingFromDB(data) : null;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}

// Update booking status
export function useUpdateBookingStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            bookingId,
            status,
            paymentStatus,
        }: {
            bookingId: string;
            status?: string;
            paymentStatus?: string;
        }) => {
            const updateData: any = {};
            if (status) updateData.status = status;
            if (paymentStatus) updateData.payment_status = paymentStatus;

            const { data, error } = await supabase
                .from('bookings')
                .update(updateData)
                .eq('id', bookingId)
                .select()
                .single();

            if (error) throw error;
            return data ? mapBookingFromDB(data) : null;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['bookings'] });
        },
    });
}

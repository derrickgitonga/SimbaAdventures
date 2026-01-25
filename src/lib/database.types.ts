export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            tours: {
                Row: {
                    id: string
                    title: string
                    slug: string
                    location: string
                    duration: string
                    difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
                    price: number
                    original_price: number | null
                    rating: number
                    review_count: number
                    image: string
                    gallery: string[]
                    short_description: string
                    description: string
                    highlights: string[]
                    inclusions: string[]
                    exclusions: string[]
                    itinerary: Json
                    next_date: string
                    registration_deadline: string
                    spots_left: number
                    max_group_size: number
                    views: number
                    inquiries: number
                    featured: boolean
                    category: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    title: string
                    slug: string
                    location: string
                    duration: string
                    difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
                    price: number
                    original_price?: number | null
                    rating?: number
                    review_count?: number
                    image: string
                    gallery?: string[]
                    short_description: string
                    description: string
                    highlights: string[]
                    inclusions: string[]
                    exclusions: string[]
                    itinerary: Json
                    next_date: string
                    registration_deadline: string
                    spots_left: number
                    max_group_size: number
                    views?: number
                    inquiries?: number
                    featured?: boolean
                    category: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    title?: string
                    slug?: string
                    location?: string
                    duration?: string
                    difficulty?: 'Easy' | 'Moderate' | 'Challenging' | 'Extreme'
                    price?: number
                    original_price?: number | null
                    rating?: number
                    review_count?: number
                    image?: string
                    gallery?: string[]
                    short_description?: string
                    description?: string
                    highlights?: string[]
                    inclusions?: string[]
                    exclusions?: string[]
                    itinerary?: Json
                    next_date?: string
                    registration_deadline?: string
                    spots_left?: number
                    max_group_size?: number
                    views?: number
                    inquiries?: number
                    featured?: boolean
                    category?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            bookings: {
                Row: {
                    id: string
                    tour_id: string
                    tour_title: string
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    booking_date: string
                    trip_date: string
                    participants: number
                    total_amount: number
                    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
                    payment_status: 'Pending' | 'Paid' | 'Refunded'
                    created_at: string
                }
                Insert: {
                    id?: string
                    tour_id: string
                    tour_title: string
                    customer_name: string
                    customer_email: string
                    customer_phone: string
                    booking_date: string
                    trip_date: string
                    participants: number
                    total_amount: number
                    status?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
                    payment_status?: 'Pending' | 'Paid' | 'Refunded'
                    created_at?: string
                }
                Update: {
                    id?: string
                    tour_id?: string
                    tour_title?: string
                    customer_name?: string
                    customer_email?: string
                    customer_phone?: string
                    booking_date?: string
                    trip_date?: string
                    participants?: number
                    total_amount?: number
                    status?: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed'
                    payment_status?: 'Pending' | 'Paid' | 'Refunded'
                    created_at?: string
                }
            }
            analytics_data: {
                Row: {
                    id: string
                    date: string
                    page_views: number
                    unique_visitors: number
                    inquiries: number
                    bookings: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    date: string
                    page_views: number
                    unique_visitors: number
                    inquiries: number
                    bookings: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    date?: string
                    page_views?: number
                    unique_visitors?: number
                    inquiries?: number
                    bookings?: number
                    created_at?: string
                }
            }
        }
    }
}

import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Calendar, Package, Clock, CheckCircle, XCircle } from 'lucide-react';

interface Booking {
    _id: string;
    tourTitle: string;
    bookingDate: string;
    tripDate: string;
    participants: number;
    totalAmount: number;
    status: string;
    createdAt: string;
}

export default function MyBookings() {
    const { user, isSignedIn, isLoaded } = useUser();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        if (isSignedIn && user) {
            fetchBookings();
        }
    }, [isSignedIn, user]);

    const fetchBookings = async () => {
        try {
            const token = await user?.primaryEmailAddress?.emailAddress;

            const res = await fetch(`${API_URL}/api/user/bookings`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Clerk-User-Id': user?.id || ''
                }
            });
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (e) {
            console.error(e);
        }
        setLoadingBookings(false);
    };

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!isSignedIn) {
        return <Navigate to="/auth" />;
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
                <p className="text-muted-foreground mb-8">
                    Welcome back, {user?.firstName || user?.emailAddresses[0]?.emailAddress}
                </p>

                {loadingBookings ? (
                    <div className="animate-pulse space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 rounded-xl" />)}
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-gray-900">No bookings yet</h3>
                        <p className="text-gray-500">Your adventure history will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <div key={booking._id} className="bg-card border rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <h3 className="font-bold text-lg text-primary mb-1">{booking.tourTitle}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" /> Trip: {new Date(booking.tripDate).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" /> Booked: {new Date(booking.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Package className="w-4 h-4" /> {booking.participants} People
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p className="text-xl font-bold">Ksh {booking.totalAmount}</p>
                                    </div>

                                    <div className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                        {booking.status === 'Confirmed' ? <CheckCircle className="w-4 h-4" /> :
                                            booking.status === 'Cancelled' ? <XCircle className="w-4 h-4" /> :
                                                <Clock className="w-4 h-4" />}
                                        {booking.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

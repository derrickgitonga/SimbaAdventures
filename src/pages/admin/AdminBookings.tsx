import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Package,
    Search,
    Filter,
    Eye,
    CheckCircle,
    XCircle,
    Clock,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    RefreshCw,
    DollarSign,
    Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface Booking {
    _id: string;
    tourId: string;
    tourTitle: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    tripDate: string;
    participants: number;
    totalAmount: number;
    status: 'Pending' | 'Confirmed' | 'Cancelled' | 'Completed';
    paymentStatus: 'Pending' | 'Paid' | 'Refunded';
    createdAt: string;
}

const statusConfig = {
    Pending: { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    Confirmed: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
    Cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    Completed: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' }
};

export default function AdminBookings() {
    const { token } = useAuth();
    const { toast } = useToast();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetchBookings();
        const interval = setInterval(fetchBookings, 15000);
        return () => clearInterval(interval);
    }, [page, filterStatus]);

    const fetchBookings = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '20'
            });
            if (filterStatus) params.append('status', filterStatus);

            const response = await fetch(`${API_URL}/api/admin/bookings?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setBookings(data.bookings);
                setTotalPages(data.pagination.pages);
            }
        } catch (error) {
            const response = await fetch(`${API_URL}/api/bookings`);
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
                setTotalPages(1);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateBookingStatus = async (bookingId: string, status: string, paymentStatus?: string) => {
        try {
            const response = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status, paymentStatus })
            });

            if (response.ok) {
                toast({ title: 'Booking Updated', description: `Status changed to ${status}` });
                fetchBookings();
                setSelectedBooking(null);
            } else {
                toast({ title: 'Update Failed', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', variant: 'destructive' });
        }
    };

    const deleteBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) return;

        try {
            const response = await fetch(`${API_URL}/api/admin/bookings/${bookingId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                toast({ title: 'Booking Deleted', description: 'Record removed successfully' });
                fetchBookings();
                setSelectedBooking(null);
            } else {
                toast({ title: 'Delete Failed', variant: 'destructive' });
            }
        } catch (error) {
            toast({ title: 'Network Error', variant: 'destructive' });
        }
    };

    const filteredBookings = bookings.filter(booking =>
        booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.tourTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const totalRevenue = filteredBookings
        .filter(b => b.paymentStatus === 'Paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                        <Package className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
                        <p className="text-sm text-muted-foreground">Manage all tour bookings</p>
                    </div>
                </div>
                <Button onClick={fetchBookings} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500">
                        {bookings.filter(b => b.status === 'Pending').length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Confirmed</p>
                    <p className="text-2xl font-bold text-green-500">
                        {bookings.filter(b => b.status === 'Confirmed').length}
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border">
                    <p className="text-sm text-muted-foreground">Revenue (Paid)</p>
                    <p className="text-2xl font-bold text-green-500">Ksh {totalRevenue.toLocaleString()}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by customer or tour..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <select
                    value={filterStatus}
                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                >
                    <option value="">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>

            {/* Bookings Table */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : filteredBookings.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No bookings found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Customer</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tour</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Trip Date</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Guests</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Amount</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Payment</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredBookings.map((booking) => {
                                    const config = statusConfig[booking.status];
                                    const Icon = config.icon;

                                    return (
                                        <tr key={booking._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <p className="font-medium text-foreground">{booking.customerName}</p>
                                                <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm text-foreground max-w-[200px] truncate">{booking.tourTitle}</p>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">{formatDate(booking.tripDate)}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm">{booking.participants}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className="text-sm font-medium text-green-500">
                                                    Ksh {booking.totalAmount?.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs ${config.bg} ${config.color}`}>
                                                    <Icon className="w-3 h-3" />
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-xs px-2 py-1 rounded-lg ${booking.paymentStatus === 'Paid'
                                                    ? 'bg-green-500/10 text-green-500'
                                                    : booking.paymentStatus === 'Refunded'
                                                        ? 'bg-red-500/10 text-red-500'
                                                        : 'bg-yellow-500/10 text-yellow-500'
                                                    }`}>
                                                    {booking.paymentStatus}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setSelectedBooking(booking)}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </Button>
                                                    {booking.status === 'Pending' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-green-500 hover:text-green-600"
                                                            onClick={() => updateBookingStatus(booking._id, 'Confirmed', 'Paid')}
                                                        >
                                                            <CheckCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {booking.status !== 'Cancelled' && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-500 hover:text-red-600"
                                                            onClick={() => updateBookingStatus(booking._id, 'Cancelled')}
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                        onClick={() => deleteBooking(booking._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-border">
                        <p className="text-sm text-muted-foreground">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg p-6 rounded-2xl bg-card border border-border shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Booking Details</h2>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Customer</span>
                                <span className="font-medium">{selectedBooking.customerName}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Email</span>
                                <span>{selectedBooking.customerEmail}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Phone</span>
                                <span>{selectedBooking.customerPhone || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Tour</span>
                                <span className="text-right max-w-[200px]">{selectedBooking.tourTitle}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Trip Date</span>
                                <span>{formatDate(selectedBooking.tripDate)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Participants</span>
                                <span>{selectedBooking.participants}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="font-bold text-green-500">Ksh {selectedBooking.totalAmount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span>{selectedBooking.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment</span>
                                <span>{selectedBooking.paymentStatus}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-6">
                            {selectedBooking.status === 'Pending' && (
                                <Button
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                    onClick={() => updateBookingStatus(selectedBooking._id, 'Confirmed', 'Paid')}
                                >
                                    Confirm & Mark Paid
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setSelectedBooking(null)}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

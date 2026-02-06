import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Users,
  DollarSign,
  Package,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  ShoppingCart,
  Activity,
  Clock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Link } from 'react-router-dom';

interface DashboardStats {
  overview: {
    totalTours: number;
    totalBookings: number;
    thisMonthBookings: number;
    pendingBookings: number;
    revenue: number;
    revenueChange: number;
    bookingsChange: number;
  };
  recentBookings: any[];
  topTours: { _id: string; count: number; revenue: number }[];
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [posSummary, setPOSSummary] = useState<any>(null);

  const API_URL = import.meta.env.VITE_API_URL || '';

  useEffect(() => {
    fetchDashboardData();
    fetchPOSSummary();
    const interval = setInterval(() => {
      fetchDashboardData();
      fetchPOSSummary();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPOSSummary = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/pos/summary`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setPOSSummary(data);
      }
    } catch (error) {
      console.error('Failed to fetch POS summary:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return `Ksh ${new Intl.NumberFormat('en-KE', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)}`;
  };

  const statCards = [
    {
      label: 'Monthly Revenue',
      value: formatCurrency(stats?.overview.revenue || 0),
      change: stats?.overview.revenueChange || 0,
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-500/10'
    },
    {
      label: 'Total Bookings',
      value: stats?.overview.totalBookings?.toString() || '0',
      change: stats?.overview.bookingsChange || 0,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Pending Bookings',
      value: stats?.overview.pendingBookings?.toString() || '0',
      change: 0,
      icon: Clock,
      color: 'text-yellow-500',
      bg: 'bg-yellow-500/10'
    },
    {
      label: 'Today\'s POS Sales',
      value: formatCurrency(posSummary?.today?.total || 0),
      change: 0,
      icon: ShoppingCart,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening.</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/admin/pos"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium hover:opacity-90 transition-opacity"
          >
            <ShoppingCart className="w-4 h-4" />
            Open POS
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              {stat.change !== 0 && (
                <span className={`flex items-center text-sm font-medium ${stat.change > 0 ? 'text-green-500' : 'text-red-500'
                  }`}>
                  {stat.change > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(stat.change)}%
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* POS Summary */}
        <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">POS Sales Summary</h2>
            <Link to="/admin/pos" className="text-sm text-amber-500 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-lg font-bold">{formatCurrency(posSummary?.today?.total || 0)}</p>
              <p className="text-xs text-muted-foreground">{posSummary?.today?.count || 0} sales</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">This Week</p>
              <p className="text-lg font-bold">{formatCurrency(posSummary?.week?.total || 0)}</p>
              <p className="text-xs text-muted-foreground">{posSummary?.week?.count || 0} sales</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-xs text-muted-foreground">This Month</p>
              <p className="text-lg font-bold">{formatCurrency(posSummary?.month?.total || 0)}</p>
              <p className="text-xs text-muted-foreground">{posSummary?.month?.count || 0} sales</p>
            </div>
          </div>

          {posSummary?.recentTransactions?.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Recent Transactions</p>
              {posSummary.recentTransactions.slice(0, 4).map((txn: any) => (
                <div key={txn._id} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">{txn.customer?.name}</p>
                    <p className="text-xs text-muted-foreground">{txn.receiptNumber}</p>
                  </div>
                  <span className={`text-sm font-bold ${txn.type === 'REFUND' ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {txn.type === 'REFUND' ? '-' : '+'}Ksh {Math.abs(txn.total)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Tours */}
        <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg">Top Performing Tours</h2>
            <Link to="/admin/tours" className="text-sm text-amber-500 hover:underline">
              View All
            </Link>
          </div>

          {stats?.topTours && stats.topTours.length > 0 ? (
            <div className="space-y-4">
              {stats.topTours.map((tour, i) => (
                <div key={tour._id} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{tour._id}</p>
                    <p className="text-sm text-muted-foreground">
                      {tour.count} bookings · {formatCurrency(tour.revenue)}
                    </p>
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No booking data yet</p>
          )}
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="p-5 rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-lg">Recent Bookings</h2>
          <Link to="/admin/bookings" className="text-sm text-amber-500 hover:underline">
            View All
          </Link>
        </div>

        {stats?.recentBookings && stats.recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Tour</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats.recentBookings.map((booking: any) => (
                  <tr key={booking._id} className="text-sm">
                    <td className="py-3">
                      <p className="font-medium">{booking.customerName}</p>
                      <p className="text-xs text-muted-foreground">{booking.customerEmail}</p>
                    </td>
                    <td className="py-3 text-muted-foreground max-w-[200px] truncate">
                      {booking.tourTitle}
                    </td>
                    <td className="py-3 font-medium text-green-500">
                      Ksh {booking.totalAmount}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs ${booking.status === 'Confirmed'
                        ? 'bg-green-500/10 text-green-500'
                        : booking.status === 'Cancelled'
                          ? 'bg-red-500/10 text-red-500'
                          : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-8">No recent bookings</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/pos"
          className="p-4 rounded-xl bg-white bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 hover:border-green-500/40 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <ShoppingCart className="w-6 h-6 text-green-500 mb-2" />
          <p className="font-medium">New Sale</p>
          <p className="text-xs text-muted-foreground">Process walk-in payment</p>
        </Link>

        <Link
          to="/admin/bookings"
          className="p-4 rounded-xl bg-white bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 hover:border-blue-500/40 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <Calendar className="w-6 h-6 text-blue-500 mb-2" />
          <p className="font-medium">Bookings</p>
          <p className="text-xs text-muted-foreground">Manage reservations</p>
        </Link>

        <Link
          to="/admin/activity"
          className="p-4 rounded-xl bg-white bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 hover:border-purple-500/40 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <Activity className="w-6 h-6 text-purple-500 mb-2" />
          <p className="font-medium">Activity</p>
          <p className="text-xs text-muted-foreground">View system logs</p>
        </Link>

        <Link
          to="/admin/tours"
          className="p-4 rounded-xl bg-white bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 hover:border-amber-500/40 shadow-sm hover:shadow-md transition-all duration-200 group"
        >
          <Package className="w-6 h-6 text-amber-500 mb-2" />
          <p className="font-medium">Tours</p>
          <p className="text-xs text-muted-foreground">Manage packages</p>
        </Link>
      </div>
    </div>
  );
}

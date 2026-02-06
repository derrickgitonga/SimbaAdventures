import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
    Activity,
    Filter,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Info,
    AlertTriangle,
    Search,
    Calendar,
    Download,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ActivityLogEntry {
    _id: string;
    action: string;
    description: string;
    adminEmail: string;
    userId?: string;
    userEmail?: string;
    userName?: string;
    userType?: 'admin' | 'customer' | 'system';
    entityType: string;
    entityId?: string;
    severity: 'info' | 'warning' | 'error' | 'critical';
    success: boolean;
    ipAddress: string;
    createdAt: string;
    metadata?: Record<string, any>;
}

interface LogsSummary {
    todayTotal: number;
    actionBreakdown: { _id: string; count: number }[];
    recentErrors: ActivityLogEntry[];
    hourlyActivity: { _id: number; count: number }[];
}

const severityConfig = {
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    warning: { icon: AlertTriangle, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    error: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-500/10' },
    critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-600/10' }
};

const actionLabels: Record<string, string> = {
    LOGIN: '🔐 Login',
    LOGOUT: '🚪 Logout',
    VIEW_DASHBOARD: '📊 View Dashboard',
    VIEW_TOUR: '🏔️ View Tours',
    CREATE_TOUR: '➕ Create Tour',
    UPDATE_TOUR: '✏️ Update Tour',
    DELETE_TOUR: '🗑️ Delete Tour',
    VIEW_BOOKING: '📋 View Bookings',
    CREATE_BOOKING: '🎫 New Booking',
    UPDATE_BOOKING: '📝 Update Booking',
    CONFIRM_BOOKING: '✅ Confirm Booking',
    CANCEL_BOOKING: '❌ Cancel Booking',
    DELETE_BOOKING: '🗑️ Delete Booking',
    POS_SALE: '💰 POS Sale',
    POS_REFUND: '↩️ Refund',
    PAYMENT_RECEIVED: '💵 Payment',
    SETTINGS_CHANGE: '⚙️ Settings',
    PAGE_VIEW: '👁️ Page View',
    CUSTOMER_SIGNUP: '👤 Customer Signup',
    CUSTOMER_LOGIN: '🔓 Customer Login',
    CUSTOMER_LOGOUT: '🔒 Customer Logout',
    CUSTOMER_VIEW_TOURS: '🌍 Browse Tours',
    CUSTOMER_VIEW_TOUR_DETAIL: '🔍 View Tour',
    CUSTOMER_SEARCH: '🔎 Search',
    CUSTOMER_BOOKING_ATTEMPT: '📝 Booking Attempt',
    CUSTOMER_BOOKING_SUCCESS: '✅ Booking Success',
    CUSTOMER_BOOKING_FAILED: '❌ Booking Failed',
    CUSTOMER_VIEW_MY_BOOKINGS: '📋 My Bookings',
    CUSTOMER_PROFILE_VIEW: '👤 Profile View',
    CUSTOMER_PROFILE_UPDATE: '✏️ Profile Update'
};

export default function AdminActivityLogs() {
    const { token } = useAuth();
    const [logs, setLogs] = useState<ActivityLogEntry[]>([]);
    const [summary, setSummary] = useState<LogsSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState('');
    const [filterSeverity, setFilterSeverity] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const API_URL = import.meta.env.VITE_API_URL || '';

    useEffect(() => {
        fetchLogs();
        fetchSummary();
    }, [page, filterAction, filterSeverity, dateFrom, dateTo]);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '25'
            });
            if (filterAction) params.append('action', filterAction);
            if (filterSeverity) params.append('severity', filterSeverity);
            if (dateFrom) params.append('from', dateFrom);
            if (dateTo) params.append('to', dateTo);

            const response = await fetch(`${API_URL}/api/admin/activity-logs?${params}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setLogs(data.logs);
                setTotalPages(data.pagination.pages);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSummary = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/activity-logs/summary`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setSummary(data);
            }
        } catch (error) {
            console.error('Failed to fetch summary:', error);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const uniqueActions = [...new Set(logs.map(l => l.action))];

    return (
        <div className="p-4 lg:p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10">
                        <Activity className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
                        <p className="text-sm text-muted-foreground">Track all system and user activities</p>
                    </div>
                </div>
                <Button onClick={() => { fetchLogs(); fetchSummary(); }} variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-muted-foreground">Today's Activities</p>
                        <p className="text-3xl font-bold text-foreground mt-1">{summary.todayTotal}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-muted-foreground">Hour Peak</p>
                        <p className="text-3xl font-bold text-foreground mt-1">
                            {summary.hourlyActivity.length > 0
                                ? `${summary.hourlyActivity.reduce((a, b) => a.count > b.count ? a : b)._id}:00`
                                : 'N/A'}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-muted-foreground">Top Action</p>
                        <p className="text-xl font-bold text-foreground mt-1">
                            {summary.actionBreakdown[0]?._id || 'N/A'}
                        </p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                        <p className="text-sm text-muted-foreground">Recent Errors</p>
                        <p className="text-3xl font-bold text-red-500 mt-1">{summary.recentErrors.length}</p>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="flex flex-wrap gap-3 p-4 rounded-xl bg-card border border-border">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search logs..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <select
                    value={filterAction}
                    onChange={(e) => { setFilterAction(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                >
                    <option value="">All Actions</option>
                    {uniqueActions.map(action => (
                        <option key={action} value={action}>{action}</option>
                    ))}
                </select>

                <select
                    value={filterSeverity}
                    onChange={(e) => { setFilterSeverity(e.target.value); setPage(1); }}
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm"
                >
                    <option value="">All Severity</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                    <option value="critical">Critical</option>
                </select>

                <Input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                    className="w-auto"
                    placeholder="From"
                />
                <Input
                    type="date"
                    value={dateTo}
                    onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                    className="w-auto"
                    placeholder="To"
                />
            </div>

            {/* Logs Table */}
            <div className="rounded-xl bg-card border border-border overflow-hidden">
                {isLoading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : filteredLogs.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No activity logs found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Time</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Action</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">IP</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredLogs.map((log) => {
                                    const config = severityConfig[log.severity];
                                    const Icon = config.icon;

                                    return (
                                        <tr key={log._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="p-4">
                                                <span className="text-sm text-muted-foreground whitespace-nowrap">
                                                    {formatDate(log.createdAt)}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex items-center gap-2 px-2 py-1 rounded-lg text-sm ${config.bg} ${config.color}`}>
                                                    <Icon className="w-4 h-4" />
                                                    {actionLabels[log.action] || log.action}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="text-sm text-foreground max-w-md truncate">{log.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    {log.userType === 'customer' ? (
                                                        <>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/10 text-blue-500">
                                                                👤 Customer
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {log.userName || log.userEmail}
                                                            </span>
                                                        </>
                                                    ) : log.userType === 'admin' ? (
                                                        <>
                                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-500/10 text-purple-500">
                                                                🔐 Admin
                                                            </span>
                                                            <span className="text-xs text-muted-foreground">{log.adminEmail}</span>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">System</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {log.success ? (
                                                    <span className="inline-flex items-center gap-1 text-green-500 text-sm">
                                                        <CheckCircle className="w-4 h-4" />
                                                        Success
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-red-500 text-sm">
                                                        <AlertCircle className="w-4 h-4" />
                                                        Failed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <span className="text-xs text-muted-foreground font-mono">
                                                    {log.ipAddress?.substring(0, 15) || 'N/A'}
                                                </span>
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
        </div>
    );
}

import { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  BarChart3,
  ShoppingCart,
  Activity,
  Calendar,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Mountain,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/portal-access-v1' },
  { icon: ShoppingCart, label: 'POS Terminal', path: '/portal-access-v1/pos' },
  { icon: Calendar, label: 'Bookings', path: '/portal-access-v1/bookings' },
  { icon: Package, label: 'Tours', path: '/portal-access-v1/tours' },
  { icon: BarChart3, label: 'Analytics', path: '/portal-access-v1/analytics' },
  { icon: Activity, label: 'Activity Logs', path: '/portal-access-v1/activity' },
];

export default function AdminLayout() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background dark flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/portal-access-v1/login" replace />;
  }

  const currentPage = navItems.find(item => item.path === location.pathname)?.label || 'Admin';

  return (
    <div className="min-h-screen bg-background dark">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-2 p-5 border-b border-border">
          <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <Mountain className="w-5 h-5" />
          </div>
          <div>
            <span className="font-heading font-bold text-foreground">Simba Admin</span>
            <p className="text-xs text-muted-foreground">Management Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 text-amber-500 border border-amber-500/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-amber-500' : ''}`} />
                <span className="font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          {user && (
            <div className="mb-3 px-2">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
            onClick={logout}
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
              <Mountain className="w-4 h-4" />
            </div>
            <span className="font-bold text-sm">{currentPage}</span>
          </div>
          <div className="w-9" />
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

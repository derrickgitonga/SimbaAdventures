import { TrendingUp, Users, DollarSign, Eye, Package } from 'lucide-react';
import { tours, bookings, analyticsData } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const stats = [
  { label: 'Total Revenue', value: '$15,324', change: '+12%', icon: DollarSign },
  { label: 'Total Bookings', value: bookings.length.toString(), change: '+8%', icon: Package },
  { label: 'Page Views', value: '24.5K', change: '+23%', icon: Eye },
  { label: 'Inquiries', value: tours.reduce((a, t) => a + t.inquiries, 0).toString(), change: '+15%', icon: Users },
];

export default function AdminDashboard() {
  const topTours = [...tours].sort((a, b) => b.inquiries - a.inquiries).slice(0, 5);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <h1 className="font-heading font-bold text-2xl text-foreground">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-8 h-8 text-accent" />
              <span className="text-sm text-green-500 font-medium">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <h2 className="font-heading font-bold text-lg mb-6">Traffic Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => v.split('-')[2]} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
              <Area type="monotone" dataKey="pageViews" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Tours */}
      <div className="p-6 rounded-xl bg-card border border-border">
        <h2 className="font-heading font-bold text-lg mb-4">Top Tours by Inquiries</h2>
        <div className="space-y-4">
          {topTours.map((tour, i) => (
            <div key={tour.id} className="flex items-center gap-4">
              <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
              <img src={tour.image} alt={tour.title} className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{tour.title}</p>
                <p className="text-sm text-muted-foreground">{tour.inquiries} inquiries · {tour.views} views</p>
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

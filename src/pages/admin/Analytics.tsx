import { useState, useEffect, useMemo } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  ShoppingBag,
  Users,
  Clock,
  MapPin,
  Target,
  Activity,
  Award
} from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  message?: string;
  serviceType?: string;
  location?: string;
  orderItems?: string;
  totalAmount?: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: any;
}

const Analytics = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reservations"));
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Reservation));
      setReservations(items);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data
  const analytics = useMemo(() => {
    const now = new Date();
    const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    // Filter reservations for date range
    const filteredReservations = reservations.filter(r => {
      const reservationDate = new Date(r.date);
      return reservationDate >= startDate && reservationDate <= now;
    });

    // Daily revenue data for line chart
    const dailyRevenue: Record<string, number> = {};
    const dailyOrders: Record<string, number> = {};
    
    for (let i = 0; i < daysBack; i++) {
      const date = new Date(startDate.getTime() + (i * 24 * 60 * 60 * 1000));
      const dateStr = date.toISOString().split('T')[0];
      dailyRevenue[dateStr] = 0;
      dailyOrders[dateStr] = 0;
    }

    filteredReservations.forEach(r => {
      if (r.status === "confirmed" && r.totalAmount && r.totalAmount > 0) {
        dailyRevenue[r.date] = (dailyRevenue[r.date] || 0) + r.totalAmount;
        dailyOrders[r.date] = (dailyOrders[r.date] || 0) + 1;
      }
    });

    const revenueChartData = Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: revenue,
      orders: dailyOrders[date] || 0
    }));

    // Location breakdown
    const locationStats: Record<string, { revenue: number; orders: number }> = {};
    filteredReservations.forEach(r => {
      if (r.status === "confirmed" && r.totalAmount && r.totalAmount > 0) {
        const location = r.location || 'Unknown';
        if (!locationStats[location]) {
          locationStats[location] = { revenue: 0, orders: 0 };
        }
        locationStats[location].revenue += r.totalAmount;
        locationStats[location].orders += 1;
      }
    });

    const locationChartData = Object.entries(locationStats).map(([location, stats]) => ({
      name: location.replace('Alexandria - ', '').replace('Cairo', 'New Cairo'),
      revenue: stats.revenue,
      orders: stats.orders
    }));

    // Time analysis
    const timeStats: Record<string, number> = {};
    filteredReservations.forEach(r => {
      if (r.status === "confirmed") {
        const hour = parseInt(r.time.split(':')[0]);
        const timeSlot = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
        timeStats[timeSlot] = (timeStats[timeSlot] || 0) + 1;
      }
    });

    const timeChartData = Object.entries(timeStats).map(([time, count]) => ({
      name: time,
      value: count
    }));

    // Calculate KPIs
    const totalRevenue = filteredReservations
      .filter(r => r.status === "confirmed" && r.totalAmount)
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);

    const totalOrders = filteredReservations.filter(r => 
      r.status === "confirmed" && r.totalAmount && r.totalAmount > 0
    ).length;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    const totalReservations = filteredReservations.filter(r => r.status === "confirmed").length;
    const conversionRate = filteredReservations.length > 0 ? 
      (filteredReservations.filter(r => r.status === "confirmed").length / filteredReservations.length) * 100 : 0;

    const totalGuests = filteredReservations
      .filter(r => r.status === "confirmed")
      .reduce((sum, r) => sum + r.guests, 0);

    return {
      revenueChartData,
      locationChartData,
      timeChartData,
      kpis: {
        totalRevenue,
        totalOrders,
        avgOrderValue,
        totalReservations,
        totalGuests,
        conversionRate
      }
    };
  }, [reservations, dateRange]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl"></div>
          ))}
        </div>
        <div className="h-80 bg-muted rounded-xl"></div>
      </div>
    );
  }

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Revenue Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your business performance</p>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex gap-2">
          {(['7d', '30d', '90d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                dateRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Last 90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="text-xs font-medium text-green-600">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold text-green-700">{analytics.kpis.totalRevenue.toFixed(2)} EGP</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium text-blue-600">Pre-orders</p>
          </div>
          <p className="text-2xl font-bold text-blue-700">{analytics.kpis.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-medium text-purple-600">Avg Order</p>
          </div>
          <p className="text-2xl font-bold text-purple-700">{analytics.kpis.avgOrderValue.toFixed(0)} EGP</p>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <p className="text-xs font-medium text-orange-600">Reservations</p>
          </div>
          <p className="text-2xl font-bold text-orange-700">{analytics.kpis.totalReservations}</p>
        </div>

        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-pink-600" />
            <p className="text-xs font-medium text-pink-600">Total Guests</p>
          </div>
          <p className="text-2xl font-bold text-pink-700">{analytics.kpis.totalGuests}</p>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <p className="text-xs font-medium text-indigo-600">Conversion</p>
          </div>
          <p className="text-2xl font-bold text-indigo-700">{analytics.kpis.conversionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Revenue Trend</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics.revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8884d8" 
                fill="#8884d8" 
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location & Time Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Performance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Revenue by Location</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.locationChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar dataKey="revenue" fill="#8884d8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Peak Hours</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.timeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.timeChartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e2e8f0', 
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {analytics.timeChartData.map((item, index) => (
              <div key={item.name} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
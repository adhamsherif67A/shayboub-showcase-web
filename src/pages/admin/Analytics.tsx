import { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, FunnelChart, Funnel,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Clock,
  MapPin, Target, Activity, Calendar, ArrowUp, ArrowDown, Minus,
  Download, FileText, Mail, Filter, RefreshCw
} from "lucide-react";

interface Reservation {
  id: string;
  name: string;
  phone: string;
  email?: string;
  date: string;
  time: string;
  guests: number;
  serviceType?: string;
  location?: string;
  orderItems?: string;
  totalAmount?: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: any;
}

const COLORS = ['#FF8C42', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'];

const AnalyticsNew = () => {
  const { t, isRTL } = useLanguage();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('30d');

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

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let startDate: Date;
    if (dateRange === 'today') {
      startDate = today;
    } else {
      const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;
      startDate = new Date(today.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    }
    
    const filteredReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate >= startDate && resDate <= now;
    });

    // Today's metrics
    const todayReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate >= today;
    });
    
    const yesterdayReservations = reservations.filter(r => {
      const resDate = new Date(r.date);
      return resDate >= yesterday && resDate < today;
    });

    const todayConfirmed = todayReservations.filter(r => r.status === 'confirmed');
    const yesterdayConfirmed = yesterdayReservations.filter(r => r.status === 'confirmed');

    const todayRevenue = todayConfirmed.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const yesterdayRevenue = yesterdayConfirmed.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const revenueChange = yesterdayRevenue > 0 ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100 : 0;

    const todayOrders = todayConfirmed.length;
    const yesterdayOrders = yesterdayConfirmed.length;
    const ordersChange = yesterdayOrders > 0 ? ((todayOrders - yesterdayOrders) / yesterdayOrders) * 100 : 0;

    const todayGuests = todayConfirmed.reduce((sum, r) => sum + r.guests, 0);
    const yesterdayGuests = yesterdayConfirmed.reduce((sum, r) => sum + r.guests, 0);
    const guestsChange = yesterdayGuests > 0 ? ((todayGuests - yesterdayGuests) / yesterdayGuests) * 100 : 0;

    const todayAvgOrder = todayOrders > 0 ? todayRevenue / todayOrders : 0;
    const yesterdayAvgOrder = yesterdayOrders > 0 ? yesterdayRevenue / yesterdayOrders : 0;
    const avgOrderChange = yesterdayAvgOrder > 0 ? ((todayAvgOrder - yesterdayAvgOrder) / yesterdayAvgOrder) * 100 : 0;

    const todayConversion = todayReservations.length > 0 ? (todayConfirmed.length / todayReservations.length) * 100 : 0;
    const livePending = todayReservations.filter(r => r.status === 'pending').length;

    // Revenue trend data
    const revenueByDate: Record<string, number> = {};
    filteredReservations.forEach(r => {
      if (r.status === 'confirmed' && r.totalAmount) {
        const dateKey = r.date;
        revenueByDate[dateKey] = (revenueByDate[dateKey] || 0) + r.totalAmount;
      }
    });
    
    const revenueChartData = Object.entries(revenueByDate)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, revenue]) => ({ date: date.slice(5), revenue }));

    // Revenue by location
    const locationRevenue: Record<string, { revenue: number; orders: number; guests: number }> = {};
    filteredReservations.forEach(r => {
      if (r.status === 'confirmed') {
        const loc = r.location || 'Unknown';
        if (!locationRevenue[loc]) {
          locationRevenue[loc] = { revenue: 0, orders: 0, guests: 0 };
        }
        locationRevenue[loc].revenue += r.totalAmount || 0;
        locationRevenue[loc].orders += 1;
        locationRevenue[loc].guests += r.guests;
      }
    });

    const locationChartData = Object.entries(locationRevenue)
      .map(([name, stats]) => ({
        name: name.replace('Alexandria - ', '').replace('Cairo - ', ''),
        revenue: stats.revenue,
        orders: stats.orders,
        guests: stats.guests
      }))
      .sort((a, b) => b.revenue - a.revenue);

    // Revenue by service type
    const serviceTypeRevenue = {
      dinein: 0,
      pickup: 0
    };
    filteredReservations.forEach(r => {
      if (r.status === 'confirmed' && r.totalAmount) {
        if (r.serviceType === 'dinein') {
          serviceTypeRevenue.dinein += r.totalAmount;
        } else {
          serviceTypeRevenue.pickup += r.totalAmount;
        }
      }
    });

    const serviceTypeData = [
      { name: 'Dine-In', value: serviceTypeRevenue.dinein },
      { name: 'Pickup', value: serviceTypeRevenue.pickup }
    ].filter(item => item.value > 0);

    // Time slot analysis
    const timeSlotStats: Record<string, { revenue: number; orders: number }> = {
      breakfast: { revenue: 0, orders: 0 },
      lunch: { revenue: 0, orders: 0 },
      dinner: { revenue: 0, orders: 0 },
      night: { revenue: 0, orders: 0 }
    };

    filteredReservations.forEach(r => {
      if (r.status === 'confirmed') {
        const hour = parseInt(r.time.split(':')[0]);
        let slot = 'night';
        if (hour >= 6 && hour < 11) slot = 'breakfast';
        else if (hour >= 11 && hour < 15) slot = 'lunch';
        else if (hour >= 15 && hour < 22) slot = 'dinner';
        
        timeSlotStats[slot].revenue += r.totalAmount || 0;
        timeSlotStats[slot].orders += 1;
      }
    });

    const timeSlotData = Object.entries(timeSlotStats).map(([slot, stats]) => ({
      slot,
      revenue: stats.revenue,
      orders: stats.orders
    }));

    // Day of week performance
    const dayOfWeekStats: Record<string, { revenue: number; orders: number; guests: number }> = {};
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    
    filteredReservations.forEach(r => {
      if (r.status === 'confirmed') {
        const date = new Date(r.date);
        const dayName = dayNames[date.getDay()];
        if (!dayOfWeekStats[dayName]) {
          dayOfWeekStats[dayName] = { revenue: 0, orders: 0, guests: 0 };
        }
        dayOfWeekStats[dayName].revenue += r.totalAmount || 0;
        dayOfWeekStats[dayName].orders += 1;
        dayOfWeekStats[dayName].guests += r.guests;
      }
    });

    const dayOfWeekData = dayNames.map(day => ({
      day,
      ...dayOfWeekStats[day] || { revenue: 0, orders: 0, guests: 0 }
    }));

    // Menu performance (top items)
    const menuItemStats: Record<string, { quantity: number; revenue: number; orders: number }> = {};
    filteredReservations.forEach(r => {
      if (r.status === 'confirmed' && r.orderItems) {
        try {
          const items = JSON.parse(r.orderItems);
          items.forEach((item: any) => {
            const itemName = item.name || item.item?.name;
            if (itemName) {
              if (!menuItemStats[itemName]) {
                menuItemStats[itemName] = { quantity: 0, revenue: 0, orders: 0 };
              }
              menuItemStats[itemName].quantity += item.quantity || 1;
              menuItemStats[itemName].revenue += (item.selectedPrice || item.item?.price || 0) * (item.quantity || 1);
              menuItemStats[itemName].orders += 1;
            }
          });
        } catch (e) {
          // Skip invalid JSON
        }
      }
    });

    const topSellingItems = Object.entries(menuItemStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Customer insights
    const uniqueCustomers = new Set(filteredReservations.map(r => r.phone));
    const repeatCustomers = new Set();
    const customerBookings: Record<string, number> = {};
    
    filteredReservations.forEach(r => {
      customerBookings[r.phone] = (customerBookings[r.phone] || 0) + 1;
      if (customerBookings[r.phone] > 1) {
        repeatCustomers.add(r.phone);
      }
    });

    const newCustomers = uniqueCustomers.size - repeatCustomers.size;
    const returningCustomers = repeatCustomers.size;

    // Cancellation rate
    const confirmedCount = filteredReservations.filter(r => r.status === 'confirmed').length;
    const cancelledCount = filteredReservations.filter(r => r.status === 'cancelled').length;
    const cancellationRate = filteredReservations.length > 0 ? (cancelledCount / filteredReservations.length) * 100 : 0;

    // Funnel data
    const funnelData = [
      { name: 'Total Bookings', value: filteredReservations.length },
      { name: 'Pending', value: filteredReservations.filter(r => r.status === 'pending').length },
      { name: 'Confirmed', value: confirmedCount },
      { name: 'Completed', value: confirmedCount } // Assuming confirmed = completed for now
    ];

    // Total metrics for period
    const totalRevenue = filteredReservations
      .filter(r => r.status === 'confirmed')
      .reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    
    const totalOrders = filteredReservations.filter(r => r.status === 'confirmed' && r.totalAmount && r.totalAmount > 0).length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const totalGuests = filteredReservations.filter(r => r.status === 'confirmed').reduce((sum, r) => sum + r.guests, 0);
    const conversionRate = filteredReservations.length > 0 ? (confirmedCount / filteredReservations.length) * 100 : 0;

    return {
      // Real-time metrics
      realTime: {
        todayRevenue,
        todayOrders,
        todayGuests,
        todayAvgOrder,
        todayConversion,
        livePending,
        revenueChange,
        ordersChange,
        guestsChange,
        avgOrderChange
      },
      // Charts
      revenueChartData,
      locationChartData,
      serviceTypeData,
      timeSlotData,
      dayOfWeekData,
      topSellingItems,
      funnelData,
      // Aggregates
      totalRevenue,
      totalOrders,
      avgOrderValue,
      totalGuests,
      conversionRate,
      newCustomers,
      returningCustomers,
      cancellationRate
    };
  }, [reservations, dateRange]);

  const TrendIndicator = ({ value, showPercentage = true }: { value: number; showPercentage?: boolean }) => {
    if (value > 0) {
      return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <ArrowUp className="w-3 h-3" />
          {showPercentage ? `${value.toFixed(1)}%` : value.toFixed(0)}
        </span>
      );
    } else if (value < 0) {
      return (
        <span className={`inline-flex items-center gap-1 text-xs font-medium text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <ArrowDown className="w-3 h-3" />
          {showPercentage ? `${Math.abs(value).toFixed(1)}%` : Math.abs(value).toFixed(0)}
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-medium text-gray-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Minus className="w-3 h-3" />
        0%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48"></div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.admin.analytics.title}</h1>
          <p className="text-muted-foreground">{t.admin.analytics.subtitle}</p>
        </div>
        
        {/* Date Range & Export */}
        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {(['today', '7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {range === 'today' ? t.admin.analytics.today : 
                 range === '7d' ? t.admin.analytics.last7Days : 
                 range === '30d' ? t.admin.analytics.last30Days : 
                 t.admin.analytics.last90Days}
              </button>
            ))}
          </div>
          <button
            onClick={() => window.print()}
            className="p-2 rounded-lg border border-border hover:bg-muted transition-colors"
            title={t.admin.analytics.export.pdf}
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Today's Revenue */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <DollarSign className="w-4 h-4 text-green-600" />
            <p className="text-xs font-medium text-green-600">{t.admin.analytics.realTime.todayRevenue}</p>
          </div>
          <p className="text-2xl font-bold text-green-700 mb-1">{analytics.realTime.todayRevenue.toFixed(0)} EGP</p>
          <TrendIndicator value={analytics.realTime.revenueChange} />
        </div>

        {/* Today's Orders */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            <p className="text-xs font-medium text-blue-600">{t.admin.analytics.realTime.todayOrders}</p>
          </div>
          <p className="text-2xl font-bold text-blue-700 mb-1">{analytics.realTime.todayOrders}</p>
          <TrendIndicator value={analytics.realTime.ordersChange} showPercentage={false} />
        </div>

        {/* Today's Guests */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-4 h-4 text-purple-600" />
            <p className="text-xs font-medium text-purple-600">{t.admin.analytics.realTime.todayGuests}</p>
          </div>
          <p className="text-2xl font-bold text-purple-700 mb-1">{analytics.realTime.todayGuests}</p>
          <TrendIndicator value={analytics.realTime.guestsChange} showPercentage={false} />
        </div>

        {/* Avg Order Value */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-4 h-4 text-orange-600" />
            <p className="text-xs font-medium text-orange-600">{t.admin.analytics.realTime.avgOrderValue}</p>
          </div>
          <p className="text-2xl font-bold text-orange-700 mb-1">{analytics.realTime.todayAvgOrder.toFixed(0)} EGP</p>
          <TrendIndicator value={analytics.realTime.avgOrderChange} />
        </div>

        {/* Conversion Rate */}
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 border border-pink-200 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Activity className="w-4 h-4 text-pink-600" />
            <p className="text-xs font-medium text-pink-600">{t.admin.analytics.realTime.conversionRate}</p>
          </div>
          <p className="text-2xl font-bold text-pink-700 mb-1">{analytics.realTime.todayConversion.toFixed(1)}%</p>
          <span className="text-xs text-pink-600">{t.admin.analytics.realTime.vsYesterday}</span>
        </div>

        {/* Live Pending */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
          <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-4 h-4 text-yellow-600 animate-pulse" />
            <p className="text-xs font-medium text-yellow-600">{t.admin.analytics.realTime.livePending}</p>
          </div>
          <p className="text-2xl font-bold text-yellow-700 mb-1">{analytics.realTime.livePending}</p>
          <span className="text-xs text-yellow-600">Live</span>
        </div>
      </div>

      {/* Revenue Trend */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{t.admin.analytics.revenueTrend}</h2>
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
                  borderRadius: '8px'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#FF8C42" 
                fill="#FF8C42" 
                fillOpacity={0.3}
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Location & Service Type Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location Performance */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t.admin.analytics.revenueByLocation}</h2>
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
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="revenue" fill="#FF8C42" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Type Revenue */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Target className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t.admin.analytics.revenueByServiceType}</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.serviceTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {analytics.serviceTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Menu Performance & Customer Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t.admin.analytics.menuPerformance.topSellers}</h2>
          </div>
          <div className="space-y-3">
            {analytics.topSellingItems.map((item, index) => (
              <div key={item.name} className={`flex items-center justify-between p-3 rounded-lg bg-muted/50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.quantity} {t.admin.analytics.menuPerformance.quantity}</p>
                  </div>
                </div>
                <p className="font-bold text-foreground">{item.revenue.toFixed(0)} EGP</p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">{t.admin.analytics.customerInsights.title}</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">{t.admin.analytics.customerInsights.newCustomers}</p>
              <p className="text-3xl font-bold text-blue-700">{analytics.newCustomers}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-600 mb-1">{t.admin.analytics.customerInsights.returningCustomers}</p>
              <p className="text-3xl font-bold text-green-700">{analytics.returningCustomers}</p>
            </div>
            <div className="p-4 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-sm text-orange-600 mb-1">{t.admin.analytics.customerInsights.cancellationRate}</p>
              <p className="text-3xl font-bold text-orange-700">{analytics.cancellationRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Analytics */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className={`flex items-center gap-2 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <Clock className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">{t.admin.analytics.timeAnalytics.dayOfWeek}</h2>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.dayOfWeekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="revenue" fill="#FF8C42" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t.admin.analytics.totalRevenue}</p>
          <p className="text-2xl font-bold text-foreground">{analytics.totalRevenue.toFixed(0)} EGP</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t.admin.analytics.totalGuests}</p>
          <p className="text-2xl font-bold text-foreground">{analytics.totalGuests}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t.admin.analytics.avgOrder}</p>
          <p className="text-2xl font-bold text-foreground">{analytics.avgOrderValue.toFixed(0)} EGP</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t.admin.analytics.reservations}</p>
          <p className="text-2xl font-bold text-foreground">{analytics.totalOrders}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 text-center">
          <p className="text-sm text-muted-foreground mb-1">{t.admin.analytics.conversion}</p>
          <p className="text-2xl font-bold text-foreground">{analytics.conversionRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsNew;

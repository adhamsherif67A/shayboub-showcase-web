import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  UtensilsCrossed, 
  CalendarDays, 
  Users, 
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

interface Stats {
  totalMenuItems: number;
  totalReservations: number;
  pendingReservations: number;
  totalStaff: number;
}

interface RecentReservation {
  id: string;
  name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  createdAt: Date;
}

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const { t, isRTL } = useLanguage();
  const [stats, setStats] = useState<Stats>({
    totalMenuItems: 0,
    totalReservations: 0,
    pendingReservations: 0,
    totalStaff: 0
  });
  const [recentReservations, setRecentReservations] = useState<RecentReservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch menu items count
        const menuSnapshot = await getDocs(collection(db, "menu"));
        
        // Fetch reservations
        const reservationsSnapshot = await getDocs(collection(db, "reservations"));
        const reservations = reservationsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as RecentReservation[];
        
        const pendingCount = reservations.filter(r => r.status === "pending").length;

        // Fetch staff count (admin only)
        let staffCount = 0;
        if (isAdmin) {
          const staffQuery = query(
            collection(db, "users"),
            where("role", "in", ["admin", "staff"])
          );
          const staffSnapshot = await getDocs(staffQuery);
          staffCount = staffSnapshot.size;
        }

        setStats({
          totalMenuItems: menuSnapshot.size,
          totalReservations: reservations.length,
          pendingReservations: pendingCount,
          totalStaff: staffCount
        });

        // Get recent reservations (last 5)
        setRecentReservations(
          reservations
            .sort((a, b) => {
              const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
              const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
              return dateB.getTime() - dateA.getTime();
            })
            .slice(0, 5)
        );
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  const statCards = [
    { 
      label: t.admin.dashboard.menuItems, 
      value: stats.totalMenuItems, 
      icon: UtensilsCrossed, 
      color: "text-orange-500",
      bgColor: "bg-orange-500/10"
    },
    { 
      label: t.admin.dashboard.totalReservations, 
      value: stats.totalReservations, 
      icon: CalendarDays, 
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    { 
      label: t.admin.dashboard.pending, 
      value: stats.pendingReservations, 
      icon: Clock, 
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    ...(isAdmin ? [{ 
      label: t.admin.dashboard.staffMembers, 
      value: stats.totalStaff, 
      icon: Users, 
      color: "text-green-500",
      bgColor: "bg-green-500/10"
    }] : [])
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle2 className="w-3 h-3" />
            {t.admin.dashboard.confirmed}
          </span>
        );
      case "pending":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-3 h-3" />
            {t.admin.dashboard.pending}
          </span>
        );
      case "cancelled":
        return (
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <AlertCircle className="w-3 h-3" />
            {t.admin.dashboard.cancelled}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-600">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.admin.dashboard.title}</h1>
        <p className="text-muted-foreground">{t.admin.dashboard.subtitle}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index}
              className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Reservations */}
      <div className="bg-card rounded-xl border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{t.admin.dashboard.recentReservations}</h2>
        </div>
        <div className="p-6">
          {recentReservations.length === 0 ? (
            <div className="text-center py-8">
              <CalendarDays className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">{t.admin.dashboard.noReservations}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentReservations.map((reservation) => (
                <div 
                  key={reservation.id}
                  className={`flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div>
                    <p className="font-medium text-foreground">{reservation.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.date} {isRTL ? '•' : 'at'} {reservation.time} • {reservation.guests} {t.admin.dashboard.guests}
                    </p>
                  </div>
                  {getStatusBadge(reservation.status)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

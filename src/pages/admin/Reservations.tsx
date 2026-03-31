import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { 
  Search, 
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Calendar,
  Users,
  ChevronDown,
  Mail,
  MapPin,
  ShoppingBag,
  UtensilsCrossed
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
  status: "pending" | "confirmed" | "cancelled";
  createdAt: any;
}

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const snapshot = await getDocs(collection(db, "reservations"));
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      
      // Sort by date (newest first)
      items.sort((a, b) => {
        const dateA = a.createdAt instanceof Timestamp ? a.createdAt.toDate() : new Date(a.createdAt);
        const dateB = b.createdAt instanceof Timestamp ? b.createdAt.toDate() : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });
      
      setReservations(items);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: Reservation["status"]) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "reservations", id), { status });
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      );
    } catch (error) {
      console.error("Error updating reservation:", error);
      alert("Failed to update reservation status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600">
            <CheckCircle2 className="w-4 h-4" />
            Confirmed
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-600">
            <Clock className="w-4 h-4" />
            Pending
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-600">
            <XCircle className="w-4 h-4" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // Filter reservations
  const filteredReservations = reservations.filter(r => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const stats = {
    total: reservations.length,
    pending: reservations.filter(r => r.status === "pending").length,
    confirmed: reservations.filter(r => r.status === "confirmed").length,
    cancelled: reservations.filter(r => r.status === "cancelled").length
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reservations</h1>
        <p className="text-muted-foreground">Manage table reservations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-yellow-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-green-600">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-red-600">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">No reservations found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReservations.map((reservation) => (
            <div 
              key={reservation.id}
              className="bg-card rounded-xl border border-border p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col gap-4">
                {/* Header with name and status */}
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-foreground text-lg">{reservation.name}</h3>
                  {getStatusBadge(reservation.status)}
                </div>

                {/* All Details in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  {/* Phone */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="truncate">{reservation.phone}</span>
                  </div>

                  {/* Email */}
                  {reservation.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{reservation.email}</span>
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{reservation.date} at {reservation.time}</span>
                  </div>

                  {/* Guests */}
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{reservation.guests} guests</span>
                  </div>

                  {/* Service Type */}
                  {reservation.serviceType && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <UtensilsCrossed className="w-4 h-4 shrink-0" />
                      <span>{reservation.serviceType}</span>
                    </div>
                  )}

                  {/* Location */}
                  {reservation.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{reservation.location}</span>
                    </div>
                  )}
                </div>

                {/* Special Message */}
                {reservation.message && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Special Request:</span> {reservation.message}
                    </p>
                  </div>
                )}

                {/* Pre-ordered Items */}
                {reservation.orderItems && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex items-start gap-2">
                      <ShoppingBag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground mb-1">Pre-ordered Items:</p>
                        <p className="text-sm text-muted-foreground">{reservation.orderItems}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  {reservation.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(reservation.id, "confirmed")}
                        disabled={updatingId === reservation.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(reservation.id, "cancelled")}
                        disabled={updatingId === reservation.id}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                    </>
                  )}
                  {reservation.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(reservation.id, "cancelled")}
                      disabled={updatingId === reservation.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>
                  )}
                  {reservation.status === "cancelled" && (
                    <button
                      onClick={() => updateStatus(reservation.id, "pending")}
                      disabled={updatingId === reservation.id}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors disabled:opacity-50"
                    >
                      <Clock className="w-4 h-4" />
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;

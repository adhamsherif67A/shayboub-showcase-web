import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { collection, getDocs, updateDoc, doc, deleteDoc, Timestamp } from "firebase/firestore";
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
  UtensilsCrossed,
  Download,
  Printer,
  FileSpreadsheet,
  Trash2,
  DollarSign,
  CalendarDays
} from "lucide-react";
import * as XLSX from 'xlsx';

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

const Reservations = () => {
  const { t, isRTL } = useLanguage();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [locationFilter, setLocationFilter] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [printDate, setPrintDate] = useState(new Date().toISOString().split('T')[0]);

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

  // SMS notification function (placeholder - needs SMS service like Twilio)
  const sendSMS = async (phone: string, message: string) => {
    try {
      // TODO: Implement with SMS service (Twilio, AWS SNS, etc.)
      console.log(`SMS to ${phone}: ${message}`);
      
      // Example Twilio implementation:
      // const response = await fetch('/api/send-sms', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ to: phone, message })
      // });
      // return response.ok;
      
      return true; // Placeholder
    } catch (error) {
      console.error("Error sending SMS:", error);
      return false;
    }
  };

  const updateStatus = async (id: string, status: Reservation["status"]) => {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "reservations", id), { status });
      
      const reservation = reservations.find(r => r.id === id);
      if (reservation && status === "confirmed") {
        const smsMessage = `Hi ${reservation.name}! Your reservation at Shayboub Cafe for ${reservation.date} at ${reservation.time} has been confirmed. We look forward to serving you! - Shayboub Team`;
        await sendSMS(reservation.phone, smsMessage);
      }
      
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

  // Delete reservation
  const deleteReservation = async (id: string, name: string) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete the reservation for ${name}? This action cannot be undone.`)) {
      return;
    }

    setUpdatingId(id);
    try {
      await deleteDoc(doc(db, "reservations", id));
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Error deleting reservation:", error);
      alert("Failed to delete reservation");
    } finally {
      setUpdatingId(null);
    }
  };

  // Export to Excel
  const exportToExcel = () => {
    const data = filteredReservations.map(r => ({
      Name: r.name,
      Phone: r.phone,
      Email: r.email || "",
      Date: r.date,
      Time: r.time,
      Guests: r.guests,
      Location: r.location || "",
      "Service Type": r.serviceType || "",
      "Pre-ordered Items": r.orderItems || "",
      "Total Amount (EGP)": r.totalAmount ? r.totalAmount.toFixed(2) : "0.00",
      "Special Request": r.message || "",
      Status: r.status,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Reservations");
    
    const fileName = `reservations_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Print reservations for selected date
  const printReservations = () => {
    const selectedDateReservations = filteredReservations.filter(r => r.date === printDate);
    
    const printWindow = window.open('', '', 'height=800,width=1000');
    if (!printWindow) return;
    
    printWindow.document.write('<html><head><title>Reservations - ' + printDate + '</title>');
    printWindow.document.write('<style>');
    printWindow.document.write('body { font-family: Arial, sans-serif; padding: 20px; }');
    printWindow.document.write('h1 { color: #000; margin-bottom: 20px; }');
    printWindow.document.write('table { width: 100%; border-collapse: collapse; margin-top: 20px; }');
    printWindow.document.write('th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }');
    printWindow.document.write('th { background-color: #f5f5f5; font-weight: bold; }');
    printWindow.document.write('.status { padding: 4px 8px; border-radius: 4px; font-size: 12px; }');
    printWindow.document.write('.pending { background: #fef3c7; color: #92400e; }');
    printWindow.document.write('.confirmed { background: #d1fae5; color: #065f46; }');
    printWindow.document.write('.cancelled { background: #fee2e2; color: #991b1b; }');
    printWindow.document.write('@media print { button { display: none; } }');
    printWindow.document.write('</style></head><body>');
    printWindow.document.write('<h1>Shayboub Café - Reservations for ' + printDate + '</h1>');
    printWindow.document.write('<p>Total: ' + selectedDateReservations.length + ' reservations</p>');
    
    // Add revenue summary if there are confirmed pre-orders
    const confirmedWithRevenue = selectedDateReservations.filter(r => 
      r.status === "confirmed" && r.totalAmount && r.totalAmount > 0
    );
    if (confirmedWithRevenue.length > 0) {
      const totalRevenue = confirmedWithRevenue.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
      printWindow.document.write('<p><strong>Pre-order Revenue: ' + totalRevenue.toFixed(2) + ' EGP (' + confirmedWithRevenue.length + ' orders)</strong></p>');
    }
    
    printWindow.document.write('<table>');
    printWindow.document.write('<tr><th>Time</th><th>Name</th><th>Phone</th><th>Guests</th><th>Location</th><th>Status</th><th>Revenue</th></tr>');
    
    selectedDateReservations.forEach(r => {
      printWindow.document.write('<tr>');
      printWindow.document.write('<td>' + r.time + '</td>');
      printWindow.document.write('<td>' + r.name + '</td>');
      printWindow.document.write('<td>' + r.phone + '</td>');
      printWindow.document.write('<td>' + r.guests + '</td>');
      printWindow.document.write('<td>' + (r.location || '') + '</td>');
      printWindow.document.write('<td><span class="status ' + r.status + '">' + r.status + '</span></td>');
      printWindow.document.write('<td>' + ((r.totalAmount && r.totalAmount > 0) ? r.totalAmount.toFixed(2) + ' EGP' : '-') + '</td>');
      printWindow.document.write('</tr>');
    });
    
    printWindow.document.write('</table>');
    printWindow.document.write('<button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #000; color: #fff; border: none; border-radius: 5px; cursor: pointer;">Print</button>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.focus();
    }, 250);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CheckCircle2 className="w-4 h-4" />
            {t.admin.reservationsPage.confirmed}
          </span>
        );
      case "pending":
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/10 text-yellow-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Clock className="w-4 h-4" />
            {t.admin.reservationsPage.pending}
          </span>
        );
      case "cancelled":
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-500/10 text-red-600 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <XCircle className="w-4 h-4" />
            {t.admin.reservationsPage.cancelled}
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
    const matchesLocation = locationFilter === "all" || r.location === locationFilter;
    return matchesSearch && matchesStatus && matchesLocation;
  });

  // Stats (based on current filters)
  const stats = {
    total: filteredReservations.length,
    pending: filteredReservations.filter(r => r.status === "pending").length,
    confirmed: filteredReservations.filter(r => r.status === "confirmed").length,
    cancelled: filteredReservations.filter(r => r.status === "cancelled").length
  };

  // Calculate daily revenue (confirmed reservations with pre-orders for today)
  const calculateDailyRevenue = () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysReservations = reservations.filter(r => 
      r.date === today && 
      r.status === "confirmed" && 
      r.totalAmount && 
      r.totalAmount > 0
    );
    
    const totalRevenue = todaysReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    const totalOrders = todaysReservations.length;
    
    // Debug info (remove in production)
    console.log('Revenue Debug Info:', {
      today,
      totalReservations: reservations.length,
      todaysConfirmed: reservations.filter(r => r.date === today && r.status === "confirmed").length,
      todaysWithAmount: todaysReservations.length,
      totalRevenue,
      reservationsBreakdown: reservations.map(r => ({
        name: r.name,
        date: r.date,
        status: r.status,
        totalAmount: r.totalAmount,
        hasPreOrder: !!r.orderItems
      }))
    });
    
    return { totalRevenue, totalOrders };
  };

  const dailyStats = calculateDailyRevenue();

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
    <div className={`space-y-6 ${isRTL ? 'text-right' : ''}`}>
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">{t.admin.reservationsPage.title}</h1>
          <p className="text-muted-foreground">{t.admin.reservationsPage.subtitle}</p>
          
          {/* Daily Revenue Stats */}
          <div className={`flex gap-4 mt-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <DollarSign className="w-4 h-4 text-green-600" />
                <p className="text-xs text-green-600 font-medium">{t.admin.reservationsPage.todaysRevenue}</p>
              </div>
              <p className="text-lg font-bold text-green-700">{dailyStats.totalRevenue.toFixed(2)} EGP</p>
              <p className="text-xs text-green-600">({dailyStats.totalOrders} pre-orders)</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
              <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-blue-600 font-medium">{t.admin.reservationsPage.tomorrowsBookings}</p>
              </div>
              <p className="text-lg font-bold text-blue-700">
                {(() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const tomorrowDate = tomorrow.toISOString().split('T')[0];
                  const tomorrowReservations = reservations.filter(r => 
                    r.date === tomorrowDate && 
                    r.status === "confirmed" && 
                    r.totalAmount && 
                    r.totalAmount > 0
                  );
                  const tomorrowRevenue = tomorrowReservations.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
                  return `${tomorrowRevenue.toFixed(2)} EGP`;
                })()}
              </p>
              <p className="text-xs text-blue-600">
                ({(() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const tomorrowDate = tomorrow.toISOString().split('T')[0];
                  const tomorrowReservations = reservations.filter(r => 
                    r.date === tomorrowDate && 
                    r.status === "confirmed" && 
                    r.totalAmount && 
                    r.totalAmount > 0
                  );
                  return tomorrowReservations.length;
                })()} pre-orders)
              </p>
            </div>
          </div>
        </div>
        
        {/* Export Buttons */}
        <div className={`flex gap-2 items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
          {/* Date picker for printing */}
          <div className={`flex items-center gap-2 px-3 py-2 border border-border rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
            <CalendarDays className="w-4 h-4 text-muted-foreground" />
            <input
              type="date"
              value={printDate}
              onChange={(e) => setPrintDate(e.target.value)}
              className="text-sm bg-transparent border-none outline-none"
            />
          </div>
          
          <button
            onClick={printReservations}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Printer className="w-4 h-4" />
            {t.admin.reservationsPage.printDate}
          </button>
          
          <button
            onClick={exportToExcel}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            {t.admin.reservationsPage.exportExcel}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{t.admin.reservationsPage.total}</p>
          <p className="text-2xl font-bold text-foreground">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-yellow-600">{t.admin.reservationsPage.pending}</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-green-600">{t.admin.reservationsPage.confirmed}</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm text-red-600">{t.admin.reservationsPage.cancelled}</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </div>
      </div>

      {/* Filters */}
      <div className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
        <div className="relative flex-1">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
          <input
            type="text"
            placeholder={t.admin.reservationsPage.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'pr-11 pl-4' : 'pl-11 pr-4'}`}
          />
        </div>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'text-right' : ''}`}
        >
          <option value="all">{t.admin.reservationsPage.allBranches}</option>
          <option value="Cairo - New Cairo">{t.admin.locations.cairoNewCairo}</option>
          <option value="Alexandria - Kafr Abdou">{t.admin.locations.alexKafrAbdou}</option>
          <option value="Alexandria - Gleem">{t.admin.locations.alexGleem}</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={`px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 ${isRTL ? 'text-right' : ''}`}
        >
          <option value="all">{t.admin.reservationsPage.allStatus}</option>
          <option value="pending">{t.admin.reservationsPage.pending}</option>
          <option value="confirmed">{t.admin.reservationsPage.confirmed}</option>
          <option value="cancelled">{t.admin.reservationsPage.cancelled}</option>
        </select>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="text-center py-12 bg-card rounded-xl border border-border">
          <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <p className="text-muted-foreground">{t.admin.reservationsPage.noReservations}</p>
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
                <div className={`flex items-center justify-between gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <h3 className="font-semibold text-foreground text-lg">{reservation.name}</h3>
                  {getStatusBadge(reservation.status)}
                </div>

                {/* All Details in Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                  {/* Phone */}
                  <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className="w-4 h-4 shrink-0" />
                    <span className="truncate">{reservation.phone}</span>
                  </div>

                  {/* Email */}
                  {reservation.email && (
                    <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Mail className="w-4 h-4 shrink-0" />
                      <span className="truncate">{reservation.email}</span>
                    </div>
                  )}

                  {/* Date & Time */}
                  <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>{reservation.date} at {reservation.time}</span>
                  </div>

                  {/* Guests */}
                  <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className="w-4 h-4 shrink-0" />
                    <span>{reservation.guests} {t.admin.reservationsPage.guests}</span>
                  </div>

                  {/* Service Type */}
                  {reservation.serviceType && (
                    <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <UtensilsCrossed className="w-4 h-4 shrink-0" />
                      <span>{reservation.serviceType}</span>
                    </div>
                  )}

                  {/* Location */}
                  {reservation.location && (
                    <div className={`flex items-center gap-2 text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate">{reservation.location}</span>
                    </div>
                  )}
                </div>

                {/* Special Message */}
                {reservation.message && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>
                      <span className="font-medium text-foreground">{t.admin.reservationsPage.specialRequest}</span> {reservation.message}
                    </p>
                  </div>
                )}

                {/* Pre-ordered Items */}
                {reservation.orderItems && (
                  <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                    <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ShoppingBag className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <p className={`text-sm font-medium text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>{t.admin.reservationsPage.preOrderedItems}</p>
                        <p className={`text-sm text-muted-foreground ${isRTL ? 'text-right' : ''}`}>{reservation.orderItems}</p>
                        {reservation.totalAmount && reservation.totalAmount > 0 && (
                          <div className="mt-2 pt-2 border-t border-primary/20">
                            <p className={`text-sm font-bold text-primary ${isRTL ? 'text-right' : ''}`}>
                              {t.admin.reservationsPage.totalAmount} {reservation.totalAmount.toFixed(2)} EGP
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Actions */}
                <div className={`flex gap-2 pt-2 border-t border-border ${isRTL ? 'flex-row-reverse' : ''}`}>
                  {reservation.status === "pending" && (
                    <>
                      <button
                        onClick={() => updateStatus(reservation.id, "confirmed")}
                        disabled={updatingId === reservation.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {t.admin.reservationsPage.confirm}
                      </button>
                      <button
                        onClick={() => updateStatus(reservation.id, "cancelled")}
                        disabled={updatingId === reservation.id}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <XCircle className="w-4 h-4" />
                        {t.admin.reservationsPage.cancel}
                      </button>
                    </>
                  )}
                  {reservation.status === "confirmed" && (
                    <button
                      onClick={() => updateStatus(reservation.id, "cancelled")}
                      disabled={updatingId === reservation.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <XCircle className="w-4 h-4" />
                      {t.admin.reservationsPage.cancel}
                    </button>
                  )}
                  {reservation.status === "cancelled" && (
                    <button
                      onClick={() => updateStatus(reservation.id, "pending")}
                      disabled={updatingId === reservation.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors disabled:opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Clock className="w-4 h-4" />
                      {t.admin.reservationsPage.reopen}
                    </button>
                  )}
                  
                  {/* Delete button - show for confirmed or cancelled reservations */}
                  {(reservation.status === "confirmed" || reservation.status === "cancelled") && (
                    <button
                      onClick={() => deleteReservation(reservation.id, reservation.name)}
                      disabled={updatingId === reservation.id}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-500/30 transition-colors disabled:opacity-50 ${isRTL ? 'mr-auto flex-row-reverse' : 'ml-auto'}`}
                      title="Delete reservation permanently"
                    >
                      <Trash2 className="w-4 h-4" />
                      {t.admin.reservationsPage.delete}
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

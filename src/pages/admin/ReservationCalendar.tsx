import { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Clock,
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight
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

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  extendedProps: Reservation;
}

const ReservationCalendar = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState(false);

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
      
      setReservations(items);
      
      // Convert to calendar events
      const calendarEvents: CalendarEvent[] = items.map(res => {
        const startDateTime = `${res.date}T${res.time}:00`;
        const endDateTime = new Date(new Date(startDateTime).getTime() + 90 * 60000).toISOString();
        
        let bgColor = '#f59e0b'; // pending - amber
        let borderColor = '#d97706';
        if (res.status === 'confirmed') {
          bgColor = '#22c55e'; // green
          borderColor = '#16a34a';
        } else if (res.status === 'cancelled') {
          bgColor = '#ef4444'; // red
          borderColor = '#dc2626';
        }
        
        return {
          id: res.id,
          title: `${res.name} (${res.guests} guests)`,
          start: startDateTime,
          end: endDateTime,
          backgroundColor: bgColor,
          borderColor: borderColor,
          textColor: '#ffffff',
          extendedProps: res
        };
      });
      
      setEvents(calendarEvents);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (info: any) => {
    setSelectedReservation(info.event.extendedProps);
  };

  const handleEventDrop = async (info: any) => {
    const { event } = info;
    const newDate = event.start.toISOString().split('T')[0];
    const newTime = event.start.toTimeString().slice(0, 5);
    
    try {
      setUpdating(true);
      await updateDoc(doc(db, "reservations", event.id), {
        date: newDate,
        time: newTime
      });
      
      // Update local state
      setReservations(prev => prev.map(r => 
        r.id === event.id ? { ...r, date: newDate, time: newTime } : r
      ));
      
      // Show success feedback
      alert(`Reservation moved to ${newDate} at ${newTime}`);
    } catch (error) {
      console.error("Error updating reservation:", error);
      info.revert();
      alert("Failed to update reservation");
    } finally {
      setUpdating(false);
    }
  };

  const updateStatus = async (id: string, status: "pending" | "confirmed" | "cancelled") => {
    try {
      setUpdating(true);
      await updateDoc(doc(db, "reservations", id), { status });
      
      // Update local state
      setReservations(prev => prev.map(r => 
        r.id === id ? { ...r, status } : r
      ));
      
      // Update events
      setEvents(prev => prev.map(e => {
        if (e.id === id) {
          let bgColor = '#f59e0b';
          let borderColor = '#d97706';
          if (status === 'confirmed') {
            bgColor = '#22c55e';
            borderColor = '#16a34a';
          } else if (status === 'cancelled') {
            bgColor = '#ef4444';
            borderColor = '#dc2626';
          }
          return { ...e, backgroundColor: bgColor, borderColor: borderColor, extendedProps: { ...e.extendedProps, status } };
        }
        return e;
      }));
      
      if (selectedReservation?.id === id) {
        setSelectedReservation(prev => prev ? { ...prev, status } : null);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getLocationName = (location?: string) => {
    switch(location) {
      case 'cairo': return 'Cairo - New Cairo';
      case 'alex-smouha': return 'Alexandria - Smouha';
      case 'alex-sidi-gaber': return 'Alexandria - Sidi Gaber';
      default: return location || 'Not specified';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            Reservation Calendar
          </h1>
          <p className="text-muted-foreground">
            Visual calendar view • Drag to reschedule
          </p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Confirmed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Cancelled</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-muted-foreground text-sm">Total</p>
          <p className="text-2xl font-bold">{reservations.length}</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-muted-foreground text-sm">Pending</p>
          <p className="text-2xl font-bold text-amber-500">
            {reservations.filter(r => r.status === 'pending').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-muted-foreground text-sm">Confirmed</p>
          <p className="text-2xl font-bold text-green-500">
            {reservations.filter(r => r.status === 'confirmed').length}
          </p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border">
          <p className="text-muted-foreground text-sm">Today</p>
          <p className="text-2xl font-bold text-primary">
            {reservations.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-card rounded-xl p-4 md:p-6 border border-border">
        <style>{`
          .fc {
            --fc-border-color: hsl(var(--border));
            --fc-button-bg-color: hsl(var(--primary));
            --fc-button-border-color: hsl(var(--primary));
            --fc-button-hover-bg-color: hsl(var(--primary) / 0.9);
            --fc-button-hover-border-color: hsl(var(--primary) / 0.9);
            --fc-button-active-bg-color: hsl(var(--primary) / 0.8);
            --fc-button-active-border-color: hsl(var(--primary) / 0.8);
            --fc-today-bg-color: hsl(var(--primary) / 0.1);
            --fc-event-border-color: transparent;
            --fc-page-bg-color: transparent;
          }
          .fc .fc-toolbar-title {
            font-size: 1.25rem;
            font-weight: 600;
          }
          .fc .fc-button {
            padding: 0.5rem 1rem;
            font-weight: 500;
            border-radius: 0.5rem;
          }
          .fc .fc-daygrid-day-number,
          .fc .fc-col-header-cell-cushion {
            color: hsl(var(--foreground));
          }
          .fc .fc-event {
            cursor: pointer;
            padding: 2px 4px;
            border-radius: 4px;
            font-size: 0.75rem;
          }
          .fc .fc-event:hover {
            opacity: 0.9;
          }
          .fc-timegrid-slot {
            height: 3rem;
          }
          .fc .fc-timegrid-slot-label {
            color: hsl(var(--muted-foreground));
          }
          @media (max-width: 640px) {
            .fc .fc-toolbar {
              flex-direction: column;
              gap: 0.5rem;
            }
            .fc .fc-toolbar-title {
              font-size: 1rem;
            }
            .fc .fc-button {
              padding: 0.375rem 0.5rem;
              font-size: 0.75rem;
            }
          }
        `}</style>
        
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          editable={true}
          droppable={true}
          eventClick={handleEventClick}
          eventDrop={handleEventDrop}
          height="auto"
          slotMinTime="08:00:00"
          slotMaxTime="24:00:00"
          allDaySlot={false}
          nowIndicator={true}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
        />
      </div>

      {/* Reservation Detail Modal */}
      {selectedReservation && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedReservation(null)}
        >
          <div 
            className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Reservation Details</h2>
              <button 
                onClick={() => setSelectedReservation(null)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Badge */}
            <div className="mb-6">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium
                ${selectedReservation.status === 'confirmed' ? 'bg-green-500/10 text-green-600' : ''}
                ${selectedReservation.status === 'pending' ? 'bg-amber-500/10 text-amber-600' : ''}
                ${selectedReservation.status === 'cancelled' ? 'bg-red-500/10 text-red-600' : ''}
              `}>
                {selectedReservation.status === 'confirmed' && <CheckCircle2 className="w-4 h-4" />}
                {selectedReservation.status === 'pending' && <Clock className="w-4 h-4" />}
                {selectedReservation.status === 'cancelled' && <XCircle className="w-4 h-4" />}
                {selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}
              </span>
            </div>

            {/* Customer Info */}
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-2xl font-bold">{selectedReservation.name}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{selectedReservation.date}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{selectedReservation.time}</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{selectedReservation.guests} guests</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{getLocationName(selectedReservation.location)}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <a 
                  href={`tel:${selectedReservation.phone}`}
                  className="flex items-center gap-3 text-primary hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {selectedReservation.phone}
                </a>
                {selectedReservation.email && (
                  <a 
                    href={`mailto:${selectedReservation.email}`}
                    className="flex items-center gap-3 text-primary hover:underline"
                  >
                    <Mail className="w-4 h-4" />
                    {selectedReservation.email}
                  </a>
                )}
              </div>

              {/* Pre-order Items */}
              {selectedReservation.orderItems && (
                <div className="pt-4 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-4 h-4 text-primary" />
                    <span className="font-medium">Pre-order Items</span>
                  </div>
                  <p className="text-muted-foreground text-sm whitespace-pre-wrap">
                    {selectedReservation.orderItems}
                  </p>
                  {selectedReservation.totalAmount && (
                    <p className="mt-2 font-bold text-primary">
                      Total: EGP {selectedReservation.totalAmount}
                    </p>
                  )}
                </div>
              )}

              {/* Special Requests */}
              {selectedReservation.message && (
                <div className="pt-4 border-t border-border">
                  <p className="font-medium mb-2">Special Requests</p>
                  <p className="text-muted-foreground text-sm">
                    {selectedReservation.message}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {selectedReservation.status !== 'confirmed' && (
                <button
                  onClick={() => updateStatus(selectedReservation.id, 'confirmed')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm
                </button>
              )}
              {selectedReservation.status !== 'cancelled' && (
                <button
                  onClick={() => updateStatus(selectedReservation.id, 'cancelled')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-3 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              )}
              {selectedReservation.status !== 'pending' && (
                <button
                  onClick={() => updateStatus(selectedReservation.id, 'pending')}
                  disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-3 rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50"
                >
                  <Clock className="w-4 h-4" />
                  Set Pending
                </button>
              )}
            </div>

            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${selectedReservation.phone.replace(/[^0-9]/g, '')}?text=Hi ${selectedReservation.name}, this is Shayboub regarding your reservation on ${selectedReservation.date} at ${selectedReservation.time}.`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp Customer
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationCalendar;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Award, 
  Calendar, 
  Gift, 
  TrendingUp, 
  Ticket, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Copy,
  User,
  MapPin,
  Users
} from "lucide-react";

interface Reservation {
  id: string;
  date: string;
  time: string;
  serviceType: string;
  location: string;
  partySize: number;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  pointsEarned?: number;
  voucherCode?: string;
  createdAt: any;
}

interface Voucher {
  id: string;
  code: string;
  type: "25_off" | "free_drink" | "free_item" | "birthday";
  discount: string;
  description: string;
  expiresAt: any;
  usedAt: any | null;
  status: "active" | "used" | "expired";
  createdAt: any;
}

const MyAccount = () => {
  const { user, loading: authLoading, refreshCustomerData } = useAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const isRTL = language === "ar";

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/customer-login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user?.uid) {
      loadData();
    }
  }, [user?.uid]);

  const loadData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      // Load reservations - use simple query without orderBy to avoid index requirement
      const reservationsQuery = query(
        collection(db, "reservations"),
        where("customerId", "==", user.uid)
      );
      const reservationsSnapshot = await getDocs(reservationsQuery);
      const reservationsData = reservationsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Reservation[];
      // Sort client-side
      reservationsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setReservations(reservationsData);

      // Load vouchers - use simple query without orderBy to avoid index requirement
      const vouchersQuery = query(
        collection(db, "vouchers"),
        where("customerId", "==", user.uid)
      );
      const vouchersSnapshot = await getDocs(vouchersQuery);
      const vouchersData = vouchersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Voucher[];
      // Sort client-side
      vouchersData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(0);
        const dateB = b.createdAt?.toDate?.() || new Date(0);
        return dateB.getTime() - dateA.getTime();
      });
      setVouchers(vouchersData);

      // Refresh customer data
      await refreshCustomerData();
    } catch (error) {
      console.error("Error loading data:", error);
      // Don't show error toast for empty data - this is normal for new users
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async (rewardType: "25_off" | "free_drink") => {
    if (!user?.uid) return;

    const points = user.customerData?.points || 0;
    const requiredPoints = rewardType === "25_off" ? 50 : 100;

    if (points < requiredPoints) {
      toast({
        title: t.loyalty.earnMorePoints.replace("{points}", String(requiredPoints - points)),
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate voucher code
      const code = `${rewardType.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
      
      // Create voucher
      await addDoc(collection(db, "vouchers"), {
        customerId: user.uid,
        code,
        type: rewardType,
        discount: rewardType === "25_off" ? "25%" : "100%",
        description: rewardType === "25_off" ? t.loyalty.reward25OffDesc : t.loyalty.rewardFreeDrinkDesc,
        status: "active",
        usedAt: null,
        expiresAt: null, // Never expires
        createdAt: serverTimestamp(),
      });

      // Reload data
      await loadData();

      toast({
        title: t.loyalty.congratulations,
        description: t.loyalty.rewardClaimedSuccess,
      });

      // Show voucher code
      setTimeout(() => {
        toast({
          title: t.loyalty.yourDiscountCode,
          description: code,
          action: (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(code);
                toast({ title: t.loyalty.codeCopied });
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          ),
        });
      }, 1000);
    } catch (error) {
      console.error("Error claiming reward:", error);
      toast({
        title: "Error",
        description: "Failed to claim reward",
        variant: "destructive",
      });
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({ title: t.loyalty.codeCopied });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const customerData = user.customerData;
  const points = customerData?.points || 0;
  const totalVisits = customerData?.totalVisits || 0;
  const totalPointsEarned = customerData?.totalPointsEarned || 0;
  const totalPointsSpent = customerData?.totalPointsSpent || 0;

  // Calculate progress
  const progressTo50 = Math.min((points / 50) * 100, 100);
  const progressTo100 = Math.min((points / 100) * 100, 100);

  // Filter vouchers
  const activeVouchers = vouchers.filter(v => v.status === "active");
  const usedVouchers = vouchers.filter(v => v.status === "used");

  // Get status icon and color
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return t.loyalty.statusConfirmed;
      case "pending":
        return t.loyalty.statusPending;
      case "cancelled":
        return t.loyalty.statusCancelled;
      case "completed":
        return t.loyalty.statusCompleted;
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b from-background to-muted/20 ${isRTL ? "rtl" : "ltr"}`}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t.loyalty.myAccount}</h1>
              <p className="text-primary-foreground/80 flex items-center gap-2">
                <User className="h-4 w-4" />
                {customerData?.name}
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-1">{points}</div>
              <div className="text-sm text-primary-foreground/80">{t.loyalty.points}</div>
            </div>
          </div>
          {customerData?.joinedAt && (
            <p className="text-sm text-primary-foreground/60">
              {t.loyalty.memberSince} {formatTimestamp(customerData.joinedAt)}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.loyalty.totalVisits}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalVisits}</div>
              <p className="text-xs text-muted-foreground mt-1">{t.loyalty.visits}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.loyalty.totalEarned}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPointsEarned}</div>
              <p className="text-xs text-muted-foreground mt-1">{t.loyalty.points}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t.loyalty.totalSpent}</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalPointsSpent}</div>
              <p className="text-xs text-muted-foreground mt-1">{t.loyalty.points}</p>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Rewards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progress to 25% OFF */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-amber-500" />
                {t.loyalty.progressTo25}
              </CardTitle>
              <CardDescription>{t.loyalty.reward25OffDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{points} / 50 {t.loyalty.points}</span>
                  <span className="font-semibold">{Math.round(progressTo50)}%</span>
                </div>
                <Progress value={progressTo50} className="h-3" />
              </div>
              {points >= 50 ? (
                <Button 
                  onClick={() => claimReward("25_off")} 
                  className="w-full"
                  size="lg"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {t.loyalty.claimReward}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  {t.loyalty.earnMorePoints.replace("{points}", String(50 - points))}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Progress to Free Drink */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-500" />
                {t.loyalty.progressTo100}
              </CardTitle>
              <CardDescription>{t.loyalty.rewardFreeDrinkDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{points} / 100 {t.loyalty.points}</span>
                  <span className="font-semibold">{Math.round(progressTo100)}%</span>
                </div>
                <Progress value={progressTo100} className="h-3" />
              </div>
              {points >= 100 ? (
                <Button 
                  onClick={() => claimReward("free_drink")} 
                  className="w-full"
                  size="lg"
                >
                  <Gift className="h-4 w-4 mr-2" />
                  {t.loyalty.claimReward}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground text-center">
                  {t.loyalty.earnMorePoints.replace("{points}", String(100 - points))}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Vouchers Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              {t.loyalty.yourVouchers}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Active Vouchers */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {t.loyalty.activeVouchers}
              </h3>
              {activeVouchers.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  {t.loyalty.noActiveVouchers}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeVouchers.map((voucher) => (
                    <div
                      key={voucher.id}
                      className="border rounded-lg p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge variant="default" className="mb-2">
                            {t.loyalty.discount}: {voucher.discount}
                          </Badge>
                          <p className="text-sm text-muted-foreground">
                            {voucher.description}
                          </p>
                        </div>
                        <Ticket className="h-5 w-5 text-green-600" />
                      </div>
                      <Separator className="my-3" />
                      <div className="flex items-center justify-between">
                        <div className="font-mono text-lg font-bold">
                          {voucher.code}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyVoucherCode(voucher.code)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      {voucher.expiresAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {t.loyalty.expires}: {formatTimestamp(voucher.expiresAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Used Vouchers */}
            {usedVouchers.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                    {t.loyalty.usedVouchers}
                  </h3>
                  <div className="space-y-2">
                    {usedVouchers.map((voucher) => (
                      <div
                        key={voucher.id}
                        className="border rounded-lg p-3 bg-muted/50 opacity-75"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-mono font-semibold">{voucher.code}</div>
                            <p className="text-xs text-muted-foreground">
                              {t.loyalty.usedOn}: {formatTimestamp(voucher.usedAt)}
                            </p>
                          </div>
                          <Badge variant="secondary">{voucher.discount}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Booking History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {t.loyalty.bookingHistory}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reservations.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">{t.loyalty.noBookings}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.loyalty.makeFirstBooking}
                </p>
                <Button onClick={() => navigate("/")}>
                  {t.reservation.title}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {reservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">
                            {formatDate(reservation.date)}
                          </h3>
                          <Badge variant="outline">
                            {reservation.time}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {reservation.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {reservation.partySize} {reservation.partySize === 1 ? t.reservation.guest : t.reservation.guestsPlural}
                          </span>
                          <span className="capitalize">
                            {reservation.serviceType}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(reservation.status)}
                          <span className="text-sm font-medium">
                            {getStatusText(reservation.status)}
                          </span>
                        </div>
                        {reservation.pointsEarned && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                            {t.loyalty.pointsEarned.replace("{points}", String(reservation.pointsEarned))}
                          </Badge>
                        )}
                        {reservation.status === "pending" && (
                          <span className="text-xs text-muted-foreground">
                            {t.loyalty.pointsPending}
                          </span>
                        )}
                      </div>
                    </div>
                    {reservation.voucherCode && (
                      <div className="mt-2 pt-2 border-t">
                        <p className="text-xs text-muted-foreground">
                          {t.loyalty.usedVoucher.replace("{code}", reservation.voucherCode)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How to Earn Points */}
        <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              {t.loyalty.howToEarn}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  10
                </div>
                <div>
                  <p className="font-medium">{t.loyalty.earnPerBooking}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t.loyalty.pointsOnConfirmation}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  20
                </div>
                <div>
                  <p className="font-medium">{t.loyalty.earnFirstBooking}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  50
                </div>
                <div>
                  <p className="font-medium">{t.loyalty.earnBirthday}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MyAccount;

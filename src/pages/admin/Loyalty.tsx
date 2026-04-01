import { useState, useEffect } from "react";
import { collection, query, getDocs, orderBy, where, doc, updateDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Users, Gift, Trophy, Search, TrendingUp, Star, 
  Award, Phone, Mail, Calendar, ChevronDown, ChevronUp,
  Plus, Minus, Check, X, Eye, Copy
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  points: number;
  totalPointsEarned: number;
  totalPointsSpent: number;
  totalVisits: number;
  joinedAt: Date;
  lastVisit?: Date;
}

interface Voucher {
  id: string;
  code: string;
  type: "discount_25" | "free_drink" | "birthday_free_item";
  customerId: string;
  customerName?: string;
  status: "unused" | "used";
  createdAt: Date;
  usedAt?: Date;
}

interface PointsLog {
  id: string;
  customerId: string;
  customerName?: string;
  type: "earned" | "spent" | "bonus" | "birthday";
  amount: number;
  reason: string;
  createdAt: Date;
}

const AdminLoyalty = () => {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<"overview" | "customers" | "vouchers" | "points">("overview");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [pointsLogs, setPointsLogs] = useState<PointsLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCustomer, setExpandedCustomer] = useState<string | null>(null);
  const [adjustingPoints, setAdjustingPoints] = useState<string | null>(null);
  const [pointsAmount, setPointsAmount] = useState(0);
  const [pointsReason, setPointsReason] = useState("");

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch customers
        const customersQuery = query(collection(db, "customers"), orderBy("points", "desc"));
        const customersSnap = await getDocs(customersQuery);
        const customersData = customersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          joinedAt: doc.data().joinedAt?.toDate() || new Date(),
          lastVisit: doc.data().lastVisit?.toDate(),
        })) as Customer[];
        setCustomers(customersData);

        // Fetch vouchers
        const vouchersQuery = query(collection(db, "vouchers"), orderBy("createdAt", "desc"));
        const vouchersSnap = await getDocs(vouchersQuery);
        const vouchersData = vouchersSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          usedAt: doc.data().usedAt?.toDate(),
        })) as Voucher[];
        setVouchers(vouchersData);

        // Fetch points logs
        const logsQuery = query(collection(db, "pointsLog"), orderBy("createdAt", "desc"));
        const logsSnap = await getDocs(logsQuery);
        const logsData = logsSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as PointsLog[];
        setPointsLogs(logsData);

      } catch (error) {
        console.error("Error fetching loyalty data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter customers by search
  const filteredCustomers = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone?.includes(searchQuery)
  );

  // Stats
  const totalMembers = customers.length;
  const totalPointsIssued = customers.reduce((sum, c) => sum + (c.totalPointsEarned || 0), 0);
  const totalPointsRedeemed = customers.reduce((sum, c) => sum + (c.totalPointsSpent || 0), 0);
  const totalVouchersCreated = vouchers.length;
  const totalVouchersUsed = vouchers.filter(v => v.status === "used").length;
  const avgPointsPerCustomer = totalMembers > 0 ? Math.round(totalPointsIssued / totalMembers) : 0;

  // Manual points adjustment
  const adjustPoints = async (customerId: string, amount: number, reason: string) => {
    try {
      const customer = customers.find(c => c.id === customerId);
      if (!customer) return;

      const newPoints = Math.max(0, customer.points + amount);
      
      // Update customer
      await updateDoc(doc(db, "customers", customerId), {
        points: newPoints,
        totalPointsEarned: amount > 0 ? (customer.totalPointsEarned || 0) + amount : customer.totalPointsEarned,
        totalPointsSpent: amount < 0 ? (customer.totalPointsSpent || 0) + Math.abs(amount) : customer.totalPointsSpent,
      });

      // Log the adjustment
      await addDoc(collection(db, "pointsLog"), {
        customerId,
        customerName: customer.name,
        type: amount > 0 ? "bonus" : "spent",
        amount: Math.abs(amount),
        reason: reason || "Manual adjustment by admin",
        createdAt: serverTimestamp(),
      });

      // Update local state
      setCustomers(prev => prev.map(c => 
        c.id === customerId ? { ...c, points: newPoints } : c
      ));

      setAdjustingPoints(null);
      setPointsAmount(0);
      setPointsReason("");
    } catch (error) {
      console.error("Error adjusting points:", error);
    }
  };

  // Copy voucher code
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <Users className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold">{totalMembers}</div>
          <div className="text-sm opacity-80">{t.adminLoyalty?.totalMembers || "Total Members"}</div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-4 text-white">
          <Star className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold">{totalPointsIssued.toLocaleString()}</div>
          <div className="text-sm opacity-80">{t.adminLoyalty?.totalPointsIssued || "Points Issued"}</div>
        </div>
        
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <Trophy className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold">{totalPointsRedeemed.toLocaleString()}</div>
          <div className="text-sm opacity-80">{t.adminLoyalty?.totalPointsRedeemed || "Points Redeemed"}</div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <Gift className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold">{totalVouchersCreated}</div>
          <div className="text-sm opacity-80">{t.adminLoyalty?.vouchersCreated || "Vouchers Created"}</div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <Check className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold">{totalVouchersUsed}</div>
          <div className="text-sm opacity-80">{t.adminLoyalty?.vouchersUsed || "Vouchers Used"}</div>
        </div>
        
        <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-4 text-white">
          <TrendingUp className="w-6 h-6 mb-2 opacity-80" />
          <div className="text-2xl font-bold">{avgPointsPerCustomer}</div>
          <div className="text-sm opacity-80">{t.adminLoyalty?.avgPoints || "Avg Points/Customer"}</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-500" />
            {t.adminLoyalty?.topCustomers || "Top Customers"}
          </h3>
          <div className="space-y-3">
            {customers.slice(0, 5).map((customer, index) => (
              <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? "bg-yellow-400 text-yellow-900" :
                    index === 1 ? "bg-gray-300 text-gray-700" :
                    index === 2 ? "bg-orange-400 text-orange-900" :
                    "bg-gray-200 text-gray-600"
                  }`}>
                    {index + 1}
                  </span>
                  <div>
                    <div className="font-medium">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.totalVisits || 0} {t.adminLoyalty?.visits || "visits"}</div>
                  </div>
                </div>
                <div className="text-orange-600 font-bold">{customer.points} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Points Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            {t.adminLoyalty?.recentActivity || "Recent Activity"}
          </h3>
          <div className="space-y-3">
            {pointsLogs.slice(0, 5).map(log => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <div className="font-medium">{log.customerName || "Customer"}</div>
                  <div className="text-sm text-gray-500">{log.reason}</div>
                </div>
                <div className={`font-bold ${log.type === "earned" || log.type === "bonus" || log.type === "birthday" ? "text-green-600" : "text-red-600"}`}>
                  {log.type === "spent" ? "-" : "+"}{log.amount} pts
                </div>
              </div>
            ))}
            {pointsLogs.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {t.adminLoyalty?.noActivity || "No activity yet"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCustomers = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder={t.adminLoyalty?.searchCustomers || "Search customers..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 dark:bg-gray-700"
        />
      </div>

      {/* Customer List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.customer || "Customer"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.contact || "Contact"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.points || "Points"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.visits || "Visits"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.actions || "Actions"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredCustomers.map(customer => (
              <>
                <tr key={customer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium">{customer.name}</div>
                    {customer.birthday && (
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {customer.birthday}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3 text-gray-400" />
                      {customer.email}
                    </div>
                    <div className="text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      {customer.phone || "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-orange-600 font-bold text-lg">{customer.points}</span>
                    <div className="text-xs text-gray-500">
                      {t.adminLoyalty?.totalEarned || "Earned"}: {customer.totalPointsEarned || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 dark:text-white">
                    {customer.totalVisits || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedCustomer(expandedCustomer === customer.id ? null : customer.id)}
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setAdjustingPoints(adjustingPoints === customer.id ? null : customer.id)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
                
                {/* Expanded details */}
                {expandedCustomer === customer.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">{t.adminLoyalty?.joinedAt || "Joined"}:</span>
                          <div className="font-medium">{customer.joinedAt.toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{t.adminLoyalty?.lastVisit || "Last Visit"}:</span>
                          <div className="font-medium">{customer.lastVisit?.toLocaleDateString() || "-"}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{t.adminLoyalty?.totalSpent || "Points Spent"}:</span>
                          <div className="font-medium">{customer.totalPointsSpent || 0}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">{t.adminLoyalty?.rewardProgress || "Reward Progress"}:</span>
                          <div className="font-medium">{customer.points >= 100 ? "🎉 Free Drink!" : customer.points >= 50 ? "🎁 25% OFF!" : `${customer.points}/50`}</div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
                
                {/* Points adjustment */}
                {adjustingPoints === customer.id && (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 bg-orange-50 dark:bg-orange-900/20">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setPointsAmount(prev => prev - 10)}
                            className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            value={pointsAmount}
                            onChange={(e) => setPointsAmount(parseInt(e.target.value) || 0)}
                            className="w-20 px-3 py-2 border rounded-lg text-center"
                          />
                          <button
                            onClick={() => setPointsAmount(prev => prev + 10)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder={t.adminLoyalty?.reason || "Reason..."}
                          value={pointsReason}
                          onChange={(e) => setPointsReason(e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg min-w-[200px]"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adjustPoints(customer.id, pointsAmount, pointsReason)}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            {t.adminLoyalty?.apply || "Apply"}
                          </button>
                          <button
                            onClick={() => {
                              setAdjustingPoints(null);
                              setPointsAmount(0);
                              setPointsReason("");
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {searchQuery 
              ? (t.adminLoyalty?.noResults || "No customers found") 
              : (t.adminLoyalty?.noCustomers || "No customers yet")}
          </div>
        )}
      </div>
    </div>
  );

  const renderVouchers = () => (
    <div className="space-y-4">
      {/* Voucher Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-purple-600">{vouchers.filter(v => v.type === "discount_25").length}</div>
          <div className="text-sm text-gray-500">25% {t.adminLoyalty?.discountVouchers || "Discount"}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{vouchers.filter(v => v.type === "free_drink").length}</div>
          <div className="text-sm text-gray-500">{t.adminLoyalty?.freeDrinkVouchers || "Free Drink"}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-pink-600">{vouchers.filter(v => v.type === "birthday_free_item").length}</div>
          <div className="text-sm text-gray-500">{t.adminLoyalty?.birthdayVouchers || "Birthday"}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{vouchers.filter(v => v.status === "unused").length}</div>
          <div className="text-sm text-gray-500">{t.adminLoyalty?.activeVouchers || "Active"}</div>
        </div>
      </div>

      {/* Voucher List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.code || "Code"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.type || "Type"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.customer || "Customer"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.status || "Status"}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t.adminLoyalty?.created || "Created"}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {vouchers.map(voucher => (
              <tr key={voucher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded font-mono text-sm">
                      {voucher.code}
                    </code>
                    <button
                      onClick={() => copyCode(voucher.code)}
                      className="p-1 text-gray-400 hover:text-orange-600"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    voucher.type === "discount_25" ? "bg-purple-100 text-purple-700" :
                    voucher.type === "free_drink" ? "bg-green-100 text-green-700" :
                    "bg-pink-100 text-pink-700"
                  }`}>
                    {voucher.type === "discount_25" ? "25% OFF" :
                     voucher.type === "free_drink" ? "Free Drink" :
                     "Birthday Gift"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {voucher.customerName || voucher.customerId.slice(0, 8) + "..."}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    voucher.status === "unused" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                  }`}>
                    {voucher.status === "unused" ? (t.adminLoyalty?.active || "Active") : (t.adminLoyalty?.used || "Used")}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {voucher.createdAt.toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {vouchers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            {t.adminLoyalty?.noVouchers || "No vouchers created yet"}
          </div>
        )}
      </div>
    </div>
  );

  const renderPointsLog = () => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.adminLoyalty?.date || "Date"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.adminLoyalty?.customer || "Customer"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.adminLoyalty?.type || "Type"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.adminLoyalty?.amount || "Amount"}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t.adminLoyalty?.reason || "Reason"}
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {pointsLogs.map(log => (
            <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {log.createdAt.toLocaleDateString()} {log.createdAt.toLocaleTimeString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap font-medium">
                {log.customerName || log.customerId.slice(0, 8) + "..."}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  log.type === "earned" ? "bg-blue-100 text-blue-700" :
                  log.type === "bonus" ? "bg-green-100 text-green-700" :
                  log.type === "birthday" ? "bg-pink-100 text-pink-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {log.type === "earned" ? (t.adminLoyalty?.earned || "Earned") :
                   log.type === "bonus" ? (t.adminLoyalty?.bonus || "Bonus") :
                   log.type === "birthday" ? (t.adminLoyalty?.birthday || "Birthday") :
                   (t.adminLoyalty?.spent || "Spent")}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`font-bold ${
                  log.type === "spent" ? "text-red-600" : "text-green-600"
                }`}>
                  {log.type === "spent" ? "-" : "+"}{log.amount} pts
                </span>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {log.reason}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {pointsLogs.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          {t.adminLoyalty?.noLogs || "No points transactions yet"}
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${isRTL ? "rtl" : ""}`} dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Gift className="w-7 h-7 text-orange-500" />
            {t.adminLoyalty?.title || "Loyalty Program"}
          </h1>
          <p className="text-gray-500">{t.adminLoyalty?.subtitle || "Manage customer loyalty and rewards"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700">
        {["overview", "customers", "vouchers", "points"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab
                ? "bg-orange-500 text-white"
                : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
            }`}
          >
            {tab === "overview" ? (t.adminLoyalty?.overview || "Overview") :
             tab === "customers" ? (t.adminLoyalty?.customers || "Customers") :
             tab === "vouchers" ? (t.adminLoyalty?.vouchers || "Vouchers") :
             (t.adminLoyalty?.pointsHistory || "Points History")}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && renderOverview()}
      {activeTab === "customers" && renderCustomers()}
      {activeTab === "vouchers" && renderVouchers()}
      {activeTab === "points" && renderPointsLog()}
    </div>
  );
};

export default AdminLoyalty;

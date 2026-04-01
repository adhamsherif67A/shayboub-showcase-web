import { useState, useMemo, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { menuData, type MenuItem } from "@/data/menu";
import { X, Plus, Minus, Search, ShoppingBag, Calendar, Clock, MapPin, Users, User, Phone, Mail, FileText, CheckCircle2 } from "lucide-react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useLanguage } from "@/contexts/LanguageContext";

/** Flying animation item */
interface FlyingItem {
  id: string;
  image: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

/** Cart item with quantity */
interface CartItem {
  categoryName: string;
  item: MenuItem;
  quantity: number;
  selectedSize?: 'medium' | 'large';
  selectedPrice?: number;
}

const ReservationForm = () => {
  const { toast } = useToast();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sizeModalOpen, setSizeModalOpen] = useState(false);
  const [selectedItemForSize, setSelectedItemForSize] = useState<{categoryName: string, item: MenuItem} | null>(null);
  const [flyingItems, setFlyingItems] = useState<FlyingItem[]>([]);
  
  // Refs for fly-to-cart animation
  const cartTargetRef = useRef<HTMLDivElement>(null);
  const [cartBounce, setCartBounce] = useState(false);
  const [formData, setFormData] = useState({
    serviceType: "dinein" as "dinein" | "pickup",
    location: "cairo",
    date: "",
    time: "",
    partySize: 2,
    name: "",
    phone: "",
    email: "",
    specialRequests: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------- cart helpers ---------- */

  const addToCart = (categoryName: string, item: MenuItem) => {
    const priceInfo = parsePriceInfo(item.price);
    
    // If item has multiple sizes, show size selection modal
    if (priceInfo.hasSizes) {
      setSelectedItemForSize({ categoryName, item });
      setSizeModalOpen(true);
      return;
    }
    
    // For single size items, add directly to cart
    addToCartWithSize(categoryName, item, 'medium', priceInfo.mediumPrice);
  };

  const addToCartWithSize = (categoryName: string, item: MenuItem, size: 'medium' | 'large', price: number) => {
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.item.name === item.name && c.categoryName === categoryName && c.selectedSize === size
      );
      if (existing) {
        return prev.map((c) =>
          c.item.name === item.name && c.categoryName === categoryName && c.selectedSize === size
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { categoryName, item, quantity: 1, selectedSize: size, selectedPrice: price }];
    });
  };

  const updateQuantity = (itemName: string, categoryName: string, size: 'medium' | 'large', delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item.name === itemName && c.categoryName === categoryName && c.selectedSize === size
            ? { ...c, quantity: c.quantity + delta }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const getItemQuantity = (itemName: string, categoryName: string) =>
    cart.filter((c) => c.item.name === itemName && c.categoryName === categoryName)
      .reduce((total, c) => total + c.quantity, 0);

  /* ---------- fly-to-cart animation ---------- */
  
  const triggerFlyToCart = useCallback((
    event: React.MouseEvent,
    item: MenuItem
  ) => {
    // Get positions
    const buttonRect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const cartRect = cartTargetRef.current?.getBoundingClientRect();
    
    if (!cartRect) return;
    
    // Create flying item
    const flyingItem: FlyingItem = {
      id: `${Date.now()}-${Math.random()}`,
      image: item.image,
      startX: buttonRect.left + buttonRect.width / 2,
      startY: buttonRect.top + buttonRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
    };
    
    setFlyingItems(prev => [...prev, flyingItem]);
    
    // Remove flying item after animation completes
    setTimeout(() => {
      setFlyingItems(prev => prev.filter(f => f.id !== flyingItem.id));
      // Bounce the cart icon
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 300);
    }, 600);
  }, []);

  // Enhanced addToCart with animation
  const handleAddToCartWithAnimation = (
    event: React.MouseEvent,
    categoryName: string,
    item: MenuItem
  ) => {
    triggerFlyToCart(event, item);
    addToCart(categoryName, item);
  };

  // Helper function to parse price information
  const parsePriceInfo = (priceStr: string | number) => {
    if (typeof priceStr === 'number') {
      return { hasSizes: false, mediumPrice: priceStr, largePrice: priceStr };
    }
    
    if (typeof priceStr === 'string' && priceStr.includes('/')) {
      // For prices like "EGP 90 / 110"
      const parts = priceStr.split('/').map(p => p.trim());
      const mediumMatch = parts[0].match(/(\d+(?:\.\d+)?)/);
      const largeMatch = parts[1].match(/(\d+(?:\.\d+)?)/);
      
      const mediumPrice = mediumMatch ? parseFloat(mediumMatch[1]) : 0;
      const largePrice = largeMatch ? parseFloat(largeMatch[1]) : 0;
      
      return { hasSizes: true, mediumPrice, largePrice };
    }
    
    // For single prices like "EGP 75"
    const match = priceStr.toString().match(/(\d+(?:\.\d+)?)/);
    const price = match ? parseFloat(match[1]) : 0;
    return { hasSizes: false, mediumPrice: price, largePrice: price };
  };

  // Calculate cart total in EGP
  const calculateCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      // Use selectedPrice if available, otherwise parse the item price
      let price = cartItem.selectedPrice;
      
      if (!price) {
        const priceInfo = parsePriceInfo(cartItem.item.price);
        // Default to medium price if no size selected
        price = priceInfo.mediumPrice;
      }
      
      return total + (price * cartItem.quantity);
    }, 0);
  };

  const cartTotal = calculateCartTotal();

  /* ---------- location name helper ---------- */
  
  const getLocationName = (loc: string) => {
    const locations: Record<string, string> = {
      cairo: "Maadi, Cairo",
      alex: "San Stefano, Alexandria", 
      alex2: "Smouha, Alexandria"
    };
    return locations[loc] || loc;
  };

  /* ---------- check if summary should show ---------- */
  
  const isReadyForSummary = useMemo(() => {
    return formData.name.trim() && formData.phone.trim() && formData.date && formData.time;
  }, [formData.name, formData.phone, formData.date, formData.time]);

  /* ---------- format date for display ---------- */
  
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  /* ---------- format time for display ---------- */
  
  const formatDisplayTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  /* ---------- filtered menu for search ---------- */

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return menuData;
    const q = searchQuery.toLowerCase();
    return menuData
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((i) => i.name.toLowerCase().includes(q)),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [searchQuery]);

  /* ---------- validation ---------- */

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = t.reservation.errors.name;
    if (!formData.phone.trim()) errs.phone = t.reservation.errors.phone;
    if (!formData.date) errs.date = t.reservation.errors.date;
    if (!formData.time) errs.time = t.reservation.errors.time;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ---------- submit ---------- */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    const locationLabels: Record<string, string> = {
      cairo: "Cairo - New Cairo",
      "alexandria-kafr": "Alexandria - Kafr Abdou",
      "alexandria-gleem": "Alexandria - Gleem",
    };

    const orderItems = cart.map(
      (c) => {
        const sizeInfo = c.selectedSize ? ` (${c.selectedSize === 'large' ? 'Large' : 'Medium'} - ${c.selectedPrice} EGP)` : ` (${c.item.price})`;
        return `${c.quantity}x ${c.item.name}${sizeInfo} [${c.categoryName}]`;
      }
    );

    try {
      // Save to Firestore
      await addDoc(collection(db, "reservations"), {
        serviceType: formData.serviceType === "dinein" ? "Dine In" : "Pickup Order",
        location: locationLabels[formData.location] ?? formData.location,
        date: formData.date,
        time: formData.time,
        guests: formData.serviceType === "dinein" ? formData.partySize : 1,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || "",
        message: formData.specialRequests || "",
        orderItems: orderItems.length > 0 ? orderItems.join(", ") : "",
        totalAmount: cartTotal,
        status: "pending",
        createdAt: new Date()
      });

      setSubmitted(true);
      toast({
        title: t.reservation.toast.successTitle,
        description: t.reservation.toast.successMessage,
      });
      setTimeout(() => {
        setFormData({
          serviceType: "dinein",
          location: "cairo",
          date: "",
          time: "",
          partySize: 2,
          name: "",
          phone: "",
          email: "",
          specialRequests: "",
        });
        setCart([]);
        setSubmitted(false);
      }, 4000);
    } catch (error) {
      console.error("Error submitting reservation:", error);
      toast({ title: t.reservation.toast.errorTitle, description: t.reservation.toast.errorMessage, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- success state ---------- */

  if (submitted) {
    return (
      <section id="reservation" className={`py-20 bg-muted/40 ${isRTL ? 'rtl' : ''}`}>
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="bg-card rounded-2xl p-10 shadow-lg border border-border">
            <p className="text-5xl mb-4">✅</p>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              {t.reservation.success.title}
            </h3>
            <p className="text-muted-foreground">
              {formData.serviceType === "dinein" ? t.reservation.success.message : t.reservation.success.pickupMessage}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t.reservation.success.confirmMessage}
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- shared styles ---------- */

  const inputCls =
    `w-full border border-input rounded-lg px-4 py-3 font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${isRTL ? 'text-right' : ''}`;
  const errorCls = `text-destructive text-xs mt-1 ${isRTL ? 'text-right' : ''}`;

  return (
    <section id="reservation" className={`py-20 bg-muted/40 ${isRTL ? 'rtl' : ''}`}>
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-primary font-body text-sm tracking-widest uppercase mb-2">
            {t.reservation.header}
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            {t.reservation.title}
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            {t.reservation.subtitle}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-card rounded-2xl p-6 md:p-10 shadow-lg border border-border space-y-6"
        >
          {/* Service Type */}
          <fieldset>
            <legend className={`font-body text-sm font-semibold text-foreground mb-3 ${isRTL ? 'text-right w-full' : ''}`}>
              {t.reservation.serviceType.title}
            </legend>
            <div className="grid grid-cols-2 gap-3">
              {(["dinein", "pickup"] as const).map((type) => (
                <label
                  key={type}
                  className={`flex flex-col items-center gap-1 cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                    formData.serviceType === type
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    value={type}
                    checked={formData.serviceType === type}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="text-2xl">{type === "dinein" ? "🍽️" : "📦"}</span>
                  <span className="font-body font-semibold text-foreground text-sm">
                    {type === "dinein" ? t.reservation.serviceType.dineIn : t.reservation.serviceType.pickup}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {type === "dinein" ? t.reservation.serviceType.dineInDesc : t.reservation.serviceType.pickupDesc}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Location */}
          <div>
            <label htmlFor="location" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t.reservation.location.title}
            </label>
            <select id="location" name="location" value={formData.location} onChange={handleChange} className={inputCls}>
              <option value="cairo">{t.reservation.location.cairo}</option>
              <option value="alexandria-kafr">{t.reservation.location.alexKafr}</option>
              <option value="alexandria-gleem">{t.reservation.location.alexGleem}</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>{t.reservation.date}</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={inputCls}
                aria-invalid={!!errors.date}
                aria-describedby={errors.date ? "date-error" : undefined}
              />
              {errors.date && <p id="date-error" className={errorCls} role="alert">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="time" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>{t.reservation.time}</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={inputCls}
                aria-invalid={!!errors.time}
                aria-describedby={errors.time ? "time-error" : undefined}
              />
              {errors.time && <p id="time-error" className={errorCls} role="alert">{errors.time}</p>}
            </div>
          </div>

          {/* Party Size (dine-in only) */}
          {formData.serviceType === "dinein" && (
            <div>
              <label htmlFor="partySize" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>{t.reservation.partySize}</label>
              <select id="partySize" name="partySize" value={formData.partySize} onChange={handleChange} className={inputCls}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? t.reservation.person : t.reservation.people}</option>
                ))}
              </select>
            </div>
          )}

          {/* ========== ENHANCED PREORDER SECTION ========== */}
          <div className="bg-gradient-to-r from-primary/5 to-orange-500/5 rounded-xl p-4 border-2 border-primary/20">
            {/* Header with call-to-action */}
            <div className="text-center mb-4">
              <div className={`flex items-center justify-center gap-3 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <h3 className="font-display text-lg font-bold text-foreground">
                  {t.reservation.preOrder.title}
                </h3>
                {/* Cart icon target for fly animation */}
                <div 
                  ref={cartTargetRef}
                  className={`relative flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full transition-transform ${
                    cartBounce ? 'scale-125 animate-bounce' : ''
                  }`}
                >
                  <ShoppingBag className="w-5 h-5 text-primary" />
                  {cart.length > 0 && (
                    <span className={`absolute -top-1 w-5 h-5 bg-primary text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse ${isRTL ? '-left-1' : '-right-1'}`}>
                      {cart.reduce((sum, c) => sum + c.quantity, 0)}
                    </span>
                  )}
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-3">
                {t.reservation.preOrder.subtitle}
              </p>
              
              {/* Benefits */}
              <div className={`flex flex-wrap items-center justify-center gap-6 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <div className={`flex items-center gap-2 text-sm text-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{t.reservation.preOrder.benefits.fresh}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm text-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{t.reservation.preOrder.benefits.ready}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm text-green-700 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">{t.reservation.preOrder.benefits.efficient}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className={`inline-flex items-center gap-3 px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                  menuOpen 
                    ? "bg-red-500 hover:bg-red-600" 
                    : "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
                } transform hover:scale-105`}
              >
                <span className="text-sm">
                  {menuOpen ? t.reservation.preOrder.closeMenu : t.reservation.preOrder.addItems}
                </span>
              </button>
            </div>

            {/* Selected items summary */}
            {cart.length > 0 && (
              <div className="mb-3 space-y-2">
                {cart.map((c) => (
                  <div
                    key={`${c.categoryName}-${c.item.name}-${c.selectedSize}`}
                    className={`flex items-center justify-between bg-background rounded-lg px-3 py-2 border border-border text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className={`text-foreground font-medium truncate ${isRTL ? 'ml-2' : 'mr-2'}`}>
                      {c.item.name}
                      {c.selectedSize && (
                        <span className={`text-muted-foreground ${isRTL ? 'mr-1' : 'ml-1'}`}>
                          ({c.selectedSize === 'large' ? t.reservation.preOrder.large : t.reservation.preOrder.medium} - {c.selectedPrice} EGP)
                        </span>
                      )}
                      {!c.selectedSize && (
                        <span className={`text-muted-foreground ${isRTL ? 'mr-1' : 'ml-1'}`}>({c.item.price})</span>
                      )}
                    </span>
                    <div className={`flex items-center gap-2 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <button
                        type="button"
                        onClick={() => updateQuantity(c.item.name, c.categoryName, c.selectedSize || 'medium', -1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        aria-label={`${t.reservation.preOrder.decrease} ${c.item.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-semibold text-foreground">{c.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(c.item.name, c.categoryName, c.selectedSize || 'medium', 1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        aria-label={`${t.reservation.preOrder.increase} ${c.item.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Cart Total */}
                <div className="bg-primary/5 rounded-lg px-3 py-2 border border-primary/20">
                  <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-sm font-medium text-foreground">{t.reservation.summary.total}:</span>
                    <span className="text-lg font-bold text-primary">{cartTotal.toFixed(2)} EGP</span>
                  </div>
                </div>
              </div>
            )}

            {/* Menu browser modal-like panel */}
            {menuOpen && (
              <div className="border border-border rounded-xl bg-background max-h-[400px] overflow-y-auto">
                {/* Search */}
                <div className="sticky top-0 bg-background border-b border-border p-3 z-10">
                  <div className="relative">
                    <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
                    <input
                      type="text"
                      placeholder={t.reservation.preOrder.searchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${isRTL ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'}`}
                    />
                  </div>
                </div>

                {/* Categories & Items */}
                <div className="p-3 space-y-4">
                  {filteredMenu.map((cat) => (
                    <div key={cat.name}>
                      <h4 className={`font-display text-sm font-bold text-foreground mb-2 sticky top-[60px] bg-background py-1 ${isRTL ? 'text-right' : ''}`}>
                        {cat.name}
                      </h4>
                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const qty = getItemQuantity(item.name, cat.name);
                          return (
                            <div
                              key={`${cat.name}-${item.name}`}
                              className={`flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              <div className={`flex items-center gap-3 min-w-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                  loading="lazy"
                                  width={40}
                                  height={40}
                                />
                                <div className={`min-w-0 ${isRTL ? 'text-right' : ''}`}>
                                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.price}</p>
                                </div>
                              </div>
                              {qty > 0 ? (
                                <div className={`flex items-center gap-1.5 shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.name, cat.name, -1)}
                                    className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                    aria-label={`${t.reservation.preOrder.decrease} ${item.name}`}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-5 text-center text-sm font-semibold text-foreground">{qty}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.name, cat.name, 1)}
                                    className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                    aria-label={`${t.reservation.preOrder.increase} ${item.name}`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => handleAddToCartWithAnimation(e, cat.name, item)}
                                  className="px-3 py-1.5 text-xs font-semibold text-white bg-primary rounded-full hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shrink-0"
                                >
                                  + {t.reservation.preOrder.add}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {filteredMenu.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">{t.reservation.preOrder.noItems}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t.reservation.name} <span className="text-destructive">*</span>
            </label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
              placeholder={t.reservation.namePlaceholder} className={`${inputCls} ${isRTL ? 'text-right' : ''}`}
              aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
            {errors.name && <p id="name-error" className={errorCls} role="alert">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t.reservation.phone} <span className="text-destructive">*</span>
            </label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="+20 1xx xxx xxxx" className={`${inputCls} ${isRTL ? 'text-right' : ''}`}
              aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
            {errors.phone && <p id="phone-error" className={errorCls} role="alert">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t.reservation.email} <span className="text-muted-foreground font-normal">({t.common.optional})</span>
            </label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
              placeholder={t.reservation.emailPlaceholder} className={`${inputCls} ${isRTL ? 'text-right' : ''}`} />
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="specialRequests" className={`block font-body text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : ''}`}>
              {t.reservation.specialRequests}
            </label>
            <textarea id="specialRequests" name="specialRequests" value={formData.specialRequests}
              onChange={handleChange} rows={3}
              placeholder={t.reservation.specialRequestsPlaceholder}
              className={inputCls + ` resize-none ${isRTL ? 'text-right' : ''}`} />
          </div>

          {/* ========== RESERVATION SUMMARY CARD ========== */}
          {isReadyForSummary && (
            <div className="bg-gradient-to-br from-primary/5 via-background to-orange-500/5 rounded-xl border-2 border-primary/20 overflow-hidden">
              {/* Header */}
              <div className="bg-primary/10 px-4 py-3 border-b border-primary/20">
                <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-base font-bold text-foreground">
                    {t.reservation.summary.title}
                  </h3>
                </div>
              </div>
              
              {/* Details */}
              <div className="p-4 space-y-3">
                {/* Service Type & Location */}
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formData.serviceType === "dinein" ? t.reservation.serviceType.dineIn : t.reservation.serviceType.pickup}
                    </p>
                    <p className="text-xs text-muted-foreground">{getLocationName(formData.location)}</p>
                  </div>
                </div>
                
                {/* Date & Time */}
                <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                  <Calendar className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{formatDisplayDate(formData.date)}</p>
                    <div className={`flex items-center gap-1 text-xs text-muted-foreground ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Clock className="w-3 h-3" />
                      <span>{formatDisplayTime(formData.time)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Party Size (dine-in only) */}
                {formData.serviceType === "dinein" && (
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-sm font-medium text-foreground">
                      {formData.partySize} {formData.partySize === 1 ? t.reservation.summary.guest : t.reservation.summary.guests}
                    </p>
                  </div>
                )}
                
                {/* Contact Info */}
                <div className="pt-2 border-t border-border/50 space-y-2">
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <User className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-sm font-medium text-foreground">{formData.name}</p>
                  </div>
                  <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Phone className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">{formData.phone}</p>
                  </div>
                  {formData.email && (
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Mail className="w-4 h-4 text-primary shrink-0" />
                      <p className="text-sm text-muted-foreground">{formData.email}</p>
                    </div>
                  )}
                </div>
                
                {/* Pre-ordered Items */}
                {cart.length > 0 && (
                  <div className="pt-2 border-t border-border/50">
                    <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <ShoppingBag className="w-4 h-4 text-primary" />
                      <p className="text-sm font-medium text-foreground">{t.reservation.summary.preorderedItems}</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-2 space-y-1">
                      {cart.map((c) => (
                        <div key={`${c.categoryName}-${c.item.name}-${c.selectedSize}`} className={`flex justify-between text-xs ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <span className="text-muted-foreground">
                            {c.quantity}x {c.item.name}
                            {c.selectedSize && <span className="opacity-70"> ({c.selectedSize === 'large' ? 'L' : 'M'})</span>}
                          </span>
                          <span className="text-foreground font-medium">
                            {((c.selectedPrice || 0) * c.quantity).toFixed(0)} EGP
                          </span>
                        </div>
                      ))}
                      <div className={`flex justify-between text-sm pt-1 border-t border-border/30 mt-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <span className="font-medium text-foreground">{t.reservation.summary.total}</span>
                        <span className="font-bold text-primary">{cartTotal.toFixed(0)} EGP</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Special Requests */}
                {formData.specialRequests && (
                  <div className="pt-2 border-t border-border/50">
                    <div className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                      <FileText className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground italic">"{formData.specialRequests}"</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? t.reservation.submitting
              : `${t.reservation.submitButton}${cart.length > 0 ? ` (${cart.reduce((s, c) => s + c.quantity, 0)} ${t.reservation.items})` : ""}`}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            {t.reservation.confirmationNote}
          </p>
        </form>
      </div>

      {/* Size Selection Modal */}
      {sizeModalOpen && selectedItemForSize && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 w-full max-w-md border border-border shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-foreground">
                Choose Size
              </h3>
              <button
                type="button"
                onClick={() => setSizeModalOpen(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-1">Selected item:</p>
              <p className="font-medium text-foreground">{selectedItemForSize.item.name}</p>
            </div>

            <div className="space-y-3">
              {(() => {
                const priceInfo = parsePriceInfo(selectedItemForSize.item.price);
                return (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        triggerFlyToCart(e, selectedItemForSize.item);
                        addToCartWithSize(
                          selectedItemForSize.categoryName,
                          selectedItemForSize.item,
                          'medium',
                          priceInfo.mediumPrice
                        );
                        setSizeModalOpen(false);
                        setSelectedItemForSize(null);
                      }}
                      className="w-full flex items-center justify-between p-4 border-2 border-border hover:border-primary rounded-xl transition-colors hover:bg-primary/5"
                    >
                      <div className="text-left">
                        <p className="font-medium text-foreground">Medium</p>
                        <p className="text-sm text-muted-foreground">Regular size</p>
                      </div>
                      <p className="font-bold text-primary">{priceInfo.mediumPrice} EGP</p>
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        triggerFlyToCart(e, selectedItemForSize.item);
                        addToCartWithSize(
                          selectedItemForSize.categoryName,
                          selectedItemForSize.item,
                          'large',
                          priceInfo.largePrice
                        );
                        setSizeModalOpen(false);
                        setSelectedItemForSize(null);
                      }}
                      className="w-full flex items-center justify-between p-4 border-2 border-border hover:border-primary rounded-xl transition-colors hover:bg-primary/5"
                    >
                      <div className="text-left">
                        <p className="font-medium text-foreground">Large</p>
                        <p className="text-sm text-muted-foreground">Bigger serving</p>
                      </div>
                      <p className="font-bold text-primary">{priceInfo.largePrice} EGP</p>
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}
      
      {/* Flying items animation */}
      {flyingItems.map((flyingItem) => (
        <div
          key={flyingItem.id}
          className="fixed pointer-events-none z-[9999]"
          style={{
            left: flyingItem.startX,
            top: flyingItem.startY,
            transform: 'translate(-50%, -50%)',
            animation: 'flyToCart 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            '--end-x': `${flyingItem.endX - flyingItem.startX}px`,
            '--end-y': `${flyingItem.endY - flyingItem.startY}px`,
          } as React.CSSProperties}
        >
          <img
            src={flyingItem.image}
            alt=""
            className="w-12 h-12 rounded-full object-cover shadow-lg border-2 border-primary"
          />
        </div>
      ))}
      
      {/* CSS for fly animation */}
      <style>{`
        @keyframes flyToCart {
          0% {
            transform: translate(-50%, -50%) scale(1) rotate(0deg);
            opacity: 1;
          }
          50% {
            transform: translate(calc(-50% + var(--end-x) / 2), calc(-50% + var(--end-y) / 2 - 50px)) scale(1.2) rotate(180deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) scale(0.3) rotate(360deg);
            opacity: 0.5;
          }
        }
      `}</style>
    </section>
  );
};

export default ReservationForm;

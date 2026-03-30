import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { menuData, type MenuItem } from "@/data/menu";
import { X, Plus, Minus, Search } from "lucide-react";

/** Cart item with quantity */
interface CartItem {
  categoryName: string;
  item: MenuItem;
  quantity: number;
}

const FORMSPREE_URL = "https://formspree.io/f/xzdkrawp";

const ReservationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
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
    setCart((prev) => {
      const existing = prev.find(
        (c) => c.item.name === item.name && c.categoryName === categoryName
      );
      if (existing) {
        return prev.map((c) =>
          c.item.name === item.name && c.categoryName === categoryName
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { categoryName, item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemName: string, categoryName: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) =>
          c.item.name === itemName && c.categoryName === categoryName
            ? { ...c, quantity: c.quantity + delta }
            : c
        )
        .filter((c) => c.quantity > 0)
    );
  };

  const getItemQuantity = (itemName: string, categoryName: string) =>
    cart.find((c) => c.item.name === itemName && c.categoryName === categoryName)?.quantity ?? 0;

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
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.phone.trim()) errs.phone = "Phone number is required";
    if (!formData.date) errs.date = "Date is required";
    if (!formData.time) errs.time = "Time is required";
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
      (c) => `${c.quantity}x ${c.item.name} (${c.item.price}) [${c.categoryName}]`
    );

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: formData.serviceType === "dinein" ? "Dine In" : "Pickup Order",
          location: locationLabels[formData.location] ?? formData.location,
          date: formData.date,
          time: formData.time,
          ...(formData.serviceType === "dinein" && { partySize: formData.partySize }),
          name: formData.name,
          phone: formData.phone,
          ...(formData.email && { email: formData.email }),
          ...(formData.specialRequests && { specialRequests: formData.specialRequests }),
          ...(orderItems.length > 0 && { orderItems: orderItems.join("\n") }),
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Success! 🎉",
          description: "Your reservation has been submitted. We'll confirm via phone shortly.",
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
      } else {
        toast({ title: "Error", description: "Failed to submit. Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  /* ---------- success state ---------- */

  if (submitted) {
    return (
      <section id="reservation" className="py-20 bg-muted/40">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="bg-card rounded-2xl p-10 shadow-lg border border-border">
            <p className="text-5xl mb-4">✅</p>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">
              Reservation Submitted!
            </h3>
            <p className="text-muted-foreground">
              Thank you for your {formData.serviceType === "dinein" ? "reservation" : "booking"}!
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              We'll confirm your booking via phone within the next hour.
            </p>
          </div>
        </div>
      </section>
    );
  }

  /* ---------- shared styles ---------- */

  const inputCls =
    "w-full border border-input rounded-lg px-4 py-3 font-body bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";
  const errorCls = "text-destructive text-xs mt-1";

  return (
    <section id="reservation" className="py-20 bg-muted/40">
      <div className="max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-primary font-body text-sm tracking-widest uppercase mb-2">
            Reserve Your Spot
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            Make a Reservation
          </h2>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto">
            Choose your preferred way to experience Shayboub
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-card rounded-2xl p-6 md:p-10 shadow-lg border border-border space-y-6"
        >
          {/* Service Type */}
          <fieldset>
            <legend className="font-body text-sm font-semibold text-foreground mb-3">
              How would you like to visit us?
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
                    {type === "dinein" ? "Dine In" : "Pickup"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {type === "dinein" ? "Reserve a table" : "Book pickup time"}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block font-body text-sm font-semibold text-foreground mb-1">
              Location
            </label>
            <select id="location" name="location" value={formData.location} onChange={handleChange} className={inputCls}>
              <option value="cairo">Cairo - New Cairo (El-Moshir Tantawy)</option>
              <option value="alexandria-kafr">Alexandria - Kafr Abdou</option>
              <option value="alexandria-gleem">Alexandria - Gleem (El Raml)</option>
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block font-body text-sm font-semibold text-foreground mb-1">Date</label>
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
              <label htmlFor="time" className="block font-body text-sm font-semibold text-foreground mb-1">Time</label>
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
              <label htmlFor="partySize" className="block font-body text-sm font-semibold text-foreground mb-1">Party Size</label>
              <select id="partySize" name="partySize" value={formData.partySize} onChange={handleChange} className={inputCls}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>
                ))}
              </select>
            </div>
          )}

          {/* ========== MENU ITEM PICKER ========== */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-body text-sm font-semibold text-foreground">
                Pre-order Items <span className="text-muted-foreground font-normal">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="text-primary text-sm font-semibold hover:underline"
              >
                {menuOpen ? "Close Menu" : "Browse Menu"}
              </button>
            </div>

            {/* Selected items summary */}
            {cart.length > 0 && (
              <div className="mb-3 space-y-2">
                {cart.map((c) => (
                  <div
                    key={`${c.categoryName}-${c.item.name}`}
                    className="flex items-center justify-between bg-background rounded-lg px-3 py-2 border border-border text-sm"
                  >
                    <span className="text-foreground font-medium truncate mr-2">
                      {c.item.name}
                      <span className="text-muted-foreground ml-1">({c.item.price})</span>
                    </span>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => updateQuantity(c.item.name, c.categoryName, -1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        aria-label={`Decrease ${c.item.name}`}
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-5 text-center font-semibold text-foreground">{c.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(c.item.name, c.categoryName, 1)}
                        className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
                        aria-label={`Increase ${c.item.name}`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Menu browser modal-like panel */}
            {menuOpen && (
              <div className="border border-border rounded-xl bg-background max-h-[400px] overflow-y-auto">
                {/* Search */}
                <div className="sticky top-0 bg-background border-b border-border p-3 z-10">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search menu items..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-input rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                {/* Categories & Items */}
                <div className="p-3 space-y-4">
                  {filteredMenu.map((cat) => (
                    <div key={cat.name}>
                      <h4 className="font-display text-sm font-bold text-foreground mb-2 sticky top-[60px] bg-background py-1">
                        {cat.name}
                      </h4>
                      <div className="space-y-1">
                        {cat.items.map((item) => {
                          const qty = getItemQuantity(item.name, cat.name);
                          return (
                            <div
                              key={`${cat.name}-${item.name}`}
                              className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-10 h-10 rounded-lg object-cover shrink-0"
                                  loading="lazy"
                                  width={40}
                                  height={40}
                                />
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">{item.price}</p>
                                </div>
                              </div>
                              {qty > 0 ? (
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.name, cat.name, -1)}
                                    className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                    aria-label={`Decrease ${item.name}`}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-5 text-center text-sm font-semibold text-foreground">{qty}</span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.name, cat.name, 1)}
                                    className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary/20 transition-colors"
                                    aria-label={`Increase ${item.name}`}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => addToCart(cat.name, item)}
                                  className="text-xs font-semibold text-primary hover:underline shrink-0"
                                >
                                  + Add
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  {filteredMenu.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-6">No items found</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-body text-sm font-semibold text-foreground mb-1">
              Your Name <span className="text-destructive">*</span>
            </label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange}
              placeholder="Full name" className={inputCls}
              aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
            {errors.name && <p id="name-error" className={errorCls} role="alert">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block font-body text-sm font-semibold text-foreground mb-1">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
              placeholder="+20 1xx xxx xxxx" className={inputCls}
              aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "phone-error" : undefined} />
            {errors.phone && <p id="phone-error" className={errorCls} role="alert">{errors.phone}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block font-body text-sm font-semibold text-foreground mb-1">
              Email Address <span className="text-muted-foreground font-normal">(Optional)</span>
            </label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange}
              placeholder="you@email.com" className={inputCls} />
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="specialRequests" className="block font-body text-sm font-semibold text-foreground mb-1">
              Special Requests or Notes
            </label>
            <textarea id="specialRequests" name="specialRequests" value={formData.specialRequests}
              onChange={handleChange} rows={3}
              placeholder="Allergies, birthday setup, highchair needed..."
              className={inputCls + " resize-none"} />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? "Submitting..."
              : `Submit Reservation${cart.length > 0 ? ` (${cart.reduce((s, c) => s + c.quantity, 0)} items)` : ""}`}
          </button>

          <p className="text-xs text-muted-foreground text-center">
            We'll confirm your booking within the next hour
          </p>
        </form>
      </div>
    </section>
  );
};

export default ReservationForm;

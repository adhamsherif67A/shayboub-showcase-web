import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/** Reservation form with Formspree integration */
const ReservationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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

  /* ---------- helpers ---------- */

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Replace YOUR_FORM_ID with your actual Formspree form ID
      const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: formData.serviceType === "dinein" ? "Dine In" : "Pickup Order",
          location:
            formData.location === "cairo"
              ? "Cairo - New Cairo"
              : formData.location === "alexandria-kafr"
                ? "Alexandria - Kafr Abdou"
                : "Alexandria - Gleem",
          date: formData.date,
          time: formData.time,
          ...(formData.serviceType === "dinein" && { partySize: formData.partySize }),
          name: formData.name,
          phone: formData.phone,
          ...(formData.email && { email: formData.email }),
          ...(formData.specialRequests && { specialRequests: formData.specialRequests }),
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
          setSubmitted(false);
        }, 3000);
      } else {
        toast({ title: "Error", description: "Failed to submit reservation. Please try again.", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Network error. Please try again.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const locationLabels: Record<string, string> = {
    cairo: "Cairo - New Cairo (El-Moshir Tantawy)",
    "alexandria-kafr": "Alexandria - Kafr Abdou",
    "alexandria-gleem": "Alexandria - Gleem (El Raml)",
  };

  /* ---------- success state ---------- */

  if (submitted) {
    return (
      <section id="reservation" className="py-20 bg-muted/40">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="bg-card rounded-2xl p-10 shadow-lg border border-border">
            <p className="text-5xl mb-4">✅</p>
            <h3 className="font-display text-2xl font-bold text-foreground mb-2">Reservation Submitted!</h3>
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

  /* ---------- form ---------- */

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
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={inputCls}
            >
              {Object.entries(locationLabels).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block font-body text-sm font-semibold text-foreground mb-1">
                Date
              </label>
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
              <label htmlFor="time" className="block font-body text-sm font-semibold text-foreground mb-1">
                Time
              </label>
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
              <label htmlFor="partySize" className="block font-body text-sm font-semibold text-foreground mb-1">
                Party Size
              </label>
              <select
                id="partySize"
                name="partySize"
                value={formData.partySize}
                onChange={handleChange}
                className={inputCls}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "person" : "people"}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block font-body text-sm font-semibold text-foreground mb-1">
              Your Name <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className={inputCls}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? "name-error" : undefined}
            />
            {errors.name && <p id="name-error" className={errorCls} role="alert">{errors.name}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block font-body text-sm font-semibold text-foreground mb-1">
              Phone Number <span className="text-destructive">*</span>
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+20 1xx xxx xxxx"
              className={inputCls}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
            />
            {errors.phone && <p id="phone-error" className={errorCls} role="alert">{errors.phone}</p>}
          </div>

          {/* Email (optional) */}
          <div>
            <label htmlFor="email" className="block font-body text-sm font-semibold text-foreground mb-1">
              Email Address <span className="text-muted-foreground">(Optional)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@email.com"
              className={inputCls}
            />
          </div>

          {/* Special Requests */}
          <div>
            <label htmlFor="specialRequests" className="block font-body text-sm font-semibold text-foreground mb-1">
              Special Requests or Notes
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              rows={3}
              placeholder="Allergies, birthday setup, highchair needed..."
              className={inputCls + " resize-none"}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-body font-semibold px-8 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Reservation"}
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

import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Star } from "lucide-react";
import { LOGO_URL } from "@/data/menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t, isRTL } = useLanguage();
  const { user, isCustomer, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/10"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <a href="#" className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`} aria-label="Shayboub - Home">
          <img src={LOGO_URL} alt="" className="h-10 w-10 rounded-lg object-contain" aria-hidden="true" />
          <span className="font-display text-xl font-bold text-secondary-foreground">
            {isRTL ? 'شيبوب' : 'Shayboub'}
          </span>
        </a>

        <div className={`hidden md:flex items-center gap-6 font-body text-sm text-secondary-foreground/70 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a href="#menu" className="hover:text-primary transition-colors">{t.nav.menu}</a>
          <a href="#reservation" className="hover:text-primary transition-colors">{t.nav.reservations}</a>
          <a href="#locations" className="hover:text-primary transition-colors">{t.nav.locations}</a>
          <a href="#about" className="hover:text-primary transition-colors">{t.nav.about}</a>
          <LanguageToggle />
          
          {/* Customer Auth Buttons - Always show unless loading */}
          {!loading && (
            <>
              {isCustomer && user ? (
                <>
                  <Link to="/my-account">
                    <Button variant="default" size="sm" className={`gap-2 bg-primary hover:bg-primary/90 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Star className="w-4 h-4" />
                      {user.customerData?.points || 0} {t.loyalty?.points || "pts"}
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={handleLogout} className={`gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              ) : !user ? (
                <Link to="/customer-login">
                  <Button variant="default" size="sm" className={`gap-2 bg-primary hover:bg-primary/90 text-white ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <User className="w-4 h-4" />
                    {t.auth?.login || "Login"}
                  </Button>
                </Link>
              ) : null}
            </>
          )}
          
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
          >
            {t.nav.orderNow}
          </a>
        </div>

        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-secondary-foreground"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div 
          id="mobile-menu"
          className={`md:hidden bg-secondary border-t border-secondary-foreground/10 px-6 py-6 space-y-4 font-body text-sm ${isRTL ? 'text-right' : ''}`}
        >
          <a href="#menu" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary">{t.nav.menu}</a>
          <a href="#reservation" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary">{t.nav.reservations}</a>
          <a href="#locations" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary">{t.nav.locations}</a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary">{t.nav.about}</a>
          <div className="pt-2">
            <LanguageToggle />
          </div>
          
          {/* Mobile Customer Auth - Always show unless loading */}
          {!loading && (
            <>
              {isCustomer && user ? (
                <div className="space-y-3 pt-3 border-t border-secondary-foreground/10">
                  <Link to="/my-account" onClick={() => setOpen(false)}>
                    <Button variant="default" className="w-full gap-2 bg-primary hover:bg-primary/90">
                      <Star className="w-4 h-4" />
                      {t.auth?.myAccount || "My Account"} ({user.customerData?.points || 0} {t.loyalty?.points || "pts"})
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    {t.auth?.logout || "Logout"}
                  </Button>
                </div>
              ) : !user ? (
                <div className="space-y-3 pt-3 border-t border-secondary-foreground/10">
                  <Link to="/customer-login" onClick={() => setOpen(false)}>
                    <Button variant="default" className="w-full gap-2 bg-primary hover:bg-primary/90 text-white">
                      <User className="w-4 h-4" />
                      {t.auth?.login || "Login"} / {t.auth?.signUp || "Sign Up"}
                    </Button>
                  </Link>
                </div>
              ) : null}
            </>
          )}
          
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold text-center hover:bg-orange-600 transition-colors"
          >
            {t.nav.orderNow}
          </a>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

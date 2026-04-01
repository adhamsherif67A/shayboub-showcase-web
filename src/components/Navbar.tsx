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
  const { user, isCustomer, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  // Check if user is logged in as customer (not admin/staff)
  const showCustomerAccount = user && isCustomer;
  // Show login button when no user is logged in
  const showLoginButton = !user;

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-secondary/90 backdrop-blur-md border-b border-secondary-foreground/10"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className={`max-w-6xl mx-auto px-6 flex items-center justify-between h-16 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <Link to="/" className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`} aria-label="Shayboub - Home">
          <img src={LOGO_URL} alt="" className="h-10 w-10 rounded-lg object-contain" aria-hidden="true" />
          <span className="font-display text-xl font-bold text-secondary-foreground">
            {isRTL ? 'شيبوب' : 'Shayboub'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className={`hidden md:flex items-center gap-4 font-body text-sm text-secondary-foreground/70 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a href="#menu" className="hover:text-primary transition-colors">{t.nav.menu}</a>
          <a href="#reservation" className="hover:text-primary transition-colors">{t.nav.reservations}</a>
          <a href="#locations" className="hover:text-primary transition-colors">{t.nav.locations}</a>
          <a href="#about" className="hover:text-primary transition-colors">{t.nav.about}</a>
          <LanguageToggle />
          
          {/* Login Button - Always visible when not logged in */}
          {showLoginButton && (
            <Link to="/customer-login">
              <Button size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                <User className="w-4 h-4" />
                {isRTL ? "تسجيل الدخول" : "Login"}
              </Button>
            </Link>
          )}
          
          {/* Customer Account - Show when logged in as customer */}
          {showCustomerAccount && (
            <div className="flex items-center gap-2">
              <Link to="/my-account">
                <Button size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                  <Star className="w-4 h-4" />
                  {user.customerData?.points || 0} {isRTL ? "نقطة" : "pts"}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
          
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            {t.nav.orderNow}
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setOpen(!open)} 
          className="md:hidden text-secondary-foreground"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div 
          id="mobile-menu"
          className={`md:hidden bg-secondary border-t border-secondary-foreground/10 px-6 py-6 space-y-4 font-body text-sm ${isRTL ? 'text-right' : ''}`}
        >
          <a href="#menu" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary py-2">{t.nav.menu}</a>
          <a href="#reservation" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary py-2">{t.nav.reservations}</a>
          <a href="#locations" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary py-2">{t.nav.locations}</a>
          <a href="#about" onClick={() => setOpen(false)} className="block text-secondary-foreground/70 hover:text-primary py-2">{t.nav.about}</a>
          
          <div className="py-2">
            <LanguageToggle />
          </div>
          
          <div className="border-t border-secondary-foreground/20 pt-4 space-y-3">
            {/* Mobile Login Button */}
            {showLoginButton && (
              <Link to="/customer-login" onClick={() => setOpen(false)}>
                <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                  <User className="w-4 h-4" />
                  {isRTL ? "تسجيل الدخول / إنشاء حساب" : "Login / Sign Up"}
                </Button>
              </Link>
            )}
            
            {/* Mobile Customer Account */}
            {showCustomerAccount && (
              <>
                <Link to="/my-account" onClick={() => setOpen(false)}>
                  <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                    <Star className="w-4 h-4" />
                    {isRTL ? "حسابي" : "My Account"} ({user.customerData?.points || 0} {isRTL ? "نقطة" : "pts"})
                  </Button>
                </Link>
                <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  {isRTL ? "تسجيل الخروج" : "Logout"}
                </Button>
              </>
            )}
            
            <a
              href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="block bg-green-600 text-white px-5 py-3 rounded-lg font-semibold text-center hover:bg-green-700 transition-colors"
            >
              {t.nav.orderNow}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

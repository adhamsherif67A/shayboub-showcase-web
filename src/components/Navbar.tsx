import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, LogOut, Star, ChevronDown, Settings, Heart } from "lucide-react";
import { LOGO_URL } from "@/data/menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t, isRTL } = useLanguage();
  const { user, isCustomer, isAdmin, isStaff, logout } = useAuth();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    setUserMenuOpen(false);
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const userName = user?.customerData?.name || user?.name || "User";
  const userPoints = user?.customerData?.points || 0;

  // Show customer account if logged in as customer
  const showCustomerAccount = user && isCustomer;
  // Show login button when: no user OR user is admin/staff (they use separate login)
  const showLoginButton = !user || (user && (isAdmin || isStaff) && !isCustomer);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 bg-secondary/95 backdrop-blur-md border-b border-secondary-foreground/10 shadow-sm"
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
        <div className={`hidden md:flex items-center gap-5 font-body text-sm text-secondary-foreground/80 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <a href="#menu" className="hover:text-primary transition-colors font-medium">{t.nav.menu}</a>
          <a href="#reservation" className="hover:text-primary transition-colors font-medium">{t.nav.reservations}</a>
          <a href="#locations" className="hover:text-primary transition-colors font-medium">{t.nav.locations}</a>
          <a href="#about" className="hover:text-primary transition-colors font-medium">{t.nav.about}</a>
          
          <div className="w-px h-5 bg-secondary-foreground/20" />
          
          <LanguageToggle />
          <ThemeToggle />
          
          {/* Login Button - Show when not a customer */}
          {showLoginButton && (
            <Link to="/customer-login">
              <Button size="sm" className="gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                <User className="w-4 h-4" />
                {isRTL ? "تسجيل الدخول" : "Login"}
              </Button>
            </Link>
          )}
          
          {/* Customer Account Dropdown - Show when logged in as customer */}
          {showCustomerAccount && (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full bg-secondary-foreground/10 hover:bg-secondary-foreground/15 transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar with initials */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                  {getInitials(userName)}
                </div>
                
                {/* Points badge */}
                <div className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  <Star className="w-3 h-3" />
                  {userPoints}
                </div>
                
                <ChevronDown className={`w-4 h-4 text-secondary-foreground/60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className={`absolute top-full mt-2 w-64 bg-card rounded-xl shadow-xl border border-border overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${isRTL ? 'left-0' : 'right-0'}`}>
                  {/* User Info Header */}
                  <div className="px-4 py-3 bg-muted/50 border-b border-border">
                    <p className="font-semibold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || user?.phone}</p>
                  </div>
                  
                  {/* Points Display */}
                  <div className="px-4 py-3 bg-gradient-to-r from-orange-500/10 to-orange-600/10 border-b border-border">
                    <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-sm text-foreground">{isRTL ? 'نقاطك' : 'Your Points'}</span>
                      <span className="flex items-center gap-1 text-orange-500 font-bold">
                        <Star className="w-4 h-4" />
                        {userPoints}
                      </span>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      to="/my-account"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      {isRTL ? 'حسابي' : 'My Account'}
                    </Link>
                    <Link
                      to="/my-account#favorites"
                      onClick={() => setUserMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <Heart className="w-4 h-4 text-muted-foreground" />
                      {isRTL ? 'المفضلة' : 'Favorites'}
                    </Link>
                  </div>
                  
                  {/* Logout */}
                  <div className="border-t border-border py-2">
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                    >
                      <LogOut className="w-4 h-4" />
                      {isRTL ? 'تسجيل الخروج' : 'Logout'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
          
          <a
            href="https://www.talabat.com/egypt/shayboub-fetar-w-3asha"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
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
                {/* User Card - Mobile */}
                <div className={`flex items-center gap-3 p-3 bg-secondary-foreground/5 rounded-xl ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                    {getInitials(userName)}
                  </div>
                  <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                    <p className="font-semibold text-secondary-foreground">{userName}</p>
                    <p className="text-xs text-secondary-foreground/60 flex items-center gap-1">
                      <Star className="w-3 h-3 text-orange-500" />
                      {userPoints} {isRTL ? 'نقطة' : 'points'}
                    </p>
                  </div>
                </div>
                
                <Link to="/my-account" onClick={() => setOpen(false)}>
                  <Button className="w-full gap-2 bg-orange-500 hover:bg-orange-600 text-white">
                    <User className="w-4 h-4" />
                    {isRTL ? "حسابي" : "My Account"}
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

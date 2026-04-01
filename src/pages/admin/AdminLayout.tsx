import { useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import AdminPWAInstallPrompt from "@/components/AdminPWAInstallPrompt";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  CalendarDays, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  Calendar
} from "lucide-react";

const AdminLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { t, isRTL } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/admin", label: t.admin.nav.dashboard, icon: LayoutDashboard, exact: true },
    { path: "/admin/analytics", label: t.admin.nav.analytics, icon: TrendingUp },
    { path: "/admin/menu", label: t.admin.nav.menu, icon: UtensilsCrossed },
    { path: "/admin/reservations", label: t.admin.nav.reservations, icon: CalendarDays },
    { path: "/admin/calendar", label: t.admin.nav.calendar, icon: Calendar },
    { path: "/admin/staff", label: t.admin.nav.staff, icon: Users, adminOnly: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className={`min-h-screen bg-background flex ${isRTL ? 'flex-row-reverse' : ''}`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 z-50 w-64 bg-secondary transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isRTL 
          ? `right-0 ${sidebarOpen ? 'translate-x-0' : 'translate-x-full'}`
          : `left-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
      }`}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-secondary-foreground/10">
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2">
                <img 
                  src="/images/shayboub-logo.png" 
                  alt="Shayboub Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className={isRTL ? 'text-right' : ''}>
                <h1 className="font-display font-bold text-secondary-foreground">
                  {isRTL ? 'شيبوب' : 'Shayboub'}
                </h1>
                <p className="text-xs text-secondary-foreground/60">{t.admin.title}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              // Hide admin-only items from staff
              if (item.adminOnly && !isAdmin) return null;
              
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isRTL ? 'flex-row-reverse' : ''
                  } ${
                    active 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-secondary-foreground/70 hover:bg-secondary-foreground/10 hover:text-secondary-foreground'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {active && <ChevronRight className={`w-4 h-4 ${isRTL ? 'mr-auto rotate-180' : 'ml-auto'}`} />}
                </Link>
              );
            })}
          </nav>

          {/* User info & logout */}
          <div className="p-4 border-t border-secondary-foreground/10">
            <div className={`flex items-center gap-3 px-4 py-2 mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : ''}`}>
                <p className="text-sm font-medium text-secondary-foreground truncate">{user?.name}</p>
                <p className="text-xs text-secondary-foreground/60 capitalize">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-secondary-foreground/70 hover:bg-destructive/10 hover:text-destructive transition-all ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">{t.admin.logout}</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className={`bg-card border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <LanguageToggle />
            <a 
              href="/" 
              target="_blank"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {t.admin.nav.viewWebsite}
            </a>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      {/* Admin PWA Install Prompt */}
      <AdminPWAInstallPrompt />
    </div>
  );
};

export default AdminLayout;

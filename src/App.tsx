import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index.tsx";
import Login from "./pages/Login.tsx";
import CustomerLogin from "./pages/CustomerLogin.tsx";
import Signup from "./pages/Signup.tsx";
import MyAccount from "./pages/MyAccount.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Analytics from "./pages/admin/Analytics.tsx";
import MenuManagement from "./pages/admin/MenuManagement.tsx";
import Reservations from "./pages/admin/Reservations.tsx";
import ReservationCalendar from "./pages/admin/ReservationCalendar.tsx";
import StaffManagement from "./pages/admin/StaffManagement.tsx";
import AdminLoyalty from "./pages/admin/Loyalty.tsx";

// Lazy load legal pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy.tsx"));
const TermsOfService = lazy(() => import("./pages/TermsOfService.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <PWAInstallPrompt />
          <BrowserRouter>
            <CookieConsent />
            <AuthProvider>
            <FavoritesProvider>
            <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/customer-login" element={<CustomerLogin />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Legal Pages */}
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              
              {/* Customer Routes */}
              <Route path="/my-account" element={
                <ProtectedRoute>
                  <MyAccount />
                </ProtectedRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="menu" element={<MenuManagement />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="calendar" element={<ReservationCalendar />} />
                <Route path="staff" element={<StaffManagement />} />
                <Route path="loyalty" element={<AdminLoyalty />} />
              </Route>

              {/* Staff Routes (same layout, limited access) */}
              <Route path="/staff" element={
                <ProtectedRoute requiredRole="staff">
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reservations" element={<Reservations />} />
                <Route path="calendar" element={<ReservationCalendar />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          </FavoritesProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </LanguageProvider>
</ThemeProvider>
</QueryClientProvider>
);

export default App;

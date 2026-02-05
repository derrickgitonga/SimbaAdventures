import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Tours from "./pages/Tours";
import TourDetail from "./pages/TourDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import SafetyFirst from "./pages/SafetyFirst";
import SmallGroups from "./pages/SmallGroups";
import ExpertGuides from "./pages/ExpertGuides";
import FlexibleBooking from "./pages/FlexibleBooking";
import LocalImpact from "./pages/LocalImpact";
import PassionDriven from "./pages/PassionDriven";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPOS from "./pages/admin/AdminPOS";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminActivityLogs from "./pages/admin/AdminActivityLogs";
import AdminTours from "./pages/admin/AdminTours";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tours" element={<Tours />} />
            <Route path="/tours/:slug" element={<TourDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/safety-first" element={<SafetyFirst />} />
            <Route path="/small-groups" element={<SmallGroups />} />
            <Route path="/expert-guides" element={<ExpertGuides />} />
            <Route path="/flexible-booking" element={<FlexibleBooking />} />
            <Route path="/local-impact" element={<LocalImpact />} />
            <Route path="/passion-driven" element={<PassionDriven />} />

            {/* Admin Routes */}
            <Route path="/portal-access-v1/login" element={<AdminLogin />} />
            <Route path="/portal-access-v1" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="pos" element={<AdminPOS />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="activity" element={<AdminActivityLogs />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="analytics" element={<AdminDashboard />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;


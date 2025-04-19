
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Explore from "./pages/Explore";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PropertyDetails from "./pages/PropertyDetails";
import BookingSummary from "./pages/BookingSummary";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Trips from "./pages/Trips";
import HostListing from "./pages/HostListing";
import Messaging from "./pages/Messaging";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/booking/:id" element={<BookingSummary />} />
            <Route path="/favorites" element={<Wishlist />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/host" element={<HostListing />} />
            <Route path="/messages" element={<Messaging />} />
            {/* These routes will be replaced as the project grows */}
            <Route path="/listing/:id" element={<PropertyDetails />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

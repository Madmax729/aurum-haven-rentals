
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PropertyDetails from "./pages/PropertyDetails";
import BookingSummary from "./pages/BookingSummary";

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
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/booking/:id" element={<BookingSummary />} />
            {/* These routes will be implemented as the project grows */}
            <Route path="/explore" element={<NotFound />} />
            <Route path="/listing/:id" element={<NotFound />} />
            <Route path="/host" element={<NotFound />} />
            <Route path="/favorites" element={<NotFound />} />
            <Route path="/messages" element={<NotFound />} />
            <Route path="/profile" element={<NotFound />} />
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;

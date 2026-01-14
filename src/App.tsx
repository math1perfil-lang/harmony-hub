import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HouseProvider } from "@/contexts/HouseContext";
import { AuthProvider } from "@/contexts/AuthContext";
import HouseLanding from "./pages/HouseLanding";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import AboutPage from "./pages/AboutPage";
import RulesPage from "./pages/RulesPage";
import SocialPage from "./pages/SocialPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <HouseProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<HouseLanding />} />
              <Route path="/eventos" element={<EventsPage />} />
              <Route path="/evento/:eventId" element={<EventDetailPage />} />
              <Route path="/evento/:eventId/social" element={<SocialPage />} />
              <Route path="/sobre" element={<AboutPage />} />
              <Route path="/regras" element={<RulesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </HouseProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

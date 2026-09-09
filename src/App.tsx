import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HouseProvider } from "@/contexts/HouseContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { getSubdomainSlug } from "@/lib/tenant";
import HouseRoutes from "./routes/HouseRoutes";
import PlatformRoutes from "./routes/PlatformRoutes";

const queryClient = new QueryClient();

const hasSubdomain = !!getSubdomainSlug();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <HouseProvider>
          <AuthProvider>
            <Routes>
              <Route path="/c/:slug/*" element={<HouseRoutes />} />
              <Route
                path="/*"
                element={hasSubdomain ? <HouseRoutes /> : <PlatformRoutes />}
              />
            </Routes>
          </AuthProvider>
        </HouseProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

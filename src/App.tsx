import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BasketProvider } from "@/contexts/BasketContext";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Favourites from "./pages/Favourites";
import CarouselGames from "./pages/CarouselGames";
import Profile from "./pages/Profile";
import ContactSupport from "./pages/ContactSupport";
import PaymentReceipts from "./pages/PaymentReceipts";
import BillingAddress from "./pages/BillingAddress";
import Auth from "./pages/Auth";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import ListerProfile from "./pages/ListerProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FavoritesProvider>
          <BasketProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/favourites" element={<Favourites />} />
                <Route path="/games/:categoryId" element={<CarouselGames />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/contact-support" element={<ContactSupport />} />
                <Route path="/payment-receipts" element={<PaymentReceipts />} />
                <Route path="/billing-address" element={<BillingAddress />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/basket" element={<Basket />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/lister" element={<ListerProfile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BasketProvider>
        </FavoritesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

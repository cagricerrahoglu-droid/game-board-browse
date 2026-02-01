import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { BasketProvider } from "@/contexts/BasketContext";
import { CheckInProvider } from "@/contexts/CheckInContext";
import { RenterRatingProvider } from "@/contexts/RenterRatingContext";
import { RentalProvider } from "@/contexts/RentalContext";
import CheckInBanner from "@/components/CheckInBanner";
import CheckInModal from "@/components/CheckInModal";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Favourites from "./pages/Favourites";
import CarouselGames from "./pages/CarouselGames";
import Profile from "./pages/Profile";
import ContactSupport from "./pages/ContactSupport";
import PaymentReceipts from "./pages/PaymentReceipts";
import BillingAddress from "./pages/BillingAddress";
import Auth from "./pages/Auth";
import Confirm from "./pages/Confirm";
import Basket from "./pages/Basket";
import Checkout from "./pages/Checkout";
import LenderProfile from "./pages/LenderProfile";
import LenderHome from "./pages/LenderHome";
import AddGame from "./pages/AddGame";
import PayoutSettings from "./pages/PayoutSettings";
import AvailabilityPreferences from "./pages/AvailabilityPreferences";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FavoritesProvider>
          <BasketProvider>
            <BrowserRouter basename={import.meta.env.BASE_URL}>
              <CheckInProvider>
                <RenterRatingProvider>
                  <RentalProvider>
                    <Toaster />
                    <Sonner />
                    <CheckInBanner />
                    <CheckInModal />
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
                      <Route path="/confirm" element={<Confirm />} />
                      <Route path="/basket" element={<Basket />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/lender-home" element={<LenderHome />} />
                      <Route path="/lender" element={<LenderProfile />} />
                      <Route path="/add-game" element={<AddGame />} />
                      <Route path="/payout-settings" element={<PayoutSettings />} />
                      <Route path="/availability-preferences" element={<AvailabilityPreferences />} />
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </RentalProvider>
                </RenterRatingProvider>
              </CheckInProvider>
            </BrowserRouter>
          </BasketProvider>
        </FavoritesProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, ChevronRight, Wallet, Clock, CreditCard, Calendar, Truck, Tag, Settings, Users, Store } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import LenderOnboarding from "@/components/LenderOnboarding";
import LenderGameCard, { LenderGame } from "@/components/LenderGameCard";
import LenderStats from "@/components/LenderStats";
import { API } from "@/services/api";

import pawnToken from "@/assets/avatars/pawn-token.png";

// Generic placeholder for games without images
const DEFAULT_GAME_IMAGE = "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&h=400&fit=crop";

const LenderProfile = () => {
  const navigate = useNavigate();
  const { switchRole } = useAuth();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("lender_onboarding_completed");
  });
  const [mode, setMode] = useState<"renter" | "lender">("lender");

  // User data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: pawnToken,
  };

  // Stats data - calculated from database
  const [stats, setStats] = useState({
    gamesListed: 0,
    activeRentals: 0,
    earningsThisMonth: 0,
    lifetimeEarnings: 0,
  });

  // Earnings data
  const earnings = {
    availableBalance: stats.earningsThisMonth,
    pendingPayouts: 12.00,
    payoutMethod: "Bank Account •••• 4521",
  };

  // Lender settings
  const [settings, setSettings] = useState({
    sellAfterRent: true,
    allowPickup: true,
    allowDelivery: true,
  });

  // Games data - fetch from database
  const [games, setGames] = useState<LenderGame[]>([]);
  const [loadingGames, setLoadingGames] = useState(true);

  // Fetch games and rentals on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingGames(true);
        const userId = API.getCurrentUserId();
        if (!userId) {
          console.error('No user ID found');
          return;
        }

        // Fetch games
        const gamesResponse = await API.getGamesByOwner(userId);
        console.log('Fetched games:', gamesResponse);

        // Map database games to LenderGame format
        let mappedGames: LenderGame[] = [];
        // Backend returns games array directly
        if (Array.isArray(gamesResponse)) {
          mappedGames = gamesResponse.map((dbGame: any) => ({
            id: dbGame.game_id,
            title: dbGame.name,
            image: dbGame.image_url || DEFAULT_GAME_IMAGE,
            condition: dbGame.condition?.toLowerCase() as "excellent" | "good" | "fair" || "good",
            isComplete: dbGame.is_complete ?? true,
            hasManual: dbGame.has_manual ?? true,
            isAvailable: dbGame.available ?? true,
            status: dbGame.available ? "available" : "paused",
            rentalPrice: dbGame.rental_price ?? 4.99,
            sellAfterRent: dbGame.sell_after_rent ?? false,
            sellPrice: dbGame.sell_price,
          }));
          setGames(mappedGames);
        }

        // Fetch rentals for stats
        try {
          const rentalsResponse = await API.getRentalsByLender(userId);
          console.log('Fetched rentals:', rentalsResponse);

          let activeRentals = 0;
          let lifetimeEarnings = 0;
          let earningsThisMonth = 0;

          const currentDate = new Date();
          const currentMonth = currentDate.getMonth();
          const currentYear = currentDate.getFullYear();

          if (Array.isArray(rentalsResponse)) {
            rentalsResponse.forEach((rental: any) => {
              // Count active rentals
              if (rental.status === 'active') {
                activeRentals++;
              }

              // Calculate earnings (using deposit_amount as proxy for rental income)
              const rentalIncome = rental.deposit_amount || 0;
              lifetimeEarnings += rentalIncome;

              // Check if rental is from this month
              if (rental.created_at) {
                const rentalDate = new Date(rental.created_at);
                if (rentalDate.getMonth() === currentMonth && rentalDate.getFullYear() === currentYear) {
                  earningsThisMonth += rentalIncome;
                }
              }
            });
          }

          // Update stats
          setStats({
            gamesListed: mappedGames.length,
            activeRentals,
            earningsThisMonth,
            lifetimeEarnings,
          });
        } catch (rentalError) {
          console.error('Failed to fetch rentals:', rentalError);
          // Still update games count even if rentals fail
          setStats(prev => ({
            ...prev,
            gamesListed: mappedGames.length,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        toast.error('Failed to load your profile data');
      } finally {
        setLoadingGames(false);
      }
    };

    fetchData();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem("lender_onboarding_completed", "true");
    setShowOnboarding(false);
    toast.success("Welcome to Lender mode! 🎉");
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("lender_onboarding_completed", "true");
    setShowOnboarding(false);
  };

  const handleModeSwitch = () => {
    if (mode === "lender") {
      setMode("renter");
      switchRole("renter");
      navigate("/profile");
    } else {
      setMode("lender");
      switchRole("lender");
    }
  };

  const handleToggleAvailability = async (id: number, available: boolean) => {
    try {
      // Update in database
      await API.updateGame(String(id), { available });
      
      // Update local state
      setGames(prev => prev.map(game => 
        game.id === id ? { ...game, isAvailable: available, status: available ? "available" : "paused" } : game
      ));
      toast.success(available ? "Game is now listed" : "Game unlisted");
    } catch (error) {
      console.error('Failed to toggle availability:', error);
      toast.error('Failed to update game availability');
    }
  };

  const handleDeleteGame = async (id: number) => {
    try {
      // Delete from database
      await API.deleteGame(String(id));
      
      // Update local state
      setGames(games => games.filter(game => game.id !== id));
      toast.success("Game removed from your listings");
    } catch (error) {
      console.error('Failed to delete game:', error);
      toast.error('Failed to delete game');
    }
  };

  const handlePauseGame = async (id: number) => {
    try {
      // Update in database
      await API.updateGame(String(id), { available: false });
      
      // Update local state
      setGames(prev => prev.map(game => 
        game.id === id ? { ...game, isAvailable: false, status: "paused" } : game
      ));
      toast.success("Game paused");
    } catch (error) {
      console.error('Failed to pause game:', error);
      toast.error('Failed to pause game');
    }
  };

  const handleToggleSellAfterRent = async (id: number, enabled: boolean) => {
    try {
      // Update in database
      await API.updateGame(String(id), { sell_after_rent: enabled });
      
      // Update local state
      setGames(prev => prev.map(game => 
        game.id === id ? { ...game, sellAfterRent: enabled } : game
      ));
      toast.success(enabled ? "Game is now open to sell" : "Game is no longer open to sell");
    } catch (error) {
      console.error('Failed to toggle sell after rent:', error);
      toast.error('Failed to update sell after rent setting');
    }
  };

  const SettingsRow = ({ icon: Icon, label, showSwitch = false, switchChecked = false, onSwitchChange, onClick }: {
    icon: React.ElementType;
    label: string;
    showSwitch?: boolean;
    switchChecked?: boolean;
    onSwitchChange?: (checked: boolean) => void;
    onClick?: () => void;
  }) => (
    <div
      onClick={showSwitch ? undefined : onClick}
      className={`w-full flex items-center justify-between py-3 px-1 rounded-lg transition-colors ${showSwitch ? '' : 'hover:bg-muted/50 cursor-pointer'}`}
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-foreground">{label}</span>
      </div>
      {showSwitch ? (
        <Switch checked={switchChecked} onCheckedChange={onSwitchChange} />
      ) : (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {showOnboarding && (
          <LenderOnboarding onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 px-4 py-4">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Lender Profile</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* User Info Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center gap-3">
                  <Avatar className="h-20 w-20 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                    <p className="text-sm text-muted-foreground">Manage your games and earnings</p>
                  </div>
                  <button
                    onClick={() => {
                      switchRole("renter");
                      navigate('/profile');
                    }}
                    className="relative flex items-center bg-muted rounded-full p-0.5 w-36 h-8"
                  >
                    <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium">
                      <span className="text-muted-foreground">Renter</span>
                      <span className="text-primary-foreground z-10">Lender</span>
                    </div>
                    <div className="absolute right-0.5 w-[calc(50%-2px)] h-7 bg-primary rounded-full transition-all duration-300" />
                  </button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => toast.info("Edit profile coming soon")}
                  >
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Primary Action - Add Game */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <Button 
              className="w-full h-14 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all"
              size="lg"
              onClick={() => navigate("/add-game")}
            >
              <Plus className="h-6 w-6 mr-2" />
              Add a game
            </Button>
          </motion.div>

          {/* Stats Snapshot */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <LenderStats stats={stats} />
          </motion.div>

          {/* Your Games Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Your Games</h2>
              <span className="text-sm text-muted-foreground">{games.length} games</span>
            </div>
            {loadingGames ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading your games...</p>
              </div>
            ) : games.length === 0 ? (
              <div className="text-center py-8 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-2">No games listed yet</p>
                <p className="text-xs text-muted-foreground">Add your first game to get started!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {games.map((game, index) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                  >
                    <LenderGameCard
                      game={game}
                      onToggleAvailability={handleToggleAvailability}
                      onToggleSellAfterRent={handleToggleSellAfterRent}
                      onPause={handlePauseGame}
                      onDelete={handleDeleteGame}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Earnings Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-primary" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-secondary/10 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1">Available Balance</p>
                    <p className="text-2xl font-bold text-secondary">£{earnings.availableBalance.toFixed(2)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Pending
                    </p>
                    <p className="text-2xl font-bold text-foreground">£{earnings.pendingPayouts.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Payout Method</p>
                      <p className="text-xs text-muted-foreground">{earnings.payoutMethod}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>

                <Button variant="outline" className="w-full" onClick={() => toast.info("View earnings coming soon")}>
                  View Earnings History
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Lender Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  Lender Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <SettingsRow icon={Calendar} label="Availability Preferences" onClick={() => navigate("/availability-preferences")} />
                
                <Separator className="my-2" />
                
                <SettingsRow 
                  icon={Tag} 
                  label="Allow Sell-After-Rent" 
                  showSwitch 
                  switchChecked={settings.sellAfterRent}
                  onSwitchChange={(checked) => setSettings(prev => ({ ...prev, sellAfterRent: checked }))}
                />
                
                <Separator className="my-2" />
                
                <SettingsRow 
                  icon={Truck} 
                  label="Offer Pickup" 
                  showSwitch 
                  switchChecked={settings.allowPickup}
                  onSwitchChange={(checked) => setSettings(prev => ({ ...prev, allowPickup: checked }))}
                />
                <SettingsRow 
                  icon={Truck} 
                  label="Offer Delivery" 
                  showSwitch 
                  switchChecked={settings.allowDelivery}
                  onSwitchChange={(checked) => setSettings(prev => ({ ...prev, allowDelivery: checked }))}
                />
                
                <Separator className="my-2" />
                
                <SettingsRow icon={CreditCard} label="Payout Settings" onClick={() => navigate("/payout-settings")} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <BottomNav />
      </div>
    </>
  );
};

export default LenderProfile;

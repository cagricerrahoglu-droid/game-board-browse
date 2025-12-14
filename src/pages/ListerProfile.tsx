import { useState } from "react";
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
import BottomNav from "@/components/BottomNav";
import ListerOnboarding from "@/components/ListerOnboarding";
import ListerGameCard, { ListerGame } from "@/components/ListerGameCard";
import ListerStats from "@/components/ListerStats";

import pawnToken from "@/assets/avatars/pawn-token.png";
import catanImage from "@/assets/games/7-wonders-duel.jpg";
import ticketToRide from "@/assets/games/pandemic.jpg";
import wingspan from "@/assets/games/splendor.jpg";

const ListerProfile = () => {
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem("lister_onboarding_completed");
  });
  const [mode, setMode] = useState<"renter" | "lister">("lister");

  // User data
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: pawnToken,
  };

  // Stats data
  const stats = {
    gamesListed: 8,
    activeRentals: 3,
    earningsThisMonth: 47.50,
    lifetimeEarnings: 324.00,
  };

  // Earnings data
  const earnings = {
    availableBalance: 47.50,
    pendingPayouts: 12.00,
    payoutMethod: "Bank Account •••• 4521",
  };

  // Lister settings
  const [settings, setSettings] = useState({
    sellAfterRent: true,
    allowPickup: true,
    allowDelivery: true,
  });

  // Mock games data
  const [games, setGames] = useState<ListerGame[]>([
    {
      id: 1,
      title: "7 Wonders Duel",
      image: catanImage,
      condition: "excellent",
      isComplete: true,
      hasManual: true,
      isAvailable: true,
      status: "available",
      rentalPrice: 4.99,
      sellAfterRent: true,
      sellPrice: 25.00,
    },
    {
      id: 2,
      title: "Pandemic",
      image: ticketToRide,
      condition: "good",
      isComplete: true,
      hasManual: true,
      isAvailable: true,
      status: "rented",
      rentalPrice: 3.99,
      sellAfterRent: false,
    },
    {
      id: 3,
      title: "Splendor",
      image: wingspan,
      condition: "good",
      isComplete: false,
      hasManual: false,
      isAvailable: false,
      status: "paused",
      rentalPrice: 3.49,
      sellAfterRent: true,
      sellPrice: 20.00,
    },
  ]);

  const handleOnboardingComplete = () => {
    localStorage.setItem("lister_onboarding_completed", "true");
    setShowOnboarding(false);
    toast.success("Welcome to Lister mode! 🎉");
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem("lister_onboarding_completed", "true");
    setShowOnboarding(false);
  };

  const handleModeSwitch = () => {
    if (mode === "lister") {
      setMode("renter");
      navigate("/profile");
    } else {
      setMode("lister");
    }
  };

  const handleToggleAvailability = (id: number, available: boolean) => {
    setGames(prev => prev.map(game => 
      game.id === id ? { ...game, isAvailable: available, status: available ? "available" : "paused" } : game
    ));
    toast.success(available ? "Game is now listed" : "Game unlisted");
  };

  const handleDeleteGame = (id: number) => {
    setGames(games => games.filter(game => game.id !== id));
    toast.success("Game removed from your listings");
  };

  const handlePauseGame = (id: number) => {
    setGames(prev => prev.map(game => 
      game.id === id ? { ...game, isAvailable: false, status: "paused" } : game
    ));
    toast.success("Game paused");
  };

  const handleToggleSellAfterRent = (id: number, enabled: boolean) => {
    setGames(prev => prev.map(game => 
      game.id === id ? { ...game, sellAfterRent: enabled } : game
    ));
    toast.success(enabled ? "Game is now open to sell" : "Game is no longer open to sell");
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
          <ListerOnboarding onComplete={handleOnboardingComplete} onSkip={handleOnboardingSkip} />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-background pb-24">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4 px-4 py-4">
            <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-xl font-semibold text-foreground">Lister Profile</h1>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* User Info Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                      <Badge className="bg-accent/20 text-accent border-accent/30">Lister</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Manage your games and earnings</p>
                  </div>
                </div>

                {/* Mode Toggle */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Renter</span>
                    </div>
                    <Switch 
                      checked={mode === "lister"} 
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          handleModeSwitch();
                        }
                      }}
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">Lister</span>
                      <Store className="h-4 w-4 text-primary" />
                    </div>
                  </div>
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
            <ListerStats stats={stats} />
          </motion.div>

          {/* Your Games Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Your Games</h2>
              <span className="text-sm text-muted-foreground">{games.length} games</span>
            </div>
            <div className="space-y-3">
              {games.map((game, index) => (
                <motion.div
                  key={game.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <ListerGameCard
                    game={game}
                    onToggleAvailability={handleToggleAvailability}
                    onToggleSellAfterRent={handleToggleSellAfterRent}
                    onPause={handlePauseGame}
                    onDelete={handleDeleteGame}
                  />
                </motion.div>
              ))}
            </div>
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

          {/* Lister Settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  Lister Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <SettingsRow icon={Calendar} label="Availability Preferences" onClick={() => toast.info("Coming soon")} />
                
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

export default ListerProfile;

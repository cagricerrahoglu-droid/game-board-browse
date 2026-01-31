import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Camera, ChevronRight, CreditCard, Bell, Globe, FileText, Shield, LogOut, HelpCircle, MessageCircle, AlertTriangle, Plus, Upload, Trash2, Pencil, Users, Store, X, Star, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCheckIn } from "@/contexts/CheckInContext";
import { useRenterRating } from "@/contexts/RenterRatingContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";
import { API } from "@/services/api";

// Tabletop-themed avatar imports
import pawnToken from "@/assets/avatars/pawn-token.png";
import treasureChest from "@/assets/avatars/treasure-chest.png";
import lantern from "@/assets/avatars/lantern.png";
import castleTower from "@/assets/avatars/castle-tower.png";
import magicPotion from "@/assets/avatars/magic-potion.png";
import woodToken from "@/assets/avatars/wood-token.png";
import stoneToken from "@/assets/avatars/stone-token.png";
import foodToken from "@/assets/avatars/food-token.png";
import strategist from "@/assets/avatars/strategist.png";
import partyPlayer from "@/assets/avatars/party-player.png";
import familyGamer from "@/assets/avatars/family-gamer.png";
import adventurer from "@/assets/avatars/adventurer.png";
import puzzleSolver from "@/assets/avatars/puzzle-solver.png";
import hexTile from "@/assets/avatars/hex-tile.png";
import cardDeck from "@/assets/avatars/card-deck.png";
import hourglass from "@/assets/avatars/hourglass.png";
import starBadge from "@/assets/avatars/star-badge.png";
import trophy from "@/assets/avatars/trophy.png";

// Avatar categories
const avatarCategories = [
  {
    name: "Token Icons",
    avatars: [pawnToken, treasureChest, lantern, castleTower, magicPotion, woodToken, stoneToken, foodToken]
  },
  {
    name: "Player Archetypes",
    avatars: [strategist, partyPlayer, familyGamer, adventurer, puzzleSolver]
  },
  {
    name: "Game Badges",
    avatars: [hexTile, cardDeck, hourglass, starBadge, trophy]
  }
];

const defaultAvatars = avatarCategories.flatMap(cat => cat.avatars);

const Profile = () => {
  const navigate = useNavigate();
  const { logout, selectedRole, switchRole } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentDetailModalOpen, setIsPaymentDetailModalOpen] = useState(false);
  const [isEditingPayment, setIsEditingPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<{ id: number; type: string; last4: string; expiry: string; name: string; billingAddress: string } | null>(null);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", last4: "4242", expiry: "12/26", name: "John Doe", billingAddress: "123 Main St, City" },
  ]);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });
  const [editCard, setEditCard] = useState({
    expiry: "",
    name: "",
    billingAddress: "",
  });

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editedUser, setEditedUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
  });


  const handleAvatarSelect = (avatarUrl: string) => {
    setUser(prev => ({ ...prev, avatar: avatarUrl }));
    setIsAvatarModalOpen(false);
    toast.success("Avatar updated successfully");
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUser(prev => ({ ...prev, avatar: result }));
        setIsAvatarModalOpen(false);
        toast.success("Profile picture updated successfully");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    if (!editedUser.name.trim() || !editedUser.email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setUser(prev => ({ ...prev, name: editedUser.name, email: editedUser.email }));
    setIsEditProfileOpen(false);
    toast.success("Profile updated successfully");
  };

  const handleAddPaymentMethod = () => {
    if (!newCard.cardNumber || !newCard.expiry || !newCard.cvv || !newCard.name) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const last4 = newCard.cardNumber.replace(/\s/g, "").slice(-4);
    const cardType = newCard.cardNumber.startsWith("4") ? "Visa" : 
                     newCard.cardNumber.startsWith("5") ? "Mastercard" : "Card";
    
    setPaymentMethods(prev => [...prev, {
      id: Date.now(),
      type: cardType,
      last4,
      expiry: newCard.expiry,
      name: newCard.name,
      billingAddress: "",
    }]);
    
    setNewCard({ cardNumber: "", expiry: "", cvv: "", name: "" });
    setIsPaymentModalOpen(false);
    toast.success("Payment method added successfully");
  };

  const handleOpenPaymentDetail = (method: { id: number; type: string; last4: string; expiry: string; name: string; billingAddress: string }) => {
    setSelectedPayment(method);
    setEditCard({ expiry: method.expiry, name: method.name, billingAddress: method.billingAddress });
    setIsEditingPayment(false);
    setIsPaymentDetailModalOpen(true);
  };

  const handleDeletePayment = () => {
    if (selectedPayment) {
      setPaymentMethods(prev => prev.filter(m => m.id !== selectedPayment.id));
      setIsPaymentDetailModalOpen(false);
      setSelectedPayment(null);
      toast.success("Payment method deleted");
    }
  };

  const handleUpdatePayment = () => {
    if (selectedPayment && editCard.expiry && editCard.name) {
      setPaymentMethods(prev => prev.map(m => 
        m.id === selectedPayment.id 
          ? { ...m, expiry: editCard.expiry, name: editCard.name, billingAddress: editCard.billingAddress }
          : m
      ));
      setSelectedPayment(prev => prev ? { ...prev, expiry: editCard.expiry, name: editCard.name, billingAddress: editCard.billingAddress } : null);
      setIsEditingPayment(false);
      toast.success("Payment method updated");
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  // Mock user data
  const [user, setUser] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: pawnToken,
  });

  // Rentals state - fetch from database
  const [currentRentals, setCurrentRentals] = useState<any[]>([]);
  const [pastRentals, setPastRentals] = useState<any[]>([]);
  const [loadingRentals, setLoadingRentals] = useState(true);

  // Fetch rentals on mount
  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoadingRentals(true);
        const userId = API.getCurrentUserId();
        if (!userId) {
          console.error('No user ID found');
          return;
        }

        const rentalsResponse = await API.getRentalsByRenter(userId);
        console.log('Fetched rentals:', rentalsResponse);

        if (Array.isArray(rentalsResponse)) {
          const currentDate = new Date();
          const current: any[] = [];
          const past: any[] = [];

          rentalsResponse.forEach((rental: any) => {
            const endDate = new Date(rental.end_date);
            const daysUntilDue = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
            
            const rentalItem = {
              id: rental.rental_id,
              name: rental.game_name,
              dueDate: endDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              returnedDate: rental.updated_at ? new Date(rental.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : null,
              status: rental.status === 'completed' || rental.status === 'cancelled' 
                ? 'returned' 
                : daysUntilDue < 0 
                  ? 'late' 
                  : daysUntilDue <= 3 
                    ? 'due-soon' 
                    : 'active'
            };

            if (rental.status === 'active') {
              current.push(rentalItem);
            } else {
              past.push(rentalItem);
            }
          });

          setCurrentRentals(current);
          setPastRentals(past);
        }
      } catch (error) {
        console.error('Failed to fetch rentals:', error);
        toast.error('Failed to load rental activity');
      } finally {
        setLoadingRentals(false);
      }
    };

    fetchRentals();
  }, []);

  const { completedCheckIns } = useCheckIn();
  const { renterRating, isRatingVisible, showFirstTimeBanner, dismissBanner, getRatingMessage } = useRenterRating();

  const getRatingForRental = (rentalId: number) => {
    const checkIn = completedCheckIns.find(c => c.rentalId === rentalId);
    return checkIn?.rating;
  };

  const ratingMessage = getRatingMessage();


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "due-soon":
        return <Badge variant="outline" className="bg-amber-500/20 text-amber-400 border-amber-500/30">Due Soon</Badge>;
      case "active":
        return <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>;
      case "returned":
        return <Badge variant="outline" className="bg-muted text-muted-foreground">Returned</Badge>;
      case "late":
        return <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive/30">Late</Badge>;
      default:
        return null;
    }
  };

  const SettingsRow = ({ icon: Icon, label, onClick, showSwitch = false, switchChecked = false, onSwitchChange }: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    showSwitch?: boolean;
    switchChecked?: boolean;
    onSwitchChange?: (checked: boolean) => void;
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
        <Switch 
          checked={switchChecked} 
          onCheckedChange={onSwitchChange}
        />
      ) : (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate(selectedRole === "lender" ? "/lender-home" : "/")} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Info Section */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button 
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                </button>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={() => {
                  switchRole(selectedRole === "renter" ? "lender" : "renter");
                }}
                className="relative flex items-center bg-muted rounded-full p-0.5 w-36 h-8"
              >
                <div className="absolute inset-0 flex items-center justify-between px-4 text-xs font-medium">
                  <span className={selectedRole === "renter" ? "text-primary-foreground z-10" : "text-muted-foreground"}>Renter</span>
                  <span className={selectedRole === "lender" ? "text-primary-foreground z-10" : "text-muted-foreground"}>Lender</span>
                </div>
                <div className={`absolute ${selectedRole === "renter" ? "left-0.5" : "left-[calc(50%+2px)]"} w-[calc(50%-2px)] h-7 bg-primary rounded-full transition-all duration-300`} />
              </button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setEditedUser({ name: user.name, email: user.email });
                  setIsEditProfileOpen(true);
                }}
              >
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* First-time Rating Banner */}
        {showFirstTimeBanner && (
          <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/20 rounded-xl p-4">
            <button
              onClick={dismissBanner}
              className="absolute top-3 right-3 p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/20 rounded-full">
                <Star className="h-5 w-5 text-primary fill-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  You now have a renter rating ⭐
                </h3>
                <p className="text-sm text-muted-foreground">
                  See how you're doing based on feedback from lenders.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Your Renter Rating */}
        {isRatingVisible && (
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                Your Renter Rating
                <span className="text-xs font-normal text-muted-foreground">(Private)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Star Rating Display */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      className={cn(
                        "h-6 w-6",
                        renterRating.averageRating >= value
                          ? "fill-[hsl(var(--star))] text-[hsl(var(--star))]"
                          : renterRating.averageRating >= value - 0.5
                          ? "fill-[hsl(var(--star))]/50 text-[hsl(var(--star))]"
                          : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </div>
                <span className="text-2xl font-bold text-foreground">
                  {renterRating.averageRating.toFixed(1)}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">
                Based on feedback from lenders after game returns.
              </p>

              {/* Adaptive Message */}
              <div className={cn(
                "p-3 rounded-lg",
                ratingMessage.tone === "high" && "bg-emerald-500/10 border border-emerald-500/20",
                ratingMessage.tone === "medium" && "bg-amber-500/10 border border-amber-500/20",
                ratingMessage.tone === "low" && "bg-muted border border-border"
              )}>
                <div className="flex items-start gap-2">
                  <Info className={cn(
                    "h-4 w-4 mt-0.5 flex-shrink-0",
                    ratingMessage.tone === "high" && "text-emerald-500",
                    ratingMessage.tone === "medium" && "text-amber-500",
                    ratingMessage.tone === "low" && "text-muted-foreground"
                  )} />
                  <div>
                    <p className={cn(
                      "text-sm font-medium mb-1",
                      ratingMessage.tone === "high" && "text-emerald-600 dark:text-emerald-400",
                      ratingMessage.tone === "medium" && "text-amber-600 dark:text-amber-400",
                      ratingMessage.tone === "low" && "text-foreground"
                    )}>
                      {ratingMessage.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {ratingMessage.message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Educational Copy */}
              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Lenders rate how games are returned — including condition, care, and timeliness.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rental Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Rental Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingRentals ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-muted-foreground">Loading rental activity...</p>
              </div>
            ) : (
              <>
                {/* Current Rentals */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Current Rentals</h3>
                  {currentRentals.length > 0 ? (
                    <div className="space-y-3">
                      {currentRentals.map((rental) => (
                        <div key={rental.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{rental.name}</p>
                            <p className="text-sm text-muted-foreground">Due: {rental.dueDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(rental.status)}
                            {rental.status === "due-soon" && (
                              <Button variant="ghost" size="sm" className="text-primary text-xs">
                                Extend
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No current rentals</p>
                  )}
                </div>

                <Separator />

                {/* Past Rentals */}
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">Past Rentals</h3>
                  {pastRentals.length > 0 ? (
                    <div className="space-y-3">
                      {pastRentals.map((rental) => (
                        <div key={rental.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                          <div>
                            <p className="font-medium text-foreground">{rental.name}</p>
                            <p className="text-sm text-muted-foreground">Returned: {rental.returnedDate}</p>
                          </div>
                          {getStatusBadge(rental.status)}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No past rentals</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Payments & Billing */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Payments & Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Saved Payment Methods */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3">Payment Methods</h3>
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <button 
                    key={method.id} 
                    className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenPaymentDetail(method)}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{method.type} •••• {method.last4}</p>
                        <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payment Method
                </Button>
              </div>
            </div>

            <Separator />

            <SettingsRow icon={FileText} label="Billing Address" onClick={() => navigate('/billing-address')} />
          </CardContent>
        </Card>

        {/* App & Account Settings */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">App & Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingsRow 
              icon={Bell} 
              label="Push Notifications" 
              showSwitch 
              switchChecked={notifications.push} 
              onSwitchChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
            />
            <SettingsRow 
              icon={Bell} 
              label="Email Notifications" 
              showSwitch 
              switchChecked={notifications.email} 
              onSwitchChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
            />
            <Separator className="my-3" />
            <SettingsRow icon={FileText} label="Rental Policy" />
            <SettingsRow icon={Shield} label="Privacy Policy" />
            <SettingsRow icon={FileText} label="Terms & Conditions" />
            <Separator className="my-3" />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 py-3 px-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </button>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Support</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <SettingsRow icon={HelpCircle} label="FAQs" />
            <SettingsRow icon={MessageCircle} label="Contact Support" onClick={() => navigate('/contact-support')} />
            <SettingsRow icon={AlertTriangle} label="Report an Issue" />
          </CardContent>
        </Card>
      </div>

      <BottomNav />

      {/* Add Payment Method Modal */}
      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details to add a new payment method.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newCard.name}
                onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="4242 4242 4242 4242"
                value={newCard.cardNumber}
                maxLength={19}
                onChange={(e) => setNewCard(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={newCard.expiry}
                  maxLength={5}
                  onChange={(e) => setNewCard(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  type="password"
                  value={newCard.cvv}
                  maxLength={4}
                  onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value.replace(/[^0-9]/g, "") }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPaymentMethod}>
              Add Card
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Method Detail Modal */}
      <Dialog open={isPaymentDetailModalOpen} onOpenChange={setIsPaymentDetailModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Method</DialogTitle>
            <DialogDescription>
              {isEditingPayment ? "Update your card details." : "View and manage your payment method."}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4 py-4">
              {isEditingPayment ? (
                <>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-8 w-8 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">{selectedPayment.type}</p>
                        <p className="text-sm text-muted-foreground">•••• •••• •••• {selectedPayment.last4}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editName">Cardholder Name</Label>
                    <Input
                      id="editName"
                      placeholder="John Doe"
                      value={editCard.name}
                      onChange={(e) => setEditCard(prev => ({ ...prev, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editExpiry">Expiry Date</Label>
                    <Input
                      id="editExpiry"
                      placeholder="MM/YY"
                      value={editCard.expiry}
                      maxLength={5}
                      onChange={(e) => setEditCard(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="editBillingAddress">Billing Address</Label>
                    <Input
                      id="editBillingAddress"
                      placeholder="123 Main St, City"
                      value={editCard.billingAddress}
                      onChange={(e) => setEditCard(prev => ({ ...prev, billingAddress: e.target.value }))}
                    />
                  </div>
                </>
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">{selectedPayment.type}</p>
                      <p className="text-sm text-muted-foreground">•••• •••• •••• {selectedPayment.last4}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cardholder</span>
                      <span className="text-sm font-medium text-foreground">{selectedPayment.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Card Type</span>
                      <span className="text-sm font-medium text-foreground">{selectedPayment.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Last 4 Digits</span>
                      <span className="text-sm font-medium text-foreground">{selectedPayment.last4}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expires</span>
                      <span className="text-sm font-medium text-foreground">{selectedPayment.expiry}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Billing Address</span>
                      <span className="text-sm font-medium text-foreground text-right max-w-[60%]">{selectedPayment.billingAddress}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex-col sm:flex-row gap-2">
            {isEditingPayment ? (
              <>
                <Button variant="outline" onClick={() => setIsEditingPayment(false)} className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button onClick={handleUpdatePayment} className="w-full sm:w-auto">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="destructive" 
                  onClick={handleDeletePayment}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditingPayment(true)}
                  className="w-full sm:w-auto"
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Profile Modal */}
      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="profileName">Name</Label>
              <Input
                id="profileName"
                placeholder="John Doe"
                value={editedUser.name}
                onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="profileEmail">Email</Label>
              <Input
                id="profileEmail"
                type="email"
                placeholder="john.doe@example.com"
                value={editedUser.email}
                onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProfileOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avatar Selection Modal */}
      <Dialog open={isAvatarModalOpen} onOpenChange={setIsAvatarModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
            <DialogDescription>
              Choose an avatar or upload your own photo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            {avatarCategories.map((category, catIndex) => (
              <div key={catIndex}>
                <Label className="text-sm font-medium text-muted-foreground">{category.name}</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {category.avatars.map((avatarUrl, index) => (
                    <button
                      key={index}
                      onClick={() => handleAvatarSelect(avatarUrl)}
                      className={`p-1 rounded-full border-2 transition-all hover:scale-105 ${
                        user.avatar === avatarUrl 
                          ? 'border-primary ring-2 ring-primary/20' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={avatarUrl} className="object-cover" />
                        <AvatarFallback>A</AvatarFallback>
                      </Avatar>
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <Separator />
            <div>
              <Label className="text-sm font-medium">Or Upload Your Own</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button 
                variant="outline" 
                className="w-full mt-3"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default Profile;

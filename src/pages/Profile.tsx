import { useState, useRef } from "react";
import { ArrowLeft, Camera, ChevronRight, CreditCard, Bell, Globe, FileText, Shield, LogOut, HelpCircle, MessageCircle, AlertTriangle, Plus, Upload, Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
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

  // Mock current rentals
  const currentRentals = [
    { id: 1, name: "Catan", dueDate: "Dec 10, 2025", status: "due-soon" },
    { id: 2, name: "Ticket to Ride", dueDate: "Dec 15, 2025", status: "active" },
  ];

  // Mock past rentals
  const pastRentals = [
    { id: 1, name: "Pandemic", returnedDate: "Nov 20, 2025", status: "returned" },
    { id: 2, name: "Codenames", returnedDate: "Nov 5, 2025", status: "returned" },
  ];

  // Mock payment receipts
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<{
    id: number;
    date: string;
    game: string;
    rentalPeriod: string;
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId: string;
  } | null>(null);

  const paymentReceipts = [
    { id: 1, date: "Nov 25, 2025", game: "Pandemic", rentalPeriod: "Nov 10 - Nov 20, 2025", amount: 12.99, paymentMethod: "Visa •••• 4242", status: "Paid", transactionId: "TXN-2025-001234" },
    { id: 2, date: "Nov 10, 2025", game: "Codenames", rentalPeriod: "Oct 25 - Nov 5, 2025", amount: 9.99, paymentMethod: "Visa •••• 4242", status: "Paid", transactionId: "TXN-2025-001198" },
    { id: 3, date: "Oct 20, 2025", game: "Catan", rentalPeriod: "Oct 5 - Oct 15, 2025", amount: 14.99, paymentMethod: "Visa •••• 4242", status: "Paid", transactionId: "TXN-2025-001102" },
  ];

  const handleOpenReceipt = (receipt: typeof paymentReceipts[0]) => {
    setSelectedReceipt(receipt);
    setIsReceiptModalOpen(true);
  };


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
          <button onClick={() => navigate('/')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Info Section */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-16 w-16">
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
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => {
                    setEditedUser({ name: user.name, email: user.email });
                    setIsEditProfileOpen(true);
                  }}
                >
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Activity */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Rental Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
            </div>
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

            {/* Past Payment Receipts */}
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 mt-2">Past Payment Receipts</h3>
              <div className="space-y-2">
                {paymentReceipts.map((receipt) => (
                  <button
                    key={receipt.id}
                    className="w-full flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => handleOpenReceipt(receipt)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div className="text-left">
                        <p className="font-medium text-foreground">{receipt.game}</p>
                        <p className="text-sm text-muted-foreground">{receipt.date} • ${receipt.amount.toFixed(2)}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>

            <Separator />
            <SettingsRow icon={FileText} label="Billing Address" />
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
            <button className="w-full flex items-center gap-3 py-3 px-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
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

      {/* Receipt Detail Modal */}
      <Dialog open={isReceiptModalOpen} onOpenChange={setIsReceiptModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>
              Receipt details for your rental
            </DialogDescription>
          </DialogHeader>
          {selectedReceipt && (
            <div className="space-y-4 py-4">
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Transaction ID</span>
                  <span className="text-sm font-mono text-foreground">{selectedReceipt.transactionId}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Game Rented</span>
                  <span className="text-sm font-medium text-foreground">{selectedReceipt.game}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Rental Period</span>
                  <span className="text-sm text-foreground">{selectedReceipt.rentalPeriod}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Date</span>
                  <span className="text-sm text-foreground">{selectedReceipt.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Payment Method</span>
                  <span className="text-sm text-foreground">{selectedReceipt.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge variant="outline" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                    {selectedReceipt.status}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-base font-medium text-foreground">Total Amount</span>
                  <span className="text-lg font-semibold text-primary">${selectedReceipt.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReceiptModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;

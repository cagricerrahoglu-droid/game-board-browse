import { useState } from "react";
import { ArrowLeft, Camera, ChevronRight, CreditCard, Bell, Globe, FileText, Shield, LogOut, HelpCircle, MessageCircle, AlertTriangle, Plus } from "lucide-react";
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

const Profile = () => {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState({
    push: true,
    email: true,
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([
    { id: 1, type: "Visa", last4: "4242", expiry: "12/26" },
  ]);
  const [newCard, setNewCard] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: "",
  });

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
    }]);
    
    setNewCard({ cardNumber: "", expiry: "", cvv: "", name: "" });
    setIsPaymentModalOpen(false);
    toast.success("Payment method added successfully");
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
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    avatar: null,
  };

  // Mock current rentals
  const currentRentals = [
    { id: 1, name: "Catan", dueDate: "Dec 10, 2025", status: "due-soon" },
    { id: 2, name: "Ticket to Ride", dueDate: "Dec 15, 2025", status: "active" },
  ];

  // Mock past rentals
  const pastRentals = [
    { id: 1, name: "Pandemic", returnedDate: "Nov 20, 2025", status: "returned" },
    { id: 2, name: "Codenames", returnedDate: "Nov 5, 2025", status: "returned" },
    { id: 3, name: "Azul", returnedDate: "Oct 28, 2025", status: "late" },
  ];


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
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
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
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar || undefined} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full hover:bg-primary/90 transition-colors">
                  <Camera className="h-3.5 w-3.5 text-primary-foreground" />
                </button>
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <Button variant="outline" size="sm" className="mt-2">
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
                  <div key={method.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">{method.type} •••• {method.last4}</p>
                        <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
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

            <SettingsRow icon={FileText} label="Past Payment Receipts" />
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
            <SettingsRow icon={MessageCircle} label="Contact Support" />
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
    </div>
  );
};

export default Profile;

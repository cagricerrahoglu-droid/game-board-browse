import { ArrowLeft, Camera, ChevronRight, CreditCard, Bell, Globe, FileText, Shield, LogOut, HelpCircle, MessageCircle, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import BottomNav from "@/components/BottomNav";

const Profile = () => {
  const navigate = useNavigate();

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

  // Mock payment methods
  const paymentMethods = [
    { id: 1, type: "Visa", last4: "4242", expiry: "12/26" },
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

  const SettingsRow = ({ icon: Icon, label, onClick, showSwitch = false, switchChecked = false }: {
    icon: React.ElementType;
    label: string;
    onClick?: () => void;
    showSwitch?: boolean;
    switchChecked?: boolean;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 px-1 hover:bg-muted/50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <span className="text-foreground">{label}</span>
      </div>
      {showSwitch ? (
        <Switch checked={switchChecked} />
      ) : (
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      )}
    </button>
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
                <Button variant="outline" className="w-full mt-2">
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
            <SettingsRow icon={Bell} label="Push Notifications" showSwitch switchChecked={true} />
            <SettingsRow icon={Bell} label="Email Notifications" showSwitch switchChecked={true} />
            <SettingsRow icon={Bell} label="SMS Notifications" showSwitch switchChecked={false} />
            <Separator className="my-3" />
            <SettingsRow icon={Globe} label="Language / Region" />
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
    </div>
  );
};

export default Profile;

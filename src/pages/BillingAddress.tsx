import { useState } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import BottomNav from "@/components/BottomNav";

const BillingAddress = () => {
  const navigate = useNavigate();
  
  const [address, setAddress] = useState({
    street: "123 Main Street",
    apt: "Apt 4B",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedAddress, setEditedAddress] = useState(address);

  const handleSave = () => {
    if (!editedAddress.street.trim() || !editedAddress.city.trim() || !editedAddress.zipCode.trim()) {
      toast.error("Please fill in required fields");
      return;
    }
    setAddress(editedAddress);
    setIsEditing(false);
    toast.success("Billing address updated");
  };

  const handleCancel = () => {
    setEditedAddress(address);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Billing Address</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-muted rounded-lg">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                </div>
                <CardTitle className="text-base font-semibold">Address Details</CardTitle>
              </div>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    value={editedAddress.street}
                    onChange={(e) => setEditedAddress({ ...editedAddress, street: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apt">Apartment, Suite, etc.</Label>
                  <Input
                    id="apt"
                    value={editedAddress.apt}
                    onChange={(e) => setEditedAddress({ ...editedAddress, apt: e.target.value })}
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={editedAddress.city}
                      onChange={(e) => setEditedAddress({ ...editedAddress, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={editedAddress.state}
                      onChange={(e) => setEditedAddress({ ...editedAddress, state: e.target.value })}
                      placeholder="NY"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={editedAddress.zipCode}
                      onChange={(e) => setEditedAddress({ ...editedAddress, zipCode: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={editedAddress.country}
                      onChange={(e) => setEditedAddress({ ...editedAddress, country: e.target.value })}
                      placeholder="United States"
                    />
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleSave}>
                    Save Address
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-1 text-foreground">
                <p>{address.street}</p>
                {address.apt && <p>{address.apt}</p>}
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p className="text-muted-foreground">{address.country}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default BillingAddress;

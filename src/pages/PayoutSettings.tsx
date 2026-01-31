import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Building2, Check, CreditCard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";

interface PayoutMethod {
  id: string;
  type: "bank" | "paypal";
  name: string;
  details: string;
  isDefault: boolean;
}

const PayoutSettings = () => {
  const navigate = useNavigate();
  const [showAddForm, setShowAddForm] = useState(false);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([
    {
      id: "1",
      type: "bank",
      name: "Main Bank Account",
      details: "•••• •••• •••• 4521",
      isDefault: true,
    },
  ]);

  // Form state
  const [methodType, setMethodType] = useState<"bank" | "paypal">("bank");
  const [accountName, setAccountName] = useState("");
  const [sortCode, setSortCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");

  const handleSetDefault = (id: string) => {
    setPayoutMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    toast.success("Default payout method updated");
  };

  const handleDelete = (id: string) => {
    const method = payoutMethods.find((m) => m.id === id);
    if (method?.isDefault && payoutMethods.length > 1) {
      toast.error("Cannot delete default payout method. Set another as default first.");
      return;
    }
    setPayoutMethods((prev) => prev.filter((m) => m.id !== id));
    toast.success("Payout method removed");
  };

  const handleAddMethod = () => {
    if (methodType === "bank") {
      if (!accountName.trim() || !sortCode.trim() || !accountNumber.trim()) {
        toast.error("Please fill in all bank details");
        return;
      }
      const newMethod: PayoutMethod = {
        id: Date.now().toString(),
        type: "bank",
        name: accountName,
        details: `•••• •••• •••• ${accountNumber.slice(-4)}`,
        isDefault: payoutMethods.length === 0,
      };
      setPayoutMethods((prev) => [...prev, newMethod]);
    } else {
      if (!paypalEmail.trim()) {
        toast.error("Please enter your PayPal email");
        return;
      }
      const newMethod: PayoutMethod = {
        id: Date.now().toString(),
        type: "paypal",
        name: "PayPal",
        details: paypalEmail,
        isDefault: payoutMethods.length === 0,
      };
      setPayoutMethods((prev) => [...prev, newMethod]);
    }

    // Reset form
    setAccountName("");
    setSortCode("");
    setAccountNumber("");
    setPaypalEmail("");
    setShowAddForm(false);
    toast.success("Payout method added");
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button
            onClick={() => navigate("/lender")}
            className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Payout Settings</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Existing Payout Methods */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Payout Methods</h2>
            {!showAddForm && (
              <Button variant="outline" size="sm" onClick={() => setShowAddForm(true)}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            )}
          </div>

          {payoutMethods.length === 0 && !showAddForm ? (
            <Card className="bg-muted/30 border-dashed">
              <CardContent className="py-8 text-center">
                <CreditCard className="h-10 w-10 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground mb-4">No payout methods added yet</p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Payout Method
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {payoutMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={`bg-card border-border ${
                      method.isDefault ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            method.type === "bank"
                              ? "bg-primary/10"
                              : "bg-accent/10"
                          }`}
                        >
                          {method.type === "bank" ? (
                            <Building2 className="h-5 w-5 text-primary" />
                          ) : (
                            <CreditCard className="h-5 w-5 text-accent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{method.name}</p>
                            {method.isDefault && (
                              <span className="text-[10px] font-medium bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{method.details}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!method.isDefault && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSetDefault(method.id)}
                            >
                              Set Default
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(method.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add New Method Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold">Add Payout Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Method Type Selection */}
                <RadioGroup
                  value={methodType}
                  onValueChange={(val) => setMethodType(val as "bank" | "paypal")}
                  className="grid grid-cols-2 gap-3"
                >
                  <Label
                    htmlFor="bank"
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      methodType === "bank"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="bank" id="bank" />
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">Bank Account</span>
                  </Label>
                  <Label
                    htmlFor="paypal"
                    className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      methodType === "paypal"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <RadioGroupItem value="paypal" id="paypal" />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">PayPal</span>
                  </Label>
                </RadioGroup>

                {/* Bank Account Form */}
                {methodType === "bank" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="accountName" className="text-sm font-medium mb-2 block">
                        Account Holder Name
                      </Label>
                      <Input
                        id="accountName"
                        placeholder="John Doe"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        className="h-12"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="sortCode" className="text-sm font-medium mb-2 block">
                          Sort Code
                        </Label>
                        <Input
                          id="sortCode"
                          placeholder="00-00-00"
                          value={sortCode}
                          onChange={(e) => setSortCode(e.target.value)}
                          className="h-12"
                        />
                      </div>
                      <div>
                        <Label htmlFor="accountNumber" className="text-sm font-medium mb-2 block">
                          Account Number
                        </Label>
                        <Input
                          id="accountNumber"
                          placeholder="12345678"
                          value={accountNumber}
                          onChange={(e) => setAccountNumber(e.target.value)}
                          className="h-12"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* PayPal Form */}
                {methodType === "paypal" && (
                  <div>
                    <Label htmlFor="paypalEmail" className="text-sm font-medium mb-2 block">
                      PayPal Email
                    </Label>
                    <Input
                      id="paypalEmail"
                      type="email"
                      placeholder="your@email.com"
                      value={paypalEmail}
                      onChange={(e) => setPaypalEmail(e.target.value)}
                      className="h-12"
                    />
                  </div>
                )}

                {/* Form Actions */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1" onClick={handleAddMethod}>
                    <Check className="h-4 w-4 mr-2" />
                    Add Method
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-4">
              <h3 className="font-medium text-foreground mb-2">Payout Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Payouts are processed weekly on Mondays. Earnings must reach a minimum of £10 before
                a payout is initiated. Bank transfers typically arrive within 2-3 business days.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PayoutSettings;

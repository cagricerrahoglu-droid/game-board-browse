import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, CreditCard, Check, Truck, Package, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBasket } from "@/contexts/BasketContext";
import { useAuth } from "@/contexts/AuthContext";
import { API } from "@/services/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Step = "delivery" | "payment" | "confirmation";

const deliveryOptions = [
  { id: "home", label: "Home Delivery", description: "Delivered to your door", icon: Truck, price: 3.99 },
  { id: "pickup", label: "Pickup Point", description: "Collect from a local shop", icon: Package, price: 1.99 },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearBasket } = useBasket();
  const { user, isLoggedIn, selectedRole } = useAuth();
  const homePath = selectedRole === "lender" ? "/lender-home" : "/";
  const [currentStep, setCurrentStep] = useState<Step>("delivery");
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postcode: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const subtotal = getSubtotal();
  const deliveryFee = deliveryMethod === "home" ? 3.99 : 1.99;
  const total = subtotal + deliveryFee;

  const steps = [
    { id: "delivery", label: "Delivery" },
    { id: "payment", label: "Payment" },
    { id: "confirmation", label: "Done" },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContinue = async () => {
    if (currentStep === "delivery") {
      if (!formData.fullName || !formData.address || !formData.city || !formData.postcode) {
        toast.error("Please fill in all delivery details");
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      if (!formData.cardNumber || !formData.expiry || !formData.cvv) {
        toast.error("Please fill in all payment details");
        return;
      }

      if (!isLoggedIn || !user) {
        toast.error("You must be logged in to checkout");
        navigate("/auth");
        return;
      }

      setIsProcessing(true);
      try {
        // Mock payment processing (simulating a successful payment)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create rental records for each game in the basket
        for (const item of items) {
          // Get the catalog game ID from the item
          const catalogGameId = item.catalogGameId || item.id;
          
          // Find an available game listing that matches this catalog game
          const availabilityCheck = await API.checkGameAvailability(catalogGameId);
          
          if (!availabilityCheck.available || availabilityCheck.games.length === 0) {
            throw new Error(`${item.title || item.name} is no longer available`);
          }
          
          // Use the first available game
          const availableGame = availabilityCheck.games[0];
          
          const durationMonths = item.rentalDurationMonths || 1;
          const startDate = new Date();
          const endDate = new Date();
          endDate.setMonth(endDate.getMonth() + durationMonths);

          const rentalData = {
            renter_id: user.id,
            lender_id: availableGame.owner_id,
            game_id: availableGame.game_id,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
            deposit_amount: item.monthlyPrice * durationMonths, // Store the rental amount as deposit
            notes: `Delivery: ${deliveryMethod}, Address: ${formData.address}, ${formData.city} ${formData.postcode}`
          };

          await API.createRental(rentalData);
        }

        // Clear basket and move to confirmation
        clearBasket();
        setCurrentStep("confirmation");
        toast.success("Order confirmed! Your games are on their way.");
      } catch (error: any) {
        console.error("Checkout error:", error);
        toast.error(error.message || "Failed to process order. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h1 className="font-display text-2xl font-bold text-foreground mb-2">Your basket is empty</h1>
        <p className="text-muted-foreground mb-6">Add some games before checking out</p>
        <Button onClick={() => navigate("/browse")} className="rounded-full">
          Browse games
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => currentStep === "delivery" ? navigate("/basket") : setCurrentStep("delivery")}
            className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
            disabled={isProcessing}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="font-display text-xl font-bold text-foreground">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    currentStep === step.id
                      ? "bg-primary text-primary-foreground"
                      : steps.findIndex(s => s.id === currentStep) > index
                      ? "bg-available text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {steps.findIndex(s => s.id === currentStep) > index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span className="text-xs text-muted-foreground mt-1">{step.label}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 -mt-5",
                    steps.findIndex(s => s.id === currentStep) > index ? "bg-available" : "bg-muted"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </header>

      <main className="px-5 py-6 space-y-6">
        {/* Delivery Step */}
        {currentStep === "delivery" && (
          <>
            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Delivery Method
              </h2>
              <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod} className="space-y-3">
                {deliveryOptions.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                      deliveryMethod === option.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <RadioGroupItem value={option.id} />
                    <option.icon className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <span className="font-bold text-foreground">
                      {option.price === 0 ? "Free" : `£${option.price.toFixed(2)}`}
                    </span>
                  </label>
                ))}
              </RadioGroup>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Address
              </h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Smith"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Game Street"
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="London"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input
                      id="postcode"
                      name="postcode"
                      value={formData.postcode}
                      onChange={handleInputChange}
                      placeholder="SW1A 1AA"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <section className="space-y-4">
            <h2 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment Details
            </h2>
            <div className="space-y-3">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-xl">
              <Lock className="w-4 h-4" />
              <span>Your payment is secure and encrypted</span>
            </div>

            {/* Order Summary */}
            <div className="bg-card rounded-2xl p-4 border border-border/50 space-y-3">
              <h3 className="font-semibold text-foreground">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({items.length} games)</span>
                  <span className="text-foreground">£{subtotal.toFixed(2)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="text-foreground">£{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between font-bold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">£{total.toFixed(2)}/mo</span>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Confirmation Step */}
        {currentStep === "confirmation" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 rounded-full bg-available/20 flex items-center justify-center mb-6">
              <Check className="w-10 h-10 text-available" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-2">Order Confirmed!</h2>
            <p className="text-muted-foreground mb-6 max-w-xs">
              Your games are on their way. Get ready for game night!
            </p>
            <p className="text-sm text-muted-foreground mb-8">
              Order #SB{Math.floor(Math.random() * 100000).toString().padStart(5, "0")}
            </p>
            <Button onClick={() => navigate(homePath)} className="rounded-full" size="lg">
              Back to Home
            </Button>
          </div>
        )}
      </main>

      {/* Sticky CTA */}
      {currentStep !== "confirmation" && (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border/50 px-5 py-4">
          <Button 
            onClick={handleContinue} 
            className="w-full rounded-full font-display font-semibold" 
            size="lg"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : currentStep === "delivery" ? (
              "Continue to Payment"
            ) : (
              `Pay £${total.toFixed(2)}/mo`
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

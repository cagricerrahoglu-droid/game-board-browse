import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Camera, Check, ChevronRight, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

type Step = "details" | "condition" | "pricing";

const AddGame = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("details");
  
  // Form state
  const [gameTitle, setGameTitle] = useState("");
  const [gameDescription, setGameDescription] = useState("");
  const [condition, setCondition] = useState<"excellent" | "good" | "fair">("good");
  const [isComplete, setIsComplete] = useState(true);
  const [hasManual, setHasManual] = useState(true);
  const [rentalPrice, setRentalPrice] = useState("");
  const [sellAfterRent, setSellAfterRent] = useState(false);
  const [sellPrice, setSellPrice] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const steps: { id: Step; label: string }[] = [
    { id: "details", label: "Details" },
    { id: "condition", label: "Condition" },
    { id: "pricing", label: "Pricing" },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNext = () => {
    if (currentStep === "details") {
      if (!gameTitle.trim()) {
        toast.error("Please enter a game title");
        return;
      }
      setCurrentStep("condition");
    } else if (currentStep === "condition") {
      setCurrentStep("pricing");
    }
  };

  const handleBack = () => {
    if (currentStep === "condition") {
      setCurrentStep("details");
    } else if (currentStep === "pricing") {
      setCurrentStep("condition");
    } else {
      navigate("/lister");
    }
  };

  const handleSubmit = () => {
    if (!rentalPrice || parseFloat(rentalPrice) <= 0) {
      toast.error("Please enter a valid rental price");
      return;
    }
    if (sellAfterRent && (!sellPrice || parseFloat(sellPrice) <= 0)) {
      toast.error("Please enter a valid sell price");
      return;
    }
    
    // Here you would typically save to a database
    toast.success("Game added successfully!");
    navigate("/lister");
  };

  const handleAddImage = () => {
    // Simulate adding an image
    const placeholderImages = [
      "https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=400",
      "https://images.unsplash.com/photo-1606503153255-59d7749fdc85?w=400",
      "https://images.unsplash.com/photo-1632501641765-e568d28b0015?w=400",
    ];
    if (images.length < 4) {
      setImages([...images, placeholderImages[images.length % placeholderImages.length]]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center gap-4 px-4 py-4">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </button>
          <h1 className="text-xl font-semibold text-foreground">Add a Game</h1>
        </div>

        {/* Progress Steps */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      index <= currentStepIndex
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStepIndex ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 transition-colors ${
                      index < currentStepIndex ? "bg-primary" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Details */}
          {currentStep === "details" && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Image Upload */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Photos</Label>
                <div className="grid grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                      <img src={img} alt={`Game photo ${index + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {images.length < 4 && (
                    <button
                      onClick={handleAddImage}
                      className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
                    >
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">Add</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Add up to 4 photos of your game</p>
              </div>

              {/* Game Title */}
              <div>
                <Label htmlFor="title" className="text-sm font-medium mb-2 block">Game Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Catan, Ticket to Ride"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  className="h-12"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium mb-2 block">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Any details renters should know..."
                  value={gameDescription}
                  onChange={(e) => setGameDescription(e.target.value)}
                  className="min-h-24 resize-none"
                />
              </div>

              <Button onClick={handleNext} className="w-full h-12" size="lg">
                Continue
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 2: Condition */}
          {currentStep === "condition" && (
            <motion.div
              key="condition"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Condition Selection */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Game Condition</Label>
                <RadioGroup value={condition} onValueChange={(val) => setCondition(val as typeof condition)} className="space-y-3">
                  <Card className={`cursor-pointer transition-all ${condition === "excellent" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <RadioGroupItem value="excellent" id="excellent" />
                      <div className="flex-1">
                        <Label htmlFor="excellent" className="font-medium cursor-pointer">Excellent</Label>
                        <p className="text-xs text-muted-foreground">Like new, minimal signs of use</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-all ${condition === "good" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <RadioGroupItem value="good" id="good" />
                      <div className="flex-1">
                        <Label htmlFor="good" className="font-medium cursor-pointer">Good</Label>
                        <p className="text-xs text-muted-foreground">Normal wear, fully playable</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className={`cursor-pointer transition-all ${condition === "fair" ? "ring-2 ring-primary" : ""}`}>
                    <CardContent className="p-4 flex items-center gap-3">
                      <RadioGroupItem value="fair" id="fair" />
                      <div className="flex-1">
                        <Label htmlFor="fair" className="font-medium cursor-pointer">Fair</Label>
                        <p className="text-xs text-muted-foreground">Visible wear, still playable</p>
                      </div>
                    </CardContent>
                  </Card>
                </RadioGroup>
              </div>

              {/* Completeness */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">All pieces included</p>
                    <p className="text-xs text-muted-foreground">Game is complete with no missing parts</p>
                  </div>
                  <Switch checked={isComplete} onCheckedChange={setIsComplete} />
                </div>

                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                  <div>
                    <p className="font-medium text-foreground">Manual included</p>
                    <p className="text-xs text-muted-foreground">Original instruction manual</p>
                  </div>
                  <Switch checked={hasManual} onCheckedChange={setHasManual} />
                </div>
              </div>

              <Button onClick={handleNext} className="w-full h-12" size="lg">
                Continue
                <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            </motion.div>
          )}

          {/* Step 3: Pricing */}
          {currentStep === "pricing" && (
            <motion.div
              key="pricing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Rental Price */}
              <div>
                <Label htmlFor="rentalPrice" className="text-sm font-medium mb-2 block">Monthly Rental Price</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
                  <Input
                    id="rentalPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={rentalPrice}
                    onChange={(e) => setRentalPrice(e.target.value)}
                    className="h-12 pl-8"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">/month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Suggested: £3-8/month based on game popularity</p>
              </div>

              {/* Sell After Rent Option */}
              <div className="p-4 bg-muted/30 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Open to sell after rent</p>
                    <p className="text-xs text-muted-foreground">Let renters buy this game</p>
                  </div>
                  <Switch checked={sellAfterRent} onCheckedChange={setSellAfterRent} />
                </div>

                {sellAfterRent && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Label htmlFor="sellPrice" className="text-sm font-medium mb-2 block">Sell Price</Label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">£</span>
                      <Input
                        id="sellPrice"
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={sellPrice}
                        onChange={(e) => setSellPrice(e.target.value)}
                        className="h-12 pl-8"
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Summary */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Game</span>
                      <span className="font-medium text-foreground">{gameTitle || "—"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Condition</span>
                      <span className="font-medium text-foreground capitalize">{condition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Monthly Rental</span>
                      <span className="font-medium text-foreground">
                        {rentalPrice ? `£${parseFloat(rentalPrice).toFixed(2)}` : "—"}
                      </span>
                    </div>
                    {sellAfterRent && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Sell Price</span>
                        <span className="font-medium text-foreground">
                          {sellPrice ? `£${parseFloat(sellPrice).toFixed(2)}` : "—"}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Button onClick={handleSubmit} className="w-full h-12" size="lg">
                Add Game
                <Check className="h-5 w-5 ml-1" />
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AddGame;

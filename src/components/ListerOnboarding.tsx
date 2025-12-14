import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, DollarSign, Heart, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ListerOnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

const onboardingSteps = [
  {
    icon: Shield,
    title: "Your games are protected",
    description: "Every rental includes damage protection. If something happens to your game, we've got you covered.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: DollarSign,
    title: "Earn from your collection",
    description: "Set your games available and earn money when they're rented. We handle payments automatically.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Heart,
    title: "Renters can buy games they love",
    description: "Enable sell-after-rent and let renters purchase your games if they fall in love with them.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
];

const ListerOnboarding = ({ onComplete, onSkip }: ListerOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = onboardingSteps[currentStep];
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
    >
      {/* Skip button */}
      <div className="flex justify-end p-4">
        <button
          onClick={onSkip}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="text-sm">Skip</span>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            <div className={`w-24 h-24 rounded-full ${step.bgColor} flex items-center justify-center mb-8`}>
              <Icon className={`h-12 w-12 ${step.color}`} />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">{step.title}</h2>
            <p className="text-muted-foreground text-lg max-w-sm">{step.description}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {onboardingSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>

      {/* Actions */}
      <div className="px-6 pb-8">
        <Button onClick={handleNext} className="w-full h-14 text-lg font-semibold rounded-2xl" size="lg">
          {currentStep === onboardingSteps.length - 1 ? (
            "List your first game"
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default ListerOnboarding;

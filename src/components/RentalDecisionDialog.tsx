import { useState } from "react";
import { RotateCcw, Calendar, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ActiveRental } from "@/types/rental";

interface RentalDecisionDialogProps {
  rental: ActiveRental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDecision: (rental: ActiveRental, decision: "extend" | "return" | "purchase") => void;
}

const decisions = [
  {
    id: "extend" as const,
    icon: Calendar,
    title: "Extend rental",
    description: "Keep playing for another 30 days",
    color: "bg-primary/10 text-primary",
  },
  {
    id: "return" as const,
    icon: RotateCcw,
    title: "Return game",
    description: "Ship it back to the owner",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  },
  {
    id: "purchase" as const,
    icon: ShoppingCart,
    title: "Buy this game",
    description: "Make it yours forever",
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
];

const RentalDecisionDialog = ({
  rental,
  open,
  onOpenChange,
  onDecision,
}: RentalDecisionDialogProps) => {
  const [selectedDecision, setSelectedDecision] = useState<"extend" | "return" | "purchase" | null>(null);

  const handleConfirm = () => {
    if (rental && selectedDecision) {
      onDecision(rental, selectedDecision);
      setSelectedDecision(null);
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setSelectedDecision(null);
    onOpenChange(false);
  };

  if (!rental) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <img
              src={rental.gameCover}
              alt={rental.gameTitle}
              className="w-10 h-12 rounded-lg object-cover"
            />
            <span>What's next for {rental.gameTitle}?</span>
          </DialogTitle>
          <DialogDescription>
            Your rental period is ending soon. Choose how you'd like to proceed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {decisions.map((decision) => {
            const Icon = decision.icon;
            const isSelected = selectedDecision === decision.id;

            return (
              <button
                key={decision.id}
                onClick={() => setSelectedDecision(decision.id)}
                className={cn(
                  "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className={cn("p-3 rounded-xl", decision.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{decision.title}</p>
                  <p className="text-xs text-muted-foreground">{decision.description}</p>
                </div>
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 transition-all",
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-muted-foreground/30"
                  )}
                >
                  {isSelected && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedDecision}
            className="flex-1"
          >
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalDecisionDialog;

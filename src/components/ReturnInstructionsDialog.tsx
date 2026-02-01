import { Package, MapPin, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ActiveRental } from "@/types/rental";
import { format } from "date-fns";

interface ReturnInstructionsDialogProps {
  rental: ActiveRental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkShipped: () => void;
}

const ReturnInstructionsDialog = ({
  rental,
  open,
  onOpenChange,
  onMarkShipped,
}: ReturnInstructionsDialogProps) => {
  if (!rental) return null;

  const steps = [
    {
      icon: Package,
      title: "Pack the game carefully",
      description: "Use the original packaging if possible. Include all components, cards, and pieces.",
    },
    {
      icon: MapPin,
      title: "Ship to the lender",
      description: `Send the package to ${rental.counterparty.name}'s address. Use tracked shipping for protection.`,
    },
    {
      icon: Clock,
      title: "Mark as shipped",
      description: "Once shipped, mark the return as sent so the lender knows to expect it.",
    },
    {
      icon: CheckCircle2,
      title: "Wait for confirmation",
      description: "The lender will confirm receipt and your rental will be complete.",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Return Instructions
          </DialogTitle>
          <DialogDescription>
            Follow these steps to return "{rental.gameTitle}"
          </DialogDescription>
        </DialogHeader>

        {/* Game and lender info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <img
            src={rental.gameCover}
            alt={rental.gameTitle}
            className="w-12 h-16 rounded-md object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-sm">{rental.gameTitle}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Avatar className="w-5 h-5">
                <AvatarImage src={rental.counterparty.avatar} />
                <AvatarFallback className="text-[10px]">
                  {rental.counterparty.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                Return to {rental.counterparty.name}
              </span>
            </div>
          </div>
        </div>

        {/* Deadline warning if applicable */}
        {rental.actionDeadline && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Return by {format(rental.actionDeadline, "MMM d, yyyy")}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Please ship promptly to avoid late fees
              </p>
            </div>
          </div>
        )}

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <step.icon className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button className="flex-1" onClick={onMarkShipped}>
            <Package className="w-4 h-4 mr-2" />
            Mark as Shipped
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnInstructionsDialog;

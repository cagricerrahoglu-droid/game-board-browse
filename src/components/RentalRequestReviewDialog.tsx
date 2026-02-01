import { Clock, User, MapPin, Star, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ActiveRental } from "@/types/rental";

interface RentalRequestReviewDialogProps {
  rental: ActiveRental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
}

const RentalRequestReviewDialog = ({
  rental,
  open,
  onOpenChange,
  onAccept,
  onReject,
}: RentalRequestReviewDialogProps) => {
  if (!rental) return null;

  const handleAccept = () => {
    onAccept();
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Rental Request
          </DialogTitle>
          <DialogDescription>
            Review this rental request for "{rental.gameTitle}"
          </DialogDescription>
        </DialogHeader>

        {/* Renter info */}
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <Avatar className="w-12 h-12">
            <AvatarImage src={rental.counterparty.avatar} />
            <AvatarFallback className="text-lg">
              {rental.counterparty.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold">{rental.counterparty.name}</p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.8</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span>2.3 km away</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game info */}
        <div className="flex items-center gap-3 p-3 border rounded-lg">
          <img
            src={rental.gameCover}
            alt={rental.gameTitle}
            className="w-12 h-16 rounded-md object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-sm">{rental.gameTitle}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              30-day rental • £{rental.monthlyPrice.toFixed(2)}/month
            </p>
          </div>
        </div>

        {/* Deadline warning */}
        {rental.actionDeadline && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-400">
              Respond within{" "}
              <span className="font-medium">
                {formatDistanceToNow(rental.actionDeadline)}
              </span>{" "}
              or request will be forwarded
            </p>
          </div>
        )}

        {/* Info notice */}
        <p className="text-xs text-muted-foreground text-center">
          If you accept, you'll receive packing and shipping instructions.
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReject}
            className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
          <Button onClick={handleAccept} className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RentalRequestReviewDialog;

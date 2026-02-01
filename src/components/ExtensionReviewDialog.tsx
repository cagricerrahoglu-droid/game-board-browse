import { Clock, Calendar, Check, X } from "lucide-react";
import { formatDistanceToNow, addDays, format } from "date-fns";
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

interface ExtensionReviewDialogProps {
  rental: ActiveRental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onReject: () => void;
}

const ExtensionReviewDialog = ({
  rental,
  open,
  onOpenChange,
  onAccept,
  onReject,
}: ExtensionReviewDialogProps) => {
  if (!rental) return null;

  const newEndDate = addDays(rental.endDate, 30);

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
            <Calendar className="w-5 h-5 text-primary" />
            Extension Request
          </DialogTitle>
          <DialogDescription>
            {rental.counterparty.name} wants to extend their rental
          </DialogDescription>
        </DialogHeader>

        {/* Renter and game info */}
        <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
          <Avatar className="w-10 h-10">
            <AvatarImage src={rental.counterparty.avatar} />
            <AvatarFallback>
              {rental.counterparty.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm">{rental.counterparty.name}</p>
            <p className="text-xs text-muted-foreground">
              Requesting extension for {rental.gameTitle}
            </p>
          </div>
        </div>

        {/* Extension details */}
        <div className="space-y-3 p-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Current end date</span>
            <span className="text-sm font-medium">{format(rental.endDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Extension period</span>
            <span className="text-sm font-medium">+30 days</span>
          </div>
          <div className="border-t pt-3 flex justify-between items-center">
            <span className="text-sm font-medium">New end date</span>
            <span className="text-sm font-semibold text-primary">{format(newEndDate, "MMM d, yyyy")}</span>
          </div>
        </div>

        {/* Earnings info */}
        <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg">
          <span className="text-sm text-emerald-700 dark:text-emerald-400">Additional earnings</span>
          <span className="font-semibold text-emerald-700 dark:text-emerald-400">
            £{rental.monthlyPrice.toFixed(2)}
          </span>
        </div>

        {/* Deadline warning */}
        {rental.actionDeadline && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Please respond within{" "}
              <span className="font-medium">
                {formatDistanceToNow(rental.actionDeadline)}
              </span>
            </span>
          </div>
        )}

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
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExtensionReviewDialog;

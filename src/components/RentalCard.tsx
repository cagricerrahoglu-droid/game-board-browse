import { formatDistanceToNow } from "date-fns";
import { Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  ActiveRental, 
  stateMetadata, 
  getCTAForRental,
  isUrgent 
} from "@/types/rental";

interface RentalCardProps {
  rental: ActiveRental;
  onAction?: (rental: ActiveRental, action: string) => void;
  isHighlighted?: boolean;
}

const RentalCard = ({ rental, onAction, isHighlighted }: RentalCardProps) => {
  const stateMeta = stateMetadata[rental.state];
  const cta = getCTAForRental(rental);
  const urgent = isUrgent(rental);

  const getStatusVariantClasses = () => {
    switch (stateMeta.variant) {
      case "warning":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "urgent":
        return "bg-destructive/10 text-destructive";
      case "success":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
      case "info":
        return "bg-primary/10 text-primary";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getRoleBadgeClasses = () => {
    return rental.role === "renter"
      ? "bg-primary/10 text-primary border-primary/20"
      : "bg-secondary text-secondary-foreground border-secondary";
  };

  const handleCTAClick = () => {
    if (cta && onAction) {
      onAction(rental, cta.action);
    }
  };

  const handleViewDetails = () => {
    if (onAction) {
      onAction(rental, "view_details");
    }
  };

  return (
    <div
      className={cn(
        "relative rounded-xl border bg-card p-4 transition-all duration-300",
        isHighlighted && "ring-2 ring-primary ring-offset-2 animate-pulse",
        urgent && rental.requiresAction && "border-destructive/50 bg-destructive/5"
      )}
    >
      {/* Urgency indicator */}
      {urgent && rental.requiresAction && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse" />
      )}

      <div className="flex gap-3">
        {/* Game cover */}
        <div className="relative flex-shrink-0">
          <img
            src={rental.gameCover}
            alt={rental.gameTitle}
            className="w-16 h-20 rounded-lg object-cover shadow-sm"
          />
          {/* Role badge overlay */}
          <Badge
            variant="outline"
            className={cn(
              "absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0 border",
              getRoleBadgeClasses()
            )}
          >
            {rental.role === "renter" ? "Renting" : "Lending"}
          </Badge>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate">{rental.gameTitle}</h4>
            <Badge className={cn("text-[10px] px-1.5 py-0 shrink-0", getStatusVariantClasses())}>
              {stateMeta.label}
            </Badge>
          </div>

          {/* Counterparty */}
          <div className="flex items-center gap-1.5 mb-2">
            <Avatar className="w-5 h-5">
              <AvatarImage src={rental.counterparty.avatar} alt={rental.counterparty.name} />
              <AvatarFallback className="text-[10px]">
                {rental.counterparty.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground">
              {rental.role === "renter" ? "From" : "To"} {rental.counterparty.name}
            </span>
          </div>

          {/* Deadline indicator */}
          {rental.actionDeadline && rental.requiresAction && (
            <div className={cn(
              "flex items-center gap-1 text-xs mb-2",
              urgent ? "text-destructive font-medium" : "text-muted-foreground"
            )}>
              <Clock className="w-3 h-3" />
              <span>
                {urgent ? "Due " : ""}
                {formatDistanceToNow(rental.actionDeadline, { addSuffix: true })}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            {cta && (
              <Button
                size="sm"
                variant={cta.variant || "default"}
                className="h-7 text-xs px-3"
                onClick={handleCTAClick}
              >
                {cta.label}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs px-2 text-muted-foreground"
              onClick={handleViewDetails}
            >
              Details
              <ChevronRight className="w-3 h-3 ml-0.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;

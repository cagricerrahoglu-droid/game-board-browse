import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, AlertCircle, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import RentalCard from "@/components/RentalCard";
import { 
  ActiveRental, 
  sortByPriority 
} from "@/types/rental";
import { 
  getRentalsByRole, 
  countActionRequired, 
  hasUrgentRentals 
} from "@/utils/rentalHelpers";

interface ActiveRentalTrayProps {
  rentals: ActiveRental[];
  onRentalAction?: (rental: ActiveRental, action: string) => void;
  highlightedRentalId?: string;
  isLoading?: boolean;
}

const ActiveRentalTray = ({ 
  rentals, 
  onRentalAction,
  highlightedRentalId,
  isLoading = false
}: ActiveRentalTrayProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Filter out completed rentals and group by role
  const activeRentals = rentals.filter(r => r.state !== "completed");
  const renterRentals = useMemo(
    () => sortByPriority(getRentalsByRole(activeRentals, "renter")),
    [activeRentals]
  );
  const lenderRentals = useMemo(
    () => sortByPriority(getRentalsByRole(activeRentals, "lender")),
    [activeRentals]
  );

  const totalActive = activeRentals.length;
  const actionCount = countActionRequired(activeRentals);
  const hasUrgent = hasUrgentRentals(activeRentals);

  // Don't render if loading or no active rentals
  if (isLoading || totalActive === 0) {
    return null;
  }

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        {/* Collapsed Header */}
        <CollapsibleTrigger asChild>
          <button 
            className={cn(
              "w-full px-5 py-3 flex items-center justify-between",
              "hover:bg-muted/50 transition-colors",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl",
                hasUrgent ? "bg-destructive/10" : "bg-primary/10"
              )}>
                <Package className={cn(
                  "w-5 h-5",
                  hasUrgent ? "text-destructive" : "text-primary"
                )} />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">Active rentals</span>
                <Badge 
                  variant="secondary" 
                  className="h-5 px-2 text-xs font-medium"
                >
                  {totalActive}
                </Badge>
              </div>

              {/* Urgency indicator */}
              {actionCount > 0 && (
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
                  hasUrgent 
                    ? "bg-destructive/10 text-destructive" 
                    : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                )}>
                  <AlertCircle className="w-3 h-3" />
                  <span>
                    {actionCount} {actionCount === 1 ? "action" : "actions"} needed
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Preview avatars when collapsed */}
              {!isOpen && (
                <div className="flex -space-x-2 mr-2">
                  {activeRentals.slice(0, 3).map((rental, idx) => (
                    <div
                      key={rental.id}
                      className="w-6 h-6 rounded-full border-2 border-background overflow-hidden"
                      style={{ zIndex: 3 - idx }}
                    >
                      <img
                        src={rental.gameCover}
                        alt={rental.gameTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                  {totalActive > 3 && (
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-medium text-muted-foreground"
                    >
                      +{totalActive - 3}
                    </div>
                  )}
                </div>
              )}
              
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
          </button>
        </CollapsibleTrigger>

        {/* Expanded Content */}
        <CollapsibleContent>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="px-5 pb-4"
              >
                <div className="space-y-4">
                  {/* Games you're renting section */}
                  {renterRentals.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Games you're renting
                      </h3>
                      <div className="space-y-3">
                        {renterRentals.map((rental) => (
                          <RentalCard
                            key={rental.id}
                            rental={rental}
                            onAction={onRentalAction}
                            isHighlighted={rental.id === highlightedRentalId}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Games you're lending section */}
                  {lenderRentals.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Games you're lending
                      </h3>
                      <div className="space-y-3">
                        {lenderRentals.map((rental) => (
                          <RentalCard
                            key={rental.id}
                            rental={rental}
                            onAction={onRentalAction}
                            isHighlighted={rental.id === highlightedRentalId}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default ActiveRentalTray;

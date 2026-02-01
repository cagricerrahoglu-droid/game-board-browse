import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ActiveRental, RentalState } from "@/types/rental";
import { mockRentals as initialMockRentals } from "@/data/mockRentals";
import { useToast } from "@/hooks/use-toast";
import RentalDecisionDialog from "@/components/RentalDecisionDialog";

interface RentalContextType {
  rentals: ActiveRental[];
  updateRentalState: (rentalId: string, newState: RentalState, updates?: Partial<ActiveRental>) => void;
  handleRentalAction: (rental: ActiveRental, action: string) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<ActiveRental[]>(initialMockRentals);
  const [decisionRental, setDecisionRental] = useState<ActiveRental | null>(null);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  const { toast } = useToast();

  const updateRentalState = useCallback((
    rentalId: string, 
    newState: RentalState, 
    updates?: Partial<ActiveRental>
  ) => {
    setRentals(prev => prev.map(rental => 
      rental.id === rentalId 
        ? { 
            ...rental, 
            state: newState,
            requiresAction: false,
            actionDeadline: undefined,
            ...updates 
          } 
        : rental
    ));
  }, []);

  const handleDecision = useCallback((rental: ActiveRental, decision: "extend" | "return" | "purchase") => {
    switch (decision) {
      case "extend":
        updateRentalState(rental.id, "extension_pending", {
          phase: "play",
          requiresAction: false,
        });
        toast({
          title: "Extension requested! 📅",
          description: `Waiting for ${rental.counterparty.name} to approve your extension for "${rental.gameTitle}"`,
        });
        break;

      case "return":
        updateRentalState(rental.id, "return_pending", {
          phase: "return",
          requiresAction: true,
        });
        toast({
          title: "Return initiated 📦",
          description: `Please ship "${rental.gameTitle}" back to ${rental.counterparty.name}`,
        });
        break;

      case "purchase":
        updateRentalState(rental.id, "purchase_pending", {
          phase: "play",
          requiresAction: false,
        });
        toast({
          title: "Purchase requested! 🎉",
          description: `Processing your purchase of "${rental.gameTitle}"`,
        });
        break;
    }
  }, [updateRentalState, toast]);

  const handleRentalAction = useCallback((rental: ActiveRental, action: string) => {
    switch (action) {
      case "confirm_receipt":
        updateRentalState(rental.id, "active_play", {
          phase: "play",
          requiresAction: false,
        });
        toast({
          title: "Receipt confirmed! 🎉",
          description: `You've confirmed receiving "${rental.gameTitle}". Enjoy your game!`,
        });
        break;

      case "make_decision":
        setDecisionRental(rental);
        setIsDecisionDialogOpen(true);
        break;

      case "review_request":
        toast({
          title: "Review rental request",
          description: `${rental.counterparty.name} wants to rent "${rental.gameTitle}"`,
        });
        break;

      case "mark_shipped":
        updateRentalState(rental.id, "in_transit_to_renter", {
          phase: "receive",
          requiresAction: false,
        });
        toast({
          title: "Marked as shipped! 📦",
          description: `"${rental.gameTitle}" is now in transit to ${rental.counterparty.name}`,
        });
        break;

      case "review_extension":
        toast({
          title: "Extension request",
          description: `${rental.counterparty.name} wants to extend their rental of "${rental.gameTitle}"`,
        });
        break;

      case "contact_support":
        toast({
          title: "Contact Support",
          description: "Opening support chat...",
        });
        break;

      case "view_details":
        toast({
          title: rental.gameTitle,
          description: `${rental.role === "renter" ? "Renting from" : "Lending to"} ${rental.counterparty.name}`,
        });
        break;

      case "track_shipment":
      case "track_return":
        toast({
          title: "Tracking",
          description: `Tracking information for "${rental.gameTitle}"`,
        });
        break;

      case "view_return":
        toast({
          title: "Return instructions",
          description: `View how to return "${rental.gameTitle}" to ${rental.counterparty.name}`,
        });
        break;

      case "rate_renter":
        toast({
          title: "Rate your experience",
          description: `How was your experience with ${rental.counterparty.name}?`,
        });
        break;

      default:
        toast({
          title: `Action: ${action}`,
          description: `Processing "${action}" for ${rental.gameTitle}`,
        });
    }
  }, [updateRentalState, toast]);

  return (
    <RentalContext.Provider value={{ rentals, updateRentalState, handleRentalAction }}>
      {children}
      <RentalDecisionDialog
        rental={decisionRental}
        open={isDecisionDialogOpen}
        onOpenChange={setIsDecisionDialogOpen}
        onDecision={handleDecision}
      />
    </RentalContext.Provider>
  );
}

export function useRentals() {
  const context = useContext(RentalContext);
  if (context === undefined) {
    throw new Error("useRentals must be used within a RentalProvider");
  }
  return context;
}

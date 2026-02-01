// Rental context provider - manages rental state and actions
import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ActiveRental, RentalState } from "@/types/rental";
import { mockRentals as initialMockRentals } from "@/data/mockRentals";
import { useToast } from "@/hooks/use-toast";
import { useRentalDialogs } from "@/hooks/useRentalDialogs";
import { useRentalActions } from "@/hooks/useRentalActions";
import { RentalDialogManager } from "@/components/RentalDialogManager";

interface RentalContextType {
  rentals: ActiveRental[];
  updateRentalState: (rentalId: string, newState: RentalState, updates?: Partial<ActiveRental>) => void;
  handleRentalAction: (rental: ActiveRental, action: string) => void;
  removeRental: (rentalId: string) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<ActiveRental[]>(initialMockRentals);
  const { toast } = useToast();
  
  // Use extracted dialog state management
  const dialogs = useRentalDialogs();

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

  const removeRental = useCallback((rentalId: string) => {
    setRentals(prev => prev.filter(rental => rental.id !== rentalId));
  }, []);

  // Use extracted action handlers
  const actions = useRentalActions({ updateRentalState });

  const handleRentalAction = useCallback((rental: ActiveRental, action: string) => {
    switch (action) {
      case "confirm_receipt":
        dialogs.openReceiptDialog(rental);
        break;

      case "make_decision":
        dialogs.openDecisionDialog(rental);
        break;

      case "review_request":
        dialogs.openRequestDialog(rental);
        break;

      case "mark_shipped":
        actions.handleMarkShipped(rental);
        break;

      case "review_extension":
        dialogs.openExtensionDialog(rental);
        break;

      case "confirm_return_received":
        actions.handleConfirmReturnReceived(rental);
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
        dialogs.openReturnDialog(rental);
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
  }, [dialogs, actions, toast]);

  return (
    <RentalContext.Provider value={{ rentals, updateRentalState, handleRentalAction, removeRental }}>
      {children}
      
      <RentalDialogManager
        dialogs={dialogs}
        onDecision={actions.handleDecision}
        onConfirmReceipt={actions.handleConfirmReceipt}
        onReportIssue={actions.handleReportIssue}
        onReturnShipped={actions.handleReturnShipped}
        onAcceptRequest={actions.handleAcceptRequest}
        onRejectRequest={actions.handleRejectRequest}
        onAcceptExtension={actions.handleAcceptExtension}
        onRejectExtension={actions.handleRejectExtension}
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

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ActiveRental, RentalState } from "@/types/rental";
import { mockRentals as initialMockRentals } from "@/data/mockRentals";
import { useToast } from "@/hooks/use-toast";
import RentalDecisionDialog from "@/components/RentalDecisionDialog";
import ReturnInstructionsDialog from "@/components/ReturnInstructionsDialog";
import ReceiptConfirmationDialog from "@/components/ReceiptConfirmationDialog";
import RentalRequestReviewDialog from "@/components/RentalRequestReviewDialog";
import ExtensionReviewDialog from "@/components/ExtensionReviewDialog";

interface RentalContextType {
  rentals: ActiveRental[];
  updateRentalState: (rentalId: string, newState: RentalState, updates?: Partial<ActiveRental>) => void;
  handleRentalAction: (rental: ActiveRental, action: string) => void;
  removeRental: (rentalId: string) => void;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<ActiveRental[]>(initialMockRentals);
  
  // Dialog states
  const [decisionRental, setDecisionRental] = useState<ActiveRental | null>(null);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  
  const [returnRental, setReturnRental] = useState<ActiveRental | null>(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  
  const [receiptRental, setReceiptRental] = useState<ActiveRental | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  
  const [requestRental, setRequestRental] = useState<ActiveRental | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  const [extensionRental, setExtensionRental] = useState<ActiveRental | null>(null);
  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);
  
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

  const removeRental = useCallback((rentalId: string) => {
    setRentals(prev => prev.filter(rental => rental.id !== rentalId));
  }, []);

  // Decision dialog handler
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

  // Receipt confirmation handler
  const handleConfirmReceipt = useCallback(() => {
    if (!receiptRental) return;
    updateRentalState(receiptRental.id, "active_play", {
      phase: "play",
      requiresAction: false,
    });
    setIsReceiptDialogOpen(false);
    toast({
      title: "Receipt confirmed! 🎉",
      description: `You've confirmed receiving "${receiptRental.gameTitle}". Enjoy your game!`,
    });
  }, [receiptRental, updateRentalState, toast]);

  // Issue reporting handler
  const handleReportIssue = useCallback((issue: string) => {
    if (!receiptRental) return;
    updateRentalState(receiptRental.id, "issue_reported_review", {
      phase: "receive",
      requiresAction: false,
    });
    setIsReceiptDialogOpen(false);
    toast({
      title: "Issue reported",
      description: `We're reviewing your report for "${receiptRental.gameTitle}". We'll be in touch soon.`,
    });
  }, [receiptRental, updateRentalState, toast]);

  // Return shipped handler
  const handleReturnShipped = useCallback(() => {
    if (!returnRental) return;
    updateRentalState(returnRental.id, "in_transit_to_lender", {
      phase: "return",
      requiresAction: false,
    });
    setIsReturnDialogOpen(false);
    toast({
      title: "Marked as shipped! 📦",
      description: `"${returnRental.gameTitle}" is on its way back to ${returnRental.counterparty.name}`,
    });
  }, [returnRental, updateRentalState, toast]);

  // Rental request handlers
  const handleAcceptRequest = useCallback(() => {
    if (!requestRental) return;
    updateRentalState(requestRental.id, "accepted_awaiting_shipment", {
      phase: "rent",
      requiresAction: true,
    });
    toast({
      title: "Request accepted! ✅",
      description: `You've accepted the rental request. Please pack and ship "${requestRental.gameTitle}" to ${requestRental.counterparty.name}.`,
    });
  }, [requestRental, updateRentalState, toast]);

  const handleRejectRequest = useCallback(() => {
    if (!requestRental) return;
    updateRentalState(requestRental.id, "rejected_or_expired", {
      phase: "rent",
      requiresAction: false,
    });
    toast({
      title: "Request declined",
      description: `You've declined the rental request for "${requestRental.gameTitle}". The request will be forwarded to another lender.`,
    });
  }, [requestRental, updateRentalState, toast]);

  // Extension handlers
  const handleAcceptExtension = useCallback(() => {
    if (!extensionRental) return;
    const newEndDate = new Date(extensionRental.endDate);
    newEndDate.setDate(newEndDate.getDate() + 30);
    
    updateRentalState(extensionRental.id, "active_play", {
      phase: "play",
      requiresAction: false,
      endDate: newEndDate,
    });
    toast({
      title: "Extension approved! 📅",
      description: `You've extended the rental of "${extensionRental.gameTitle}" for another 30 days.`,
    });
  }, [extensionRental, updateRentalState, toast]);

  const handleRejectExtension = useCallback(() => {
    if (!extensionRental) return;
    updateRentalState(extensionRental.id, "return_pending", {
      phase: "return",
      requiresAction: true,
    });
    toast({
      title: "Extension declined",
      description: `The renter will need to return "${extensionRental.gameTitle}" by the original end date.`,
    });
  }, [extensionRental, updateRentalState, toast]);

  // Mark as shipped (lender shipping to renter)
  const handleMarkShipped = useCallback((rental: ActiveRental) => {
    updateRentalState(rental.id, "in_transit_to_renter", {
      phase: "receive",
      requiresAction: false,
    });
    toast({
      title: "Marked as shipped! 📦",
      description: `"${rental.gameTitle}" is now in transit to ${rental.counterparty.name}`,
    });
  }, [updateRentalState, toast]);

  // Lender confirms return received
  const handleConfirmReturnReceived = useCallback((rental: ActiveRental) => {
    updateRentalState(rental.id, "completed", {
      phase: "return",
      requiresAction: false,
    });
    toast({
      title: "Return confirmed! 🎉",
      description: `"${rental.gameTitle}" rental is now complete. Don't forget to rate your renter!`,
    });
  }, [updateRentalState, toast]);

  const handleRentalAction = useCallback((rental: ActiveRental, action: string) => {
    switch (action) {
      case "confirm_receipt":
        setReceiptRental(rental);
        setIsReceiptDialogOpen(true);
        break;

      case "make_decision":
        setDecisionRental(rental);
        setIsDecisionDialogOpen(true);
        break;

      case "review_request":
        setRequestRental(rental);
        setIsRequestDialogOpen(true);
        break;

      case "mark_shipped":
        handleMarkShipped(rental);
        break;

      case "review_extension":
        setExtensionRental(rental);
        setIsExtensionDialogOpen(true);
        break;

      case "confirm_return_received":
        handleConfirmReturnReceived(rental);
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
        setReturnRental(rental);
        setIsReturnDialogOpen(true);
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
  }, [handleMarkShipped, handleConfirmReturnReceived, toast]);

  return (
    <RentalContext.Provider value={{ rentals, updateRentalState, handleRentalAction, removeRental }}>
      {children}
      
      <RentalDecisionDialog
        rental={decisionRental}
        open={isDecisionDialogOpen}
        onOpenChange={setIsDecisionDialogOpen}
        onDecision={handleDecision}
      />
      
      <ReturnInstructionsDialog
        rental={returnRental}
        open={isReturnDialogOpen}
        onOpenChange={setIsReturnDialogOpen}
        onMarkShipped={handleReturnShipped}
      />
      
      <ReceiptConfirmationDialog
        rental={receiptRental}
        open={isReceiptDialogOpen}
        onOpenChange={setIsReceiptDialogOpen}
        onConfirmReceipt={handleConfirmReceipt}
        onReportIssue={handleReportIssue}
      />
      
      <RentalRequestReviewDialog
        rental={requestRental}
        open={isRequestDialogOpen}
        onOpenChange={setIsRequestDialogOpen}
        onAccept={handleAcceptRequest}
        onReject={handleRejectRequest}
      />
      
      <ExtensionReviewDialog
        rental={extensionRental}
        open={isExtensionDialogOpen}
        onOpenChange={setIsExtensionDialogOpen}
        onAccept={handleAcceptExtension}
        onReject={handleRejectExtension}
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

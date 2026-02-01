import { useCallback } from "react";
import { ActiveRental, RentalState } from "@/types/rental";
import { useToast } from "@/hooks/use-toast";

type UpdateRentalState = (
  rentalId: string, 
  newState: RentalState, 
  updates?: Partial<ActiveRental>
) => void;

export interface UseRentalActionsParams {
  updateRentalState: UpdateRentalState;
}

export function useRentalActions({ updateRentalState }: UseRentalActionsParams) {
  const { toast } = useToast();

  // Decision dialog handler
  const handleDecision = useCallback((
    rental: ActiveRental, 
    decision: "extend" | "return" | "purchase"
  ) => {
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
  const handleConfirmReceipt = useCallback((rental: ActiveRental) => {
    updateRentalState(rental.id, "active_play", {
      phase: "play",
      requiresAction: false,
    });
    toast({
      title: "Receipt confirmed! 🎉",
      description: `You've confirmed receiving "${rental.gameTitle}". Enjoy your game!`,
    });
  }, [updateRentalState, toast]);

  // Issue reporting handler
  const handleReportIssue = useCallback((rental: ActiveRental, _issue: string) => {
    updateRentalState(rental.id, "issue_reported_review", {
      phase: "receive",
      requiresAction: false,
    });
    toast({
      title: "Issue reported",
      description: `We're reviewing your report for "${rental.gameTitle}". We'll be in touch soon.`,
    });
  }, [updateRentalState, toast]);

  // Return shipped handler
  const handleReturnShipped = useCallback((rental: ActiveRental) => {
    updateRentalState(rental.id, "in_transit_to_lender", {
      phase: "return",
      requiresAction: false,
    });
    toast({
      title: "Marked as shipped! 📦",
      description: `"${rental.gameTitle}" is on its way back to ${rental.counterparty.name}`,
    });
  }, [updateRentalState, toast]);

  // Rental request handlers
  const handleAcceptRequest = useCallback((rental: ActiveRental) => {
    updateRentalState(rental.id, "accepted_awaiting_shipment", {
      phase: "rent",
      requiresAction: true,
    });
    toast({
      title: "Request accepted! ✅",
      description: `You've accepted the rental request. Please pack and ship "${rental.gameTitle}" to ${rental.counterparty.name}.`,
    });
  }, [updateRentalState, toast]);

  const handleRejectRequest = useCallback((rental: ActiveRental) => {
    updateRentalState(rental.id, "rejected_or_expired", {
      phase: "rent",
      requiresAction: false,
    });
    toast({
      title: "Request declined",
      description: `You've declined the rental request for "${rental.gameTitle}". The request will be forwarded to another lender.`,
    });
  }, [updateRentalState, toast]);

  // Extension handlers
  const handleAcceptExtension = useCallback((rental: ActiveRental) => {
    const newEndDate = new Date(rental.endDate);
    newEndDate.setDate(newEndDate.getDate() + 30);
    
    updateRentalState(rental.id, "active_play", {
      phase: "play",
      requiresAction: false,
      endDate: newEndDate,
    });
    toast({
      title: "Extension approved! 📅",
      description: `You've extended the rental of "${rental.gameTitle}" for another 30 days.`,
    });
  }, [updateRentalState, toast]);

  const handleRejectExtension = useCallback((rental: ActiveRental) => {
    updateRentalState(rental.id, "return_pending", {
      phase: "return",
      requiresAction: true,
    });
    toast({
      title: "Extension declined",
      description: `The renter will need to return "${rental.gameTitle}" by the original end date.`,
    });
  }, [updateRentalState, toast]);

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

  return {
    handleDecision,
    handleConfirmReceipt,
    handleReportIssue,
    handleReturnShipped,
    handleAcceptRequest,
    handleRejectRequest,
    handleAcceptExtension,
    handleRejectExtension,
    handleMarkShipped,
    handleConfirmReturnReceived,
  };
}

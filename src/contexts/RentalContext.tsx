// Rental context provider - manages rental state and actions
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from "react";
import { ActiveRental, RentalState } from "@/types/rental";
import { useToast } from "@/hooks/use-toast";
import { useRentalDialogs } from "@/hooks/useRentalDialogs";
import { useRentalActions } from "@/hooks/useRentalActions";
import { RentalDialogManager } from "@/components/RentalDialogManager";
import { API } from "@/services/api";
import { mapBackendRentalsToFrontendAsync, mapFrontendStateToBackendStatus } from "@/utils/rentalMapper";

interface RentalContextType {
  rentals: ActiveRental[];
  updateRentalState: (rentalId: string, newState: RentalState, updates?: Partial<ActiveRental>) => void;
  handleRentalAction: (rental: ActiveRental, action: string) => void;
  removeRental: (rentalId: string) => void;
  isLoading: boolean;
  refetchRentals: () => Promise<void>;
}

const RentalContext = createContext<RentalContextType | undefined>(undefined);

export function RentalProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<ActiveRental[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const { toast } = useToast();
  
  // Use extracted dialog state management
  const dialogs = useRentalDialogs();

  // Fetch rentals from backend
  const fetchRentals = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentUserId = API.getCurrentUserId();
      
      if (!currentUserId || !API.isAuthenticated()) {
        // Not logged in - use empty array
        setRentals([]);
        setUseFallback(false);
        setIsLoading(false);
        return;
      }

      // Fetch both renter and lender rentals in parallel
      const [renterRentals, lenderRentals] = await Promise.all([
        API.getRentalsByRenter(currentUserId).catch(() => []),
        API.getRentalsByLender(currentUserId).catch(() => [])
      ]);

      // Combine and deduplicate by rental_id
      const allBackendRentals = [
        ...(Array.isArray(renterRentals) ? renterRentals : []),
        ...(Array.isArray(lenderRentals) ? lenderRentals : [])
      ];

      // Deduplicate rentals by rental_id to avoid duplicate keys
      const uniqueRentals = Array.from(
        new Map(allBackendRentals.map(rental => [rental.rental_id, rental])).values()
      );

      // Use async mapper to enrich with game images and user names
      const mappedRentals = await mapBackendRentalsToFrontendAsync(uniqueRentals, currentUserId);
      
      setRentals(mappedRentals);
      setUseFallback(false);
      
    } catch (error) {
      console.error('Failed to fetch rentals:', error);
      // Set empty array on error
      setRentals([]);
      setUseFallback(true);
      toast({
        title: "Error loading rentals",
        description: "Could not load your rentals. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch rentals on mount and when auth changes
  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const updateRentalState = useCallback(async (
    rentalId: string, 
    newState: RentalState, 
    updates?: Partial<ActiveRental>
  ) => {
    // Optimistically update UI
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

    // Sync to backend if not using fallback
    if (!useFallback) {
      try {
        const backendStatus = mapFrontendStateToBackendStatus(newState);
        await API.updateRental(rentalId, { status: backendStatus });
      } catch (error) {
        console.error('Failed to update rental in backend:', error);
        // Revert optimistic update on error
        toast({
          title: "Update failed",
          description: "Failed to sync rental state. Changes may not persist.",
          variant: "destructive"
        });
        // Refetch to get correct state
        fetchRentals();
      }
    }
  }, [useFallback, toast, fetchRentals]);

  const removeRental = useCallback(async (rentalId: string) => {
    // Optimistically remove from UI
    setRentals(prev => prev.filter(rental => rental.id !== rentalId));

    // Delete from backend if not using fallback
    if (!useFallback) {
      try {
        await API.deleteRental(rentalId);
      } catch (error) {
        console.error('Failed to delete rental from backend:', error);
        toast({
          title: "Delete failed",
          description: "Failed to remove rental. It may reappear on refresh.",
          variant: "destructive"
        });
        // Refetch to get correct state
        fetchRentals();
      }
    }
  }, [useFallback, toast, fetchRentals]);

  const refetchRentals = useCallback(async () => {
    await fetchRentals();
  }, [fetchRentals]);

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
    <RentalContext.Provider value={{ 
      rentals, 
      updateRentalState, 
      handleRentalAction, 
      removeRental,
      isLoading,
      refetchRentals
    }}>
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

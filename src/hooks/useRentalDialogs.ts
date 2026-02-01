import { useState, useCallback } from "react";
import { ActiveRental } from "@/types/rental";

export interface RentalDialogState {
  // Decision dialog
  decisionRental: ActiveRental | null;
  isDecisionDialogOpen: boolean;
  setDecisionDialogOpen: (open: boolean) => void;
  openDecisionDialog: (rental: ActiveRental) => void;
  
  // Return dialog
  returnRental: ActiveRental | null;
  isReturnDialogOpen: boolean;
  setReturnDialogOpen: (open: boolean) => void;
  openReturnDialog: (rental: ActiveRental) => void;
  
  // Receipt dialog
  receiptRental: ActiveRental | null;
  isReceiptDialogOpen: boolean;
  setReceiptDialogOpen: (open: boolean) => void;
  openReceiptDialog: (rental: ActiveRental) => void;
  
  // Request dialog
  requestRental: ActiveRental | null;
  isRequestDialogOpen: boolean;
  setRequestDialogOpen: (open: boolean) => void;
  openRequestDialog: (rental: ActiveRental) => void;
  
  // Extension dialog
  extensionRental: ActiveRental | null;
  isExtensionDialogOpen: boolean;
  setExtensionDialogOpen: (open: boolean) => void;
  openExtensionDialog: (rental: ActiveRental) => void;
}

export function useRentalDialogs(): RentalDialogState {
  // Decision dialog
  const [decisionRental, setDecisionRental] = useState<ActiveRental | null>(null);
  const [isDecisionDialogOpen, setIsDecisionDialogOpen] = useState(false);
  
  // Return dialog
  const [returnRental, setReturnRental] = useState<ActiveRental | null>(null);
  const [isReturnDialogOpen, setIsReturnDialogOpen] = useState(false);
  
  // Receipt dialog
  const [receiptRental, setReceiptRental] = useState<ActiveRental | null>(null);
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false);
  
  // Request dialog
  const [requestRental, setRequestRental] = useState<ActiveRental | null>(null);
  const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
  
  // Extension dialog
  const [extensionRental, setExtensionRental] = useState<ActiveRental | null>(null);
  const [isExtensionDialogOpen, setIsExtensionDialogOpen] = useState(false);

  const openDecisionDialog = useCallback((rental: ActiveRental) => {
    setDecisionRental(rental);
    setIsDecisionDialogOpen(true);
  }, []);

  const openReturnDialog = useCallback((rental: ActiveRental) => {
    setReturnRental(rental);
    setIsReturnDialogOpen(true);
  }, []);

  const openReceiptDialog = useCallback((rental: ActiveRental) => {
    setReceiptRental(rental);
    setIsReceiptDialogOpen(true);
  }, []);

  const openRequestDialog = useCallback((rental: ActiveRental) => {
    setRequestRental(rental);
    setIsRequestDialogOpen(true);
  }, []);

  const openExtensionDialog = useCallback((rental: ActiveRental) => {
    setExtensionRental(rental);
    setIsExtensionDialogOpen(true);
  }, []);

  return {
    decisionRental,
    isDecisionDialogOpen,
    setDecisionDialogOpen: setIsDecisionDialogOpen,
    openDecisionDialog,
    
    returnRental,
    isReturnDialogOpen,
    setReturnDialogOpen: setIsReturnDialogOpen,
    openReturnDialog,
    
    receiptRental,
    isReceiptDialogOpen,
    setReceiptDialogOpen: setIsReceiptDialogOpen,
    openReceiptDialog,
    
    requestRental,
    isRequestDialogOpen,
    setRequestDialogOpen: setIsRequestDialogOpen,
    openRequestDialog,
    
    extensionRental,
    isExtensionDialogOpen,
    setExtensionDialogOpen: setIsExtensionDialogOpen,
    openExtensionDialog,
  };
}

import { ActiveRental } from "@/types/rental";
import RentalDecisionDialog from "./RentalDecisionDialog";
import ReturnInstructionsDialog from "./ReturnInstructionsDialog";
import ReceiptConfirmationDialog from "./ReceiptConfirmationDialog";
import RentalRequestReviewDialog from "./RentalRequestReviewDialog";
import ExtensionReviewDialog from "./ExtensionReviewDialog";
import { RentalDialogState } from "@/hooks/useRentalDialogs";

interface RentalDialogManagerProps {
  dialogs: RentalDialogState;
  onDecision: (rental: ActiveRental, decision: "extend" | "return" | "purchase") => void;
  onConfirmReceipt: (rental: ActiveRental) => void;
  onReportIssue: (rental: ActiveRental, issue: string) => void;
  onReturnShipped: (rental: ActiveRental) => void;
  onAcceptRequest: (rental: ActiveRental) => void;
  onRejectRequest: (rental: ActiveRental) => void;
  onAcceptExtension: (rental: ActiveRental) => void;
  onRejectExtension: (rental: ActiveRental) => void;
}

export function RentalDialogManager({
  dialogs,
  onDecision,
  onConfirmReceipt,
  onReportIssue,
  onReturnShipped,
  onAcceptRequest,
  onRejectRequest,
  onAcceptExtension,
  onRejectExtension,
}: RentalDialogManagerProps) {
  return (
    <>
      <RentalDecisionDialog
        rental={dialogs.decisionRental}
        open={dialogs.isDecisionDialogOpen}
        onOpenChange={dialogs.setDecisionDialogOpen}
        onDecision={onDecision}
      />
      
      <ReturnInstructionsDialog
        rental={dialogs.returnRental}
        open={dialogs.isReturnDialogOpen}
        onOpenChange={dialogs.setReturnDialogOpen}
        onMarkShipped={() => {
          if (dialogs.returnRental) {
            onReturnShipped(dialogs.returnRental);
            dialogs.setReturnDialogOpen(false);
          }
        }}
      />
      
      <ReceiptConfirmationDialog
        rental={dialogs.receiptRental}
        open={dialogs.isReceiptDialogOpen}
        onOpenChange={dialogs.setReceiptDialogOpen}
        onConfirmReceipt={() => {
          if (dialogs.receiptRental) {
            onConfirmReceipt(dialogs.receiptRental);
            dialogs.setReceiptDialogOpen(false);
          }
        }}
        onReportIssue={(issue) => {
          if (dialogs.receiptRental) {
            onReportIssue(dialogs.receiptRental, issue);
            dialogs.setReceiptDialogOpen(false);
          }
        }}
      />
      
      <RentalRequestReviewDialog
        rental={dialogs.requestRental}
        open={dialogs.isRequestDialogOpen}
        onOpenChange={dialogs.setRequestDialogOpen}
        onAccept={() => {
          if (dialogs.requestRental) {
            onAcceptRequest(dialogs.requestRental);
            dialogs.setRequestDialogOpen(false);
          }
        }}
        onReject={() => {
          if (dialogs.requestRental) {
            onRejectRequest(dialogs.requestRental);
            dialogs.setRequestDialogOpen(false);
          }
        }}
      />
      
      <ExtensionReviewDialog
        rental={dialogs.extensionRental}
        open={dialogs.isExtensionDialogOpen}
        onOpenChange={dialogs.setExtensionDialogOpen}
        onAccept={() => {
          if (dialogs.extensionRental) {
            onAcceptExtension(dialogs.extensionRental);
            dialogs.setExtensionDialogOpen(false);
          }
        }}
        onReject={() => {
          if (dialogs.extensionRental) {
            onRejectExtension(dialogs.extensionRental);
            dialogs.setExtensionDialogOpen(false);
          }
        }}
      />
    </>
  );
}

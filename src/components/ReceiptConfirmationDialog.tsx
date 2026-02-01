import { useState } from "react";
import { Package, CheckCircle2, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ActiveRental } from "@/types/rental";

interface ReceiptConfirmationDialogProps {
  rental: ActiveRental | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmReceipt: () => void;
  onReportIssue: (issue: string) => void;
}

const ReceiptConfirmationDialog = ({
  rental,
  open,
  onOpenChange,
  onConfirmReceipt,
  onReportIssue,
}: ReceiptConfirmationDialogProps) => {
  const [mode, setMode] = useState<"confirm" | "issue">("confirm");
  const [issueDescription, setIssueDescription] = useState("");

  const handleConfirm = () => {
    onConfirmReceipt();
    setMode("confirm");
    setIssueDescription("");
  };

  const handleReportIssue = () => {
    if (issueDescription.trim()) {
      onReportIssue(issueDescription);
      setMode("confirm");
      setIssueDescription("");
    }
  };

  const handleClose = () => {
    setMode("confirm");
    setIssueDescription("");
    onOpenChange(false);
  };

  if (!rental) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Confirm Receipt
          </DialogTitle>
          <DialogDescription>
            Please confirm you've received "{rental.gameTitle}" and check its condition.
          </DialogDescription>
        </DialogHeader>

        {/* Game and lender info */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
          <img
            src={rental.gameCover}
            alt={rental.gameTitle}
            className="w-12 h-16 rounded-md object-cover"
          />
          <div className="flex-1">
            <p className="font-medium text-sm">{rental.gameTitle}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <Avatar className="w-5 h-5">
                <AvatarImage src={rental.counterparty.avatar} />
                <AvatarFallback className="text-[10px]">
                  {rental.counterparty.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                From {rental.counterparty.name}
              </span>
            </div>
          </div>
        </div>

        {mode === "confirm" ? (
          <>
            {/* Checklist */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Before confirming, please check:</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>All components are present</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>No visible damage to cards, board, or pieces</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <span>Game is clean and in good hygiene condition</span>
                </li>
              </ul>
            </div>

            {/* Notice */}
            <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                You have 24 hours after confirming to report any issues.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button onClick={handleConfirm} className="w-full">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm Receipt - All Good!
              </Button>
              <Button
                variant="outline"
                onClick={() => setMode("issue")}
                className="w-full text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/30"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Report an Issue
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Issue reporting mode */}
            <div className="space-y-3">
              <p className="text-sm font-medium">Describe the issue:</p>
              <Textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                placeholder="E.g., Missing 3 resource cards, box is damaged, etc."
                className="min-h-[100px]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setMode("confirm")}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleReportIssue}
                disabled={!issueDescription.trim()}
                className="flex-1"
                variant="destructive"
              >
                Submit Issue
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ReceiptConfirmationDialog;

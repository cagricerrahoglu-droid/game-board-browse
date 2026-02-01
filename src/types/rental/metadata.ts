import { RentalState } from "./states";

// State metadata for display
export interface StateMetadata {
  label: string;
  description: string;
  variant: "default" | "warning" | "urgent" | "success" | "info";
}

export const stateMetadata: Record<RentalState, StateMetadata> = {
  // Rent phase
  request_sent: {
    label: "Request sent",
    description: "Waiting for lender to respond",
    variant: "info",
  },
  awaiting_lender_response: {
    label: "Awaiting response",
    description: "Lender is reviewing your request",
    variant: "info",
  },
  accepted_awaiting_shipment: {
    label: "Accepted",
    description: "Lender will ship soon",
    variant: "success",
  },
  rejected_or_expired: {
    label: "Declined",
    description: "Request was declined or expired",
    variant: "default",
  },

  // Receive phase
  in_transit_to_renter: {
    label: "In transit",
    description: "Game is on its way to you",
    variant: "info",
  },
  awaiting_receipt_confirmation: {
    label: "Confirm receipt",
    description: "Please confirm you received the game",
    variant: "warning",
  },
  issue_reported_review: {
    label: "Issue reported",
    description: "Under review by support",
    variant: "urgent",
  },
  returned_early_refund: {
    label: "Early return",
    description: "Processing refund",
    variant: "info",
  },

  // Play phase
  active_play: {
    label: "Playing",
    description: "Enjoy your game!",
    variant: "success",
  },
  decision_window: {
    label: "Decision needed",
    description: "Choose to extend, return, or buy",
    variant: "warning",
  },
  extension_pending: {
    label: "Extension pending",
    description: "Waiting for lender approval",
    variant: "info",
  },
  purchase_pending: {
    label: "Purchase pending",
    description: "Processing your purchase",
    variant: "info",
  },

  // Return phase
  return_pending: {
    label: "Return pending",
    description: "Please ship the game back",
    variant: "warning",
  },
  in_transit_to_lender: {
    label: "Returning",
    description: "Game is on its way back",
    variant: "info",
  },
  grace_period: {
    label: "Grace period",
    description: "Return overdue - contact support",
    variant: "urgent",
  },
  completed: {
    label: "Completed",
    description: "Rental finished",
    variant: "success",
  },
};

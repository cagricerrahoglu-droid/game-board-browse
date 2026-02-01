// Canonical rental states
export type RentalPhase = "rent" | "receive" | "play" | "return";

export type RentState = 
  | "request_sent"
  | "awaiting_lender_response"
  | "accepted_awaiting_shipment"
  | "rejected_or_expired";

export type ReceiveState =
  | "in_transit_to_renter"
  | "awaiting_receipt_confirmation"
  | "issue_reported_review"
  | "returned_early_refund";

export type PlayState =
  | "active_play"
  | "decision_window"
  | "extension_pending"
  | "purchase_pending";

export type ReturnState =
  | "return_pending"
  | "in_transit_to_lender"
  | "grace_period"
  | "completed";

export type RentalState = RentState | ReceiveState | PlayState | ReturnState;

export type RentalRole = "renter" | "lender";

export interface Counterparty {
  id: string;
  name: string;
  avatar?: string;
}

export interface ActiveRental {
  id: string;
  gameId: string;
  gameTitle: string;
  gameCover: string;
  role: RentalRole;
  state: RentalState;
  phase: RentalPhase;
  counterparty: Counterparty;
  startDate: Date;
  endDate: Date;
  actionDeadline?: Date; // For time-sensitive actions
  requiresAction: boolean;
  monthlyPrice: number;
}

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

// CTA definitions per role and state
export interface CTAConfig {
  label: string;
  action: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
}

export const renterCTAs: Partial<Record<RentalState, CTAConfig>> = {
  awaiting_receipt_confirmation: {
    label: "Confirm receipt",
    action: "confirm_receipt",
  },
  decision_window: {
    label: "Choose next step",
    action: "make_decision",
  },
  return_pending: {
    label: "View return instructions",
    action: "view_return",
  },
  grace_period: {
    label: "Contact support",
    action: "contact_support",
    variant: "destructive",
  },
  active_play: {
    label: "View details",
    action: "view_details",
    variant: "outline",
  },
  in_transit_to_renter: {
    label: "Track shipment",
    action: "track_shipment",
    variant: "outline",
  },
};

export const lenderCTAs: Partial<Record<RentalState, CTAConfig>> = {
  awaiting_lender_response: {
    label: "Review request",
    action: "review_request",
  },
  accepted_awaiting_shipment: {
    label: "Mark as shipped",
    action: "mark_shipped",
  },
  extension_pending: {
    label: "Review extension",
    action: "review_extension",
  },
  completed: {
    label: "Rate renter",
    action: "rate_renter",
    variant: "secondary",
  },
  in_transit_to_lender: {
    label: "Track return",
    action: "track_return",
    variant: "outline",
  },
};

// Helper to get CTA for a rental
export function getCTAForRental(rental: ActiveRental): CTAConfig | null {
  const ctaMap = rental.role === "renter" ? renterCTAs : lenderCTAs;
  return ctaMap[rental.state] || null;
}

// Helper to determine if rental requires urgent attention
export function isUrgent(rental: ActiveRental): boolean {
  if (!rental.actionDeadline) return false;
  const hoursUntilDeadline = (rental.actionDeadline.getTime() - Date.now()) / (1000 * 60 * 60);
  return hoursUntilDeadline < 12;
}

// Helper to sort rentals by priority
export function sortByPriority(rentals: ActiveRental[]): ActiveRental[] {
  return [...rentals].sort((a, b) => {
    // Action required first
    if (a.requiresAction !== b.requiresAction) {
      return a.requiresAction ? -1 : 1;
    }
    // Then by deadline urgency
    if (a.actionDeadline && b.actionDeadline) {
      return a.actionDeadline.getTime() - b.actionDeadline.getTime();
    }
    if (a.actionDeadline) return -1;
    if (b.actionDeadline) return 1;
    // Then by end date
    return a.endDate.getTime() - b.endDate.getTime();
  });
}

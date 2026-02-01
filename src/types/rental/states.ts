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
  actionDeadline?: Date;
  requiresAction: boolean;
  monthlyPrice: number;
}

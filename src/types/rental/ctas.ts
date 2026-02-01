import { RentalState, ActiveRental } from "./states";

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
  in_transit_to_lender: {
    label: "Confirm received",
    action: "confirm_return_received",
  },
  completed: {
    label: "Rate renter",
    action: "rate_renter",
    variant: "secondary",
  },
};

// Helper to get CTA for a rental
export function getCTAForRental(rental: ActiveRental): CTAConfig | null {
  const ctaMap = rental.role === "renter" ? renterCTAs : lenderCTAs;
  return ctaMap[rental.state] || null;
}

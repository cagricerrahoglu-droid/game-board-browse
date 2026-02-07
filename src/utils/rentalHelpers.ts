import { ActiveRental } from "@/types/rental";

// Helper to get rentals by role
export function getRentalsByRole(rentals: ActiveRental[], role: "renter" | "lender"): ActiveRental[] {
  return rentals.filter(r => r.role === role && r.state !== "completed");
}

// Helper to count rentals requiring action
export function countActionRequired(rentals: ActiveRental[]): number {
  return rentals.filter(r => r.requiresAction && r.state !== "completed").length;
}

// Helper to check if any rental is urgent
export function hasUrgentRentals(rentals: ActiveRental[]): boolean {
  return rentals.some(r => {
    if (!r.actionDeadline || r.state === "completed") return false;
    const hoursUntilDeadline = (r.actionDeadline.getTime() - Date.now()) / (1000 * 60 * 60);
    return hoursUntilDeadline < 12;
  });
}

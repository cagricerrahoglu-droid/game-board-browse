import { ActiveRental } from "./states";

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

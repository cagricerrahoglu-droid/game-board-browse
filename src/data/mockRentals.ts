import { ActiveRental } from "@/types/rental";

// Import game images
import catanImage from "@/assets/games/splendor.jpg";
import ticketToRideImage from "@/assets/games/pandemic.jpg";
import azulImage from "@/assets/games/7-wonders-duel.jpg";
import wingspanImage from "@/assets/games/kingdomino.jpg";

// Mock counterparty avatars
import adventurerAvatar from "@/assets/avatars/adventurer.png";
import familyGamerAvatar from "@/assets/avatars/family-gamer.png";
import strategistAvatar from "@/assets/avatars/strategist.png";
import partyPlayerAvatar from "@/assets/avatars/party-player.png";

const now = new Date();
const addDays = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
const addHours = (hours: number) => new Date(now.getTime() + hours * 60 * 60 * 1000);

// Mock rentals for demonstration
export const mockRentals: ActiveRental[] = [
  // Renter rentals
  {
    id: "rental-1",
    gameId: "splendor",
    gameTitle: "Splendor",
    gameCover: catanImage,
    role: "renter",
    state: "awaiting_receipt_confirmation",
    phase: "receive",
    counterparty: {
      id: "user-1",
      name: "Sarah M.",
      avatar: adventurerAvatar,
    },
    startDate: addDays(-2),
    endDate: addDays(28),
    actionDeadline: addHours(18),
    requiresAction: true,
    monthlyPrice: 8.99,
  },
  {
    id: "rental-2",
    gameId: "pandemic",
    gameTitle: "Pandemic",
    gameCover: ticketToRideImage,
    role: "renter",
    state: "active_play",
    phase: "play",
    counterparty: {
      id: "user-2",
      name: "James K.",
      avatar: familyGamerAvatar,
    },
    startDate: addDays(-15),
    endDate: addDays(15),
    requiresAction: false,
    monthlyPrice: 7.49,
  },
  {
    id: "rental-3",
    gameId: "7-wonders-duel",
    gameTitle: "7 Wonders Duel",
    gameCover: azulImage,
    role: "renter",
    state: "decision_window",
    phase: "play",
    counterparty: {
      id: "user-3",
      name: "Emma L.",
      avatar: strategistAvatar,
    },
    startDate: addDays(-28),
    endDate: addDays(2),
    actionDeadline: addHours(36),
    requiresAction: true,
    monthlyPrice: 6.99,
  },

  // Lender rentals
  {
    id: "rental-4",
    gameId: "kingdomino",
    gameTitle: "Kingdomino",
    gameCover: wingspanImage,
    role: "lender",
    state: "awaiting_lender_response",
    phase: "rent",
    counterparty: {
      id: "user-4",
      name: "Michael R.",
      avatar: partyPlayerAvatar,
    },
    startDate: now,
    endDate: addDays(30),
    actionDeadline: addHours(24),
    requiresAction: true,
    monthlyPrice: 5.99,
  },
  {
    id: "rental-5",
    gameId: "wingspan",
    gameTitle: "Wingspan",
    gameCover: catanImage,
    role: "lender",
    state: "in_transit_to_lender",
    phase: "return",
    counterparty: {
      id: "user-5",
      name: "Lisa T.",
      avatar: adventurerAvatar,
    },
    startDate: addDays(-30),
    endDate: now,
    requiresAction: false,
    monthlyPrice: 9.99,
  },
];

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

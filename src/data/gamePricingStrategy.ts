/**
 * Game Pricing Strategy
 * 
 * This module defines the pricing strategy for board game rentals.
 * Rental prices are calculated as a function of the game's average online sale price.
 */

/**
 * Game pricing data table with average online sale prices
 * This should be stored in your database, but included here as reference
 */
export interface GamePricingData {
  catalog_game_id: string;
  name: string;
  avg_online_sale_price: number; // in USD
  category?: string;
  complexity?: number; // 1-5 scale
}

/**
 * Calculated rental pricing details
 */
export interface RentalPricingDetails {
  catalog_game_id: string;
  game_name: string;
  avg_sale_price: number;
  monthly_rental_price: number;
  security_deposit: number;
  daily_rental_price: number;
  late_fee_per_day: number;
  damage_waiver_fee: number;
  breakdown: {
    rental_percentage: number; // % of sale price
    deposit_percentage: number; // % of sale price
    late_fee_percentage: number; // % of daily rental
    waiver_percentage: number; // % of sale price
  };
}

/**
 * Pricing Constants
 * These define what percentage of the sale price goes to different costs
 */
export const PRICING_CONSTANTS = {
  // Monthly rental as % of sale price
  MONTHLY_RENTAL_PERCENTAGE: 0.10, // 10% of sale price per month
  
  // Security deposit as % of sale price
  SECURITY_DEPOSIT_PERCENTAGE: 0.25, // 25% of sale price
  
  // Late fee as % of daily rental price
  LATE_FEE_PERCENTAGE: 0.5, // 50% of daily rate per day late
  
  // Damage waiver insurance as % of monthly rental
  DAMAGE_WAIVER_PERCENTAGE: 0.15, // 15% of monthly rental price
};

/**
 * Price brackets for tiered pricing (optional enhancement)
 * Allows for bulk discounts on premium games
 */
export const PRICE_BRACKETS = {
  BUDGET: { min: 0, max: 20, description: "Budget games" },
  STANDARD: { min: 20, max: 50, description: "Standard games" },
  PREMIUM: { min: 50, max: 100, description: "Premium games" },
  LUXURY: { min: 100, max: Infinity, description: "Luxury/expansion games" },
};

/**
 * Calculate rental pricing based on average sale price
 * 
 * @param catalog_game_id - Game ID
 * @param game_name - Name of the game
 * @param avg_sale_price - Average online sale price in USD
 * @returns Detailed pricing breakdown
 * 
 * @example
 * const pricing = calculateGamePricing(
 *   "catan",
 *   "Catan",
 *   45.99
 * );
 * // Returns:
 * // {
 * //   monthly_rental_price: 4.60,
 * //   security_deposit: 11.50,
 * //   daily_rental_price: 0.15,
 * //   late_fee_per_day: 0.08,
 * //   damage_waiver_fee: 0.69
 * // }
 */
export function calculateGamePricing(
  catalog_game_id: string,
  game_name: string,
  avg_sale_price: number
): RentalPricingDetails {
  // Monthly rental price
  const monthly_rental_price = Math.round(
    avg_sale_price * PRICING_CONSTANTS.MONTHLY_RENTAL_PERCENTAGE * 100
  ) / 100;

  // Security deposit (typically 25% of game value)
  const security_deposit = Math.round(
    avg_sale_price * PRICING_CONSTANTS.SECURITY_DEPOSIT_PERCENTAGE * 100
  ) / 100;

  // Daily rental price (approximately 1/30 of monthly)
  const daily_rental_price = Math.round(
    (monthly_rental_price / 30) * 100
  ) / 100;

  // Late fee (50% of daily rental per day)
  const late_fee_per_day = Math.round(
    daily_rental_price * PRICING_CONSTANTS.LATE_FEE_PERCENTAGE * 100
  ) / 100;

  // Damage waiver (insurance) - 15% of monthly rental
  const damage_waiver_fee = Math.round(
    monthly_rental_price * PRICING_CONSTANTS.DAMAGE_WAIVER_PERCENTAGE * 100
  ) / 100;

  return {
    catalog_game_id,
    game_name,
    avg_sale_price,
    monthly_rental_price,
    security_deposit,
    daily_rental_price,
    late_fee_per_day,
    damage_waiver_fee,
    breakdown: {
      rental_percentage: PRICING_CONSTANTS.MONTHLY_RENTAL_PERCENTAGE * 100,
      deposit_percentage: PRICING_CONSTANTS.SECURITY_DEPOSIT_PERCENTAGE * 100,
      late_fee_percentage: PRICING_CONSTANTS.LATE_FEE_PERCENTAGE * 100,
      waiver_percentage: PRICING_CONSTANTS.DAMAGE_WAIVER_PERCENTAGE * 100,
    },
  };
}

/**
 * Get pricing bracket for a game based on sale price
 * Useful for categorizing games or applying tier-based discounts
 */
export function getPriceBracket(
  avg_sale_price: number
): keyof typeof PRICE_BRACKETS {
  if (avg_sale_price <= PRICE_BRACKETS.BUDGET.max) return "BUDGET";
  if (avg_sale_price <= PRICE_BRACKETS.STANDARD.max) return "STANDARD";
  if (avg_sale_price <= PRICE_BRACKETS.PREMIUM.max) return "PREMIUM";
  return "LUXURY";
}

/**
 * Sample game pricing data
 * This demonstrates what your pricing table should look like
 * Replace with actual database queries
 */
export const SAMPLE_GAMES_PRICING: GamePricingData[] = [
  // Strategy Games
  {
    catalog_game_id: "catan",
    name: "Catan",
    avg_online_sale_price: 45.99,
    category: "Strategy",
    complexity: 2.5,
  },
  {
    catalog_game_id: "ticket-to-ride",
    name: "Ticket to Ride",
    avg_online_sale_price: 39.99,
    category: "Strategy",
    complexity: 2,
  },
  {
    catalog_game_id: "wingspan",
    name: "Wingspan",
    avg_online_sale_price: 69.99,
    category: "Strategy",
    complexity: 2.5,
  },
  {
    catalog_game_id: "terraforming-mars",
    name: "Terraforming Mars",
    avg_online_sale_price: 64.99,
    category: "Strategy",
    complexity: 3.5,
  },
  {
    catalog_game_id: "7-wonders",
    name: "7 Wonders",
    avg_online_sale_price: 54.99,
    category: "Strategy",
    complexity: 2.8,
  },

  // Family Games
  {
    catalog_game_id: "azul",
    name: "Azul",
    avg_online_sale_price: 29.99,
    category: "Family",
    complexity: 1.5,
  },
  {
    catalog_game_id: "splendor",
    name: "Splendor",
    avg_online_sale_price: 34.99,
    category: "Family",
    complexity: 2,
  },
  {
    catalog_game_id: "kingdomino",
    name: "Kingdomino",
    avg_online_sale_price: 39.99,
    category: "Family",
    complexity: 1.8,
  },
  {
    catalog_game_id: "sushi-go",
    name: "Sushi Go!",
    avg_online_sale_price: 19.99,
    category: "Family",
    complexity: 1.2,
  },
  {
    catalog_game_id: "dixit",
    name: "Dixit",
    avg_online_sale_price: 24.99,
    category: "Family",
    complexity: 1,
  },

  // 2-Player Games
  {
    catalog_game_id: "7-wonders-duel",
    name: "7 Wonders Duel",
    avg_online_sale_price: 49.99,
    category: "2-Player",
    complexity: 2.8,
  },
  {
    catalog_game_id: "patchwork",
    name: "Patchwork",
    avg_online_sale_price: 24.99,
    category: "2-Player",
    complexity: 2,
  },
  {
    catalog_game_id: "jaipur",
    name: "Jaipur",
    avg_online_sale_price: 14.99,
    category: "2-Player",
    complexity: 1.5,
  },

  // Party Games
  {
    catalog_game_id: "codenames",
    name: "Codenames",
    avg_online_sale_price: 19.99,
    category: "Party",
    complexity: 1.5,
  },
  {
    catalog_game_id: "wavelength",
    name: "Wavelength",
    avg_online_sale_price: 24.99,
    category: "Party",
    complexity: 1,
  },
  {
    catalog_game_id: "just-one",
    name: "Just One",
    avg_online_sale_price: 19.99,
    category: "Party",
    complexity: 1,
  },
  {
    catalog_game_id: "telestrations",
    name: "Telestrations",
    avg_online_sale_price: 29.99,
    category: "Party",
    complexity: 1,
  },
  {
    catalog_game_id: "the-resistance",
    name: "The Resistance",
    avg_online_sale_price: 19.99,
    category: "Party",
    complexity: 1.2,
  },

  // Cooperative Games
  {
    catalog_game_id: "pandemic",
    name: "Pandemic",
    avg_online_sale_price: 34.99,
    category: "Cooperative",
    complexity: 2.5,
  },
  {
    catalog_game_id: "spirit-island",
    name: "Spirit Island",
    avg_online_sale_price: 79.99,
    category: "Cooperative",
    complexity: 3.8,
  },
  {
    catalog_game_id: "the-crew",
    name: "The Crew",
    avg_online_sale_price: 14.99,
    category: "Cooperative",
    complexity: 2,
  },
  {
    catalog_game_id: "hanabi",
    name: "Hanabi",
    avg_online_sale_price: 9.99,
    category: "Cooperative",
    complexity: 2,
  },
  {
    catalog_game_id: "mysterium",
    name: "Mysterium",
    avg_online_sale_price: 34.99,
    category: "Cooperative",
    complexity: 2,
  },

  // Beginner Games
  {
    catalog_game_id: "monopoly",
    name: "Monopoly",
    avg_online_sale_price: 24.99,
    category: "Beginner",
    complexity: 1.5,
  },
  {
    catalog_game_id: "scrabble",
    name: "Scrabble",
    avg_online_sale_price: 19.99,
    category: "Beginner",
    complexity: 1.5,
  },
  {
    catalog_game_id: "uno",
    name: "UNO",
    avg_online_sale_price: 7.99,
    category: "Beginner",
    complexity: 1,
  },
  {
    catalog_game_id: "dobble",
    name: "Dobble",
    avg_online_sale_price: 14.99,
    category: "Beginner",
    complexity: 1,
  },
  {
    catalog_game_id: "exploding-kittens",
    name: "Exploding Kittens",
    avg_online_sale_price: 16.99,
    category: "Beginner",
    complexity: 1,
  },
  {
    catalog_game_id: "codenames-duet",
    name: "Codenames: Duet",
    avg_online_sale_price: 19.99,
    category: "Beginner",
    complexity: 1.5,
  },
  {
    catalog_game_id: "star-realms",
    name: "Star Realms",
    avg_online_sale_price: 14.99,
    category: "Beginner",
    complexity: 1.5,
  },
  {
    catalog_game_id: "love-letter",
    name: "Love Letter",
    avg_online_sale_price: 9.99,
    category: "Beginner",
    complexity: 1,
  },
];

/**
 * Generate pricing for all sample games
 * Useful for testing and understanding the pricing strategy
 */
export function generateAllPricings(): RentalPricingDetails[] {
  return SAMPLE_GAMES_PRICING.map((game) =>
    calculateGamePricing(game.catalog_game_id, game.name, game.avg_online_sale_price)
  );
}

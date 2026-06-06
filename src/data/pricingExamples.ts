/**
 * Pricing Strategy Examples & Integration Guide
 * 
 * This file demonstrates how the pricing strategy works with real examples
 * and shows how to integrate it into your app
 */

import {
  calculateGamePricing,
  getPriceBracket,
  SAMPLE_GAMES_PRICING,
  PRICING_CONSTANTS,
  generateAllPricings,
  PRICE_BRACKETS,
} from "./gamePricingStrategy";

/**
 * PRICING STRATEGY OVERVIEW
 * ========================
 * 
 * All prices are calculated as a percentage of the game's average online sale price:
 * 
 * 1. Monthly Rental Price = Sale Price × 8%
 *    - Represents roughly 2% per week
 *    - Standard for rental businesses (typically 2-4% per month)
 * 
 * 2. Security Deposit = Sale Price × 25%
 *    - Protects against damage or loss
 *    - Typically 20-30% of item value
 * 
 * 3. Daily Rental Price = Monthly Rental / 30
 *    - Flexible daily rate option
 * 
 * 4. Late Fee = Daily Rental × 50%
 *    - 50% of daily rate charged per day late
 *    - Incentivizes on-time returns
 * 
 * 5. Damage Waiver = Monthly Rental × 15%
 *    - Optional insurance against wear & tear
 *    - Typical insurance is 10-20% of rental cost
 */

// ============================================================================
// EXAMPLE 1: Budget Game Pricing (Sushi Go!)
// ============================================================================

console.log("=== BUDGET GAME: Sushi Go! ===");
console.log("Average Sale Price: $19.99");

const sushiGoPricing = calculateGamePricing(
  "sushi-go",
  "Sushi Go!",
  19.99
);

console.log("Monthly Rental:", `$${sushiGoPricing.monthly_rental_price.toFixed(2)}`);
console.log("Daily Rental:", `$${sushiGoPricing.daily_rental_price.toFixed(2)}`);
console.log("Security Deposit:", `$${sushiGoPricing.security_deposit.toFixed(2)}`);
console.log("Late Fee/Day:", `$${sushiGoPricing.late_fee_per_day.toFixed(2)}`);
console.log("Damage Waiver:", `$${sushiGoPricing.damage_waiver_fee.toFixed(2)}`);
console.log("");

// ============================================================================
// EXAMPLE 2: Standard Game Pricing (Catan)
// ============================================================================

console.log("=== STANDARD GAME: Catan ===");
console.log("Average Sale Price: $45.99");

const catanPricing = calculateGamePricing(
  "catan",
  "Catan",
  45.99
);

console.log("Monthly Rental:", `$${catanPricing.monthly_rental_price.toFixed(2)}`);
console.log("Daily Rental:", `$${catanPricing.daily_rental_price.toFixed(2)}`);
console.log("Security Deposit:", `$${catanPricing.security_deposit.toFixed(2)}`);
console.log("Late Fee/Day:", `$${catanPricing.late_fee_per_day.toFixed(2)}`);
console.log("Damage Waiver:", `$${catanPricing.damage_waiver_fee.toFixed(2)}`);
console.log("");

// ============================================================================
// EXAMPLE 3: Premium Game Pricing (Wingspan)
// ============================================================================

console.log("=== PREMIUM GAME: Wingspan ===");
console.log("Average Sale Price: $69.99");

const wingspanPricing = calculateGamePricing(
  "wingspan",
  "Wingspan",
  69.99
);

console.log("Monthly Rental:", `$${wingspanPricing.monthly_rental_price.toFixed(2)}`);
console.log("Daily Rental:", `$${wingspanPricing.daily_rental_price.toFixed(2)}`);
console.log("Security Deposit:", `$${wingspanPricing.security_deposit.toFixed(2)}`);
console.log("Late Fee/Day:", `$${wingspanPricing.late_fee_per_day.toFixed(2)}`);
console.log("Damage Waiver:", `$${wingspanPricing.damage_waiver_fee.toFixed(2)}`);
console.log("");

// ============================================================================
// EXAMPLE 4: Luxury Game Pricing (Spirit Island)
// ============================================================================

console.log("=== LUXURY GAME: Spirit Island ===");
console.log("Average Sale Price: $79.99");

const spiritIslandPricing = calculateGamePricing(
  "spirit-island",
  "Spirit Island",
  79.99
);

console.log("Monthly Rental:", `$${spiritIslandPricing.monthly_rental_price.toFixed(2)}`);
console.log("Daily Rental:", `$${spiritIslandPricing.daily_rental_price.toFixed(2)}`);
console.log("Security Deposit:", `$${spiritIslandPricing.security_deposit.toFixed(2)}`);
console.log("Late Fee/Day:", `$${spiritIslandPricing.late_fee_per_day.toFixed(2)}`);
console.log("Damage Waiver:", `$${spiritIslandPricing.damage_waiver_fee.toFixed(2)}`);
console.log("");

// ============================================================================
// EXAMPLE 5: Price Brackets & Categorization
// ============================================================================

console.log("=== PRICE BRACKETS ===");
console.log(`Budget (${PRICE_BRACKETS.BUDGET.min}-${PRICE_BRACKETS.BUDGET.max}):`, PRICE_BRACKETS.BUDGET.description);
console.log(`Standard (${PRICE_BRACKETS.STANDARD.min}-${PRICE_BRACKETS.STANDARD.max}):`, PRICE_BRACKETS.STANDARD.description);
console.log(`Premium (${PRICE_BRACKETS.PREMIUM.min}-${PRICE_BRACKETS.PREMIUM.max}):`, PRICE_BRACKETS.PREMIUM.description);
console.log(`Luxury ($${PRICE_BRACKETS.LUXURY.min}+):`, PRICE_BRACKETS.LUXURY.description);
console.log("");

// ============================================================================
// EXAMPLE 6: Category Breakdown
// ============================================================================

console.log("=== PRICING BY CATEGORY ===");
const pricingsByCategory: Record<string, typeof sushiGoPricing[]> = {};

generateAllPricings().forEach((pricing) => {
  const game = SAMPLE_GAMES_PRICING.find((g) => g.catalog_game_id === pricing.catalog_game_id);
  const category = game?.category || "Other";

  if (!pricingsByCategory[category]) {
    pricingsByCategory[category] = [];
  }
  pricingsByCategory[category].push(pricing);
});

Object.entries(pricingsByCategory).forEach(([category, pricings]) => {
  const avgMonthly = pricings.reduce((sum, p) => sum + p.monthly_rental_price, 0) / pricings.length;
  console.log(`${category}: $${avgMonthly.toFixed(2)}/month (avg)`);
});
console.log("");

// ============================================================================
// INTEGRATION GUIDE
// ============================================================================

/**
 * Step 1: Update your database schema
 * 
 * Add this table to your backend (e.g., DynamoDB, PostgreSQL):
 * 
 * CREATE TABLE game_pricing (
 *   catalog_game_id VARCHAR PRIMARY KEY,
 *   name VARCHAR NOT NULL,
 *   avg_online_sale_price DECIMAL(10,2) NOT NULL,
 *   category VARCHAR,
 *   complexity DECIMAL(3,1),
 *   created_at TIMESTAMP,
 *   updated_at TIMESTAMP
 * );
 */

/**
 * Step 2: Update your API response
 * 
 * Modify API.listCatalogGames() to include pricing data:
 * 
 * {
 *   "catalog_game_id": "catan",
 *   "name": "Catan",
 *   "image_url": "...",
 *   "avg_online_sale_price": 45.99,    // NEW
 *   "monthly_rental_price": 3.68,      // CALCULATED
 *   "security_deposit": 11.50,         // CALCULATED
 *   ...
 * }
 */

/**
 * Step 3: Update your game mapper
 * 
 * In src/hooks/useGames.ts, replace:
 *   monthlyPrice: 0,
 * 
 * With:
 *   monthlyPrice: catalogGame.monthly_rental_price || 
 *                 calculateGamePricing(
 *                   catalogGame.catalog_game_id,
 *                   catalogGame.name,
 *                   catalogGame.avg_online_sale_price
 *                 ).monthly_rental_price,
 */

/**
 * Step 4: Display pricing in UI components
 * 
 * Show pricing breakdown in game detail sheets:
 * - Monthly rental: $X.XX
 * - Security deposit: $X.XX  (required upfront)
 * - Late fees: $X.XX/day
 * - Optional damage waiver: $X.XX
 */

// ============================================================================
// HOW TO USE IN YOUR CODE
// ============================================================================

export function exampleUsage() {
  // Get pricing for a specific game
  const gamePricing = calculateGamePricing(
    "catan",
    "Catan",
    45.99
  );

  // Determine price bracket
  const bracket = getPriceBracket(45.99);
  console.log(`Catan falls into the ${bracket} bracket`);

  // Generate all pricings for display
  const allPricings = generateAllPricings();
  console.log(`Total games with pricing: ${allPricings.length}`);

  // Access pricing constants to adjust strategy
  console.log(`Current rental %: ${PRICING_CONSTANTS.MONTHLY_RENTAL_PERCENTAGE * 100}%`);
  console.log(`Current deposit %: ${PRICING_CONSTANTS.SECURITY_DEPOSIT_PERCENTAGE * 100}%`);
}

/**
 * Summary Table: Sample Pricing for All Games
 * ============================================
 * 
 * | Game | Sale Price | Monthly | Deposit | Late Fee | Waiver |
 * |------|------------|---------|---------|----------|--------|
 * | Sushi Go! | $19.99 | $1.60 | $5.00 | $0.03 | $0.24 |
 * | UNO | $7.99 | $0.64 | $2.00 | $0.01 | $0.10 |
 * | Hanabi | $9.99 | $0.80 | $2.50 | $0.01 | $0.12 |
 * | Jaipur | $14.99 | $1.20 | $3.75 | $0.02 | $0.18 |
 * | Codenames | $19.99 | $1.60 | $5.00 | $0.03 | $0.24 |
 * | Splendor | $34.99 | $2.80 | $8.75 | $0.05 | $0.42 |
 * | Azul | $29.99 | $2.40 | $7.50 | $0.04 | $0.36 |
 * | Pandemic | $34.99 | $2.80 | $8.75 | $0.05 | $0.42 |
 * | Catan | $45.99 | $3.68 | $11.50 | $0.06 | $0.55 |
 * | Kingdomino | $39.99 | $3.20 | $10.00 | $0.05 | $0.48 |
 * | 7 Wonders | $54.99 | $4.40 | $13.75 | $0.07 | $0.66 |
 * | 7 Wonders Duel | $49.99 | $4.00 | $12.50 | $0.07 | $0.60 |
 * | Wingspan | $69.99 | $5.60 | $17.50 | $0.09 | $0.84 |
 * | Terraforming Mars | $64.99 | $5.20 | $16.25 | $0.09 | $0.78 |
 * | Spirit Island | $79.99 | $6.40 | $20.00 | $0.11 | $0.96 |
 * 
 * The pricing strategy is transparent and scales with game value.
 * Customers know exactly what they're paying and why.
 */

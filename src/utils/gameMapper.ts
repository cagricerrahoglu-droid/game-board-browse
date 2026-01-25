import { GameCardProps } from "@/components/GameCard";

// Game image mapping - maps game names to their image URLs
const gameImageMap: Record<string, string> = {
  // Strategy Games
  "catan": "https://cf.geekdo-images.com/W3Bsga_uLP9kO91gZ7H8yw__imagepage/img/M_3Vg1j2HlNgkv7PL2xl2BJE2bw=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2419375.jpg",
  "ticket to ride": "https://upload.wikimedia.org/wikipedia/en/9/92/Ticket_to_Ride_Board_Game_Box_EN.jpg",
  "wingspan": "https://cf.geekdo-images.com/yLZJCVLlIx4c7eJEWUNJ7w__imagepage/img/uIjeoKgHMcRtzRSR4MoUYl3nXxs=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4458123.jpg",
  "terraforming mars": "https://cf.geekdo-images.com/wg9oOLcsKvDesSUdZQ4rxw__imagepage/img/FS1RE8Ue6nk1pNbPI3l-OSapQGc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3536616.jpg",
  "7 wonders": "https://cf.geekdo-images.com/RvFVTEpnbb4NM7k0IF8V7A__imagepage/img/zruHYxY2_jx-796WgsDj7hitidQ=/fit-in/900x600/filters:no_upscale():strip_icc()/pic860217.jpg",
  
  // Family Games
  "azul": "https://cf.geekdo-images.com/aPSHJO0d0XOpQR5X-wJonw__imagepage/img/q4uWd2nXGeEkKDR8Cc3NhXG9PEU=/fit-in/900x600/filters:no_upscale():strip_icc()/pic6973671.png",
  "splendor": "https://cf.geekdo-images.com/rwOMxx4q5yuElIvo-1-OFw__imagepage/img/F-k-1VKg8WvH4u2PQb69J1Pf_R4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1904079.jpg",
  "kingdomino": "https://cf.geekdo-images.com/3h9W8BfB_rltQ48EBmHliw__imagepage/img/ZHunRsgDhrXyg5KyXuOk4PUTR9c=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3132685.png",
  "sushi go": "https://cf.geekdo-images.com/1Ysm7lV5c3Bd9ijEh4cBew__imagepage/img/bv8eqA0i9YrknrRrjyZJLSTIJxM=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2608923.png",
  "dixit": "https://cf.geekdo-images.com/7oep8p7gUHHuFlxIRHamlQ__imagepage/img/lsZ3b85zYNGuxR6j4NV5XcBrQvc=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4458123.jpg",
  
  // 2-Player Games
  "7 wonders duel": "https://cf.geekdo-images.com/zdagMskTF7wJBPjX74XsRw__imagepage/img/HUzGow0P8NjeqzEpLCxLXbhCFLg=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2576399.jpg",
  "patchwork": "https://cf.geekdo-images.com/wLW7pFn0--20lEizEz5p3A__imagepage/img/eR-EaSRw5jJ9NBxPc7Fq8LZp_OQ=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2270442.jpg",
  "jaipur": "https://cf.geekdo-images.com/qlno0r3hf68mStxPFLhyXA__imagepage/img/qwE-hKfMHN-mA8NJTHJAqk1fRtE=/fit-in/900x600/filters:no_upscale():strip_icc()/pic725500.jpg",
  
  // Party Games
  "codenames": "https://cf.geekdo-images.com/F_KDEu0GjdClml8N7c8Imw__imagepage/img/rc_Do8f5v41nWEGcwHE1eKAkIfI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2582929.jpg",
  "wavelength": "https://cf.geekdo-images.com/j0KlrLixZ0LJmfKIuMxkZw__imagepage/img/vpRZl-8hf_WnbBYlN5gBQMO7eTY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5000520.jpg",
  "just one": "https://cf.geekdo-images.com/JEr1RPW-e4eA5V5qhqy4Kg__imagepage/img/zvwz0aeJZqALQcazlXLnTCNCRfI=/fit-in/900x600/filters:no_upscale():strip_icc()/pic4649434.jpg",
  "telestrations": "https://cf.geekdo-images.com/KLDb0vR3w8mfaLgIwPV26w__imagepage/img/9Qzr4w8vVdL_cVrJ77ZqRNEMftY=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2523100.jpg",
  "the resistance": "https://cf.geekdo-images.com/7XVaIKQqLq7j4aVZbQljxA__imagepage/img/fYVH21N37iXH0D_6xLLQhqS8PF0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1903162.jpg",
  
  // Cooperative Games
  "pandemic": "https://cf.geekdo-images.com/cTrAWasNHyKMcNs8Zrv5O7sKS6M=/fit-in/246x300/pic1534148.jpg",
  "spirit island": "https://cf.geekdo-images.com/PbDxWEIqU9nDfY5_GDdQMQ__imagepage/img/0w55qyHIKDSVmsTkXnQOTxOvq_4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3615739.png",
  "the crew": "https://cf.geekdo-images.com/98LnQShydr11OBKS46xY-Q__imagepage/img/etVRTXdF6IDsnGKQe_GeQGXZOxo=/fit-in/900x600/filters:no_upscale():strip_icc()/pic5687013.jpg",
  "hanabi": "https://cf.geekdo-images.com/W7N2s-_rrJyPVs3dqG3nVg__imagepage/img/v1ZM_S_Vkx3lEgXVZQR2HVl74T8=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2007346.jpg",
  "mysterium": "https://cf.geekdo-images.com/lJB_J-tHHgIH4u0YEe4fHQ__imagepage/img/n1kM_UrD8Q5TyYpC6h7sKJUEyJ0=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2601683.jpg",
  
  // Beginner Games
  "monopoly": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Monopoly_pack_logo.png/800px-Monopoly_pack_logo.png",
  "scrabble": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Scrabble_logo.svg/1200px-Scrabble_logo.svg.png",
  "uno": "https://cf.geekdo-images.com/nGOYNLwFrvpqz5rg_7aY4w__imagepage/img/k1rrYS9eVJ7C1wV3i_l-Nlq5eY4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic7331545.jpg",
  "dobble": "https://cf.geekdo-images.com/i5JhPNBvHGfMwz5BKxv2cQ__imagepage/img/OdFLUxr1xQaM-O2m_fCGO0vQQcg=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1903162.jpg",
  "exploding kittens": "https://cf.geekdo-images.com/N8bL53-PHWlfDmTHx6OWHg__imagepage/img/JSMF4hN7k9IqN_zZN_yTz0tQzys=/fit-in/900x600/filters:no_upscale():strip_icc()/pic2691976.png",
  "codenames duet": "https://cf.geekdo-images.com/ic3gaBYQKhd6fI2Pn1XHZA__imagepage/img/wvFDKyaVlbfvjZJHfAKnvP5eMr4=/fit-in/900x600/filters:no_upscale():strip_icc()/pic3658966.jpg",
  "star realms": "https://cf.geekdo-images.com/L1O8FNLyBv-8mM3TDJlBow__imagepage/img/WtLy3ZXEp3U8RaB2IjsRIlQkDto=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1903162.jpg",
  "love letter": "https://cf.geekdo-images.com/T1ltXwapFUtghS9A7_tf4g__imagepage/img/00Z2dXYwYmGmOWJdAMnXaRHg1H8=/fit-in/900x600/filters:no_upscale():strip_icc()/pic1401448.jpg",
};

// Default placeholder image
const DEFAULT_IMAGE = "https://cf.geekdo-images.com/camo/3f66f2b2c8f3beb0c67a43f31d5d8c9a1e7ec4c7/68747470733a2f2f692e696d6775722e636f6d2f36633158764b492e706e67";

// Helper to get image URL by game name
const getGameImage = (gameName: string): string => {
  const normalizedName = gameName.toLowerCase().trim();
  return gameImageMap[normalizedName] || DEFAULT_IMAGE;
};

// Helper to map condition to difficulty
const conditionToDifficulty = (condition?: string): "Easy" | "Medium" | "Hard" => {
  if (!condition) return "Medium";
  const lower = condition.toLowerCase();
  if (lower.includes("excellent") || lower.includes("new")) return "Easy";
  if (lower.includes("good") || lower.includes("very good")) return "Medium";
  return "Hard";
};

// Mock pricing based on game playtime
const calculateMockPrice = (playtimeMinutes?: number): number => {
  if (!playtimeMinutes || playtimeMinutes < 30) return 4.99;
  if (playtimeMinutes < 60) return 6.99;
  if (playtimeMinutes < 120) return 8.99;
  return 10.99;
};

// Backend game interface
interface BackendGame {
  game_id: string;
  name: string;
  description?: string;
  category?: string;
  owner_id: string;
  min_players: number;
  max_players: number;
  estimated_playtime_minutes: number;
  condition?: string;
  available: boolean;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Map backend game to frontend GameCardProps
export const mapBackendGameToFrontend = (backendGame: BackendGame): GameCardProps => {
  const playersRange = backendGame.min_players === backendGame.max_players
    ? `${backendGame.min_players}`
    : `${backendGame.min_players}-${backendGame.max_players}`;

  const playtime = backendGame.estimated_playtime_minutes;
  const durationRange = playtime < 60
    ? `${playtime}`
    : `${Math.floor(playtime / 60) * 60}-${Math.ceil(playtime / 60) * 60}`;

  return {
    id: backendGame.game_id,
    title: backendGame.name,
    imageUrl: backendGame.image_url || getGameImage(backendGame.name),
    players: playersRange,
    duration: durationRange,
    difficulty: conditionToDifficulty(backendGame.condition),
    rating: 4.0 + Math.random() * 0.9, // Mock rating between 4.0-4.9
    availability: backendGame.available ? "available" : "unavailable",
    monthlyPrice: calculateMockPrice(backendGame.estimated_playtime_minutes),
    description: backendGame.description || `A fun board game for ${playersRange} players.`,
  };
};

// Group games by category
export const groupGamesByCategory = (games: GameCardProps[]): Record<string, GameCardProps[]> => {
  const grouped: Record<string, GameCardProps[]> = {};
  
  games.forEach(game => {
    // Find original backend game to get category - we'll need to pass this through
    // For now, we'll use a simple heuristic based on game properties
    let category = "Other";
    
    // You can customize this logic based on your needs
    const name = game.title.toLowerCase();
    
    if (name.includes("strategy") || ["catan", "wingspan", "terraforming mars", "7 wonders"].some(s => name.includes(s))) {
      category = "Strategy";
    } else if (name.includes("family") || ["azul", "splendor", "kingdomino", "sushi go", "dixit"].some(s => name.includes(s))) {
      category = "Family";
    } else if (["7 wonders duel", "patchwork", "jaipur"].some(s => name.includes(s))) {
      category = "2-Player";
    } else if (["codenames", "wavelength", "just one", "telestrations", "resistance"].some(s => name.includes(s))) {
      category = "Party";
    } else if (["pandemic", "spirit island", "the crew", "hanabi", "mysterium"].some(s => name.includes(s))) {
      category = "Cooperative";
    } else if (["uno", "monopoly", "scrabble", "dobble", "exploding kittens"].some(s => name.includes(s))) {
      category = "Beginner";
    }
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(game);
  });
  
  // Sort each category: available first, then by rating
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => {
      if (a.availability === "available" && b.availability !== "available") return -1;
      if (a.availability !== "available" && b.availability === "available") return 1;
      return b.rating - a.rating;
    });
  });
  
  return grouped;
};

// Enhanced version that uses backend category if available
export const mapBackendGameToFrontendWithCategory = (backendGame: BackendGame & { category?: string }): GameCardProps & { category: string } => {
  const frontendGame = mapBackendGameToFrontend(backendGame);
  return {
    ...frontendGame,
    category: backendGame.category || "Other"
  };
};

export const groupGamesByBackendCategory = (gamesWithCategories: Array<GameCardProps & { category: string }>): Record<string, GameCardProps[]> => {
  const grouped: Record<string, GameCardProps[]> = {};
  
  gamesWithCategories.forEach(game => {
    const category = game.category || "Other";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(game);
  });
  
  // Sort each category: available first, then by rating
  Object.keys(grouped).forEach(category => {
    grouped[category].sort((a, b) => {
      if (a.availability === "available" && b.availability !== "available") return -1;
      if (a.availability !== "available" && b.availability === "available") return 1;
      return b.rating - a.rating;
    });
  });
  
  return grouped;
};

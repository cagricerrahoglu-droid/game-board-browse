import { ActiveRental, RentalState, RentalPhase, RentalRole } from "@/types/rental";
import { API } from "@/services/api";

// Backend rental interface based on the DynamoDB schema
interface BackendRental {
  rental_id: string;
  created_at: string;
  renter_id: string;
  lender_id: string;
  game_id: string;
  game_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
  deposit_amount: number;
  notes?: string;
  updated_at?: string;
}

// Cache for game images and user data to avoid repeated API calls
const gameImageCache: Record<string, string> = {};
const userNameCache: Record<string, string> = {};

// Default avatar placeholder
const DEFAULT_AVATAR = "https://api.dicebear.com/7.x/bottts/svg?seed=";

// Map backend status to frontend rental state and phase
const mapStatusToStateAndPhase = (
  backendStatus: string,
  role: RentalRole,
  startDate: Date,
  endDate: Date
): { state: RentalState; phase: RentalPhase; requiresAction: boolean; actionDeadline?: Date } => {
  const now = new Date();
  const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  // If rental is completed or cancelled
  if (backendStatus === 'completed') {
    return {
      state: 'completed',
      phase: 'return',
      requiresAction: false
    };
  }
  
  if (backendStatus === 'cancelled') {
    return {
      state: 'rejected_or_expired',
      phase: 'rent',
      requiresAction: false
    };
  }
  
  // For active rentals, determine state based on timeline and role
  const rentalStarted = now >= startDate;
  
  if (!rentalStarted) {
    // Rental hasn't started yet - in rent phase
    if (role === 'lender') {
      return {
        state: 'awaiting_lender_response',
        phase: 'rent',
        requiresAction: true,
        actionDeadline: new Date(startDate.getTime() - 24 * 60 * 60 * 1000) // 1 day before start
      };
    } else {
      return {
        state: 'request_sent',
        phase: 'rent',
        requiresAction: false
      };
    }
  }
  
  // Rental is active
  if (daysUntilEnd > 7) {
    // Normal play state
    return {
      state: 'active_play',
      phase: 'play',
      requiresAction: false
    };
  } else if (daysUntilEnd > 0) {
    // Approaching end date - decision window for renter
    if (role === 'renter') {
      return {
        state: 'decision_window',
        phase: 'play',
        requiresAction: true,
        actionDeadline: endDate
      };
    } else {
      return {
        state: 'active_play',
        phase: 'play',
        requiresAction: false
      };
    }
  } else {
    // Past end date - should be returned
    if (role === 'renter') {
      return {
        state: 'return_pending',
        phase: 'return',
        requiresAction: true,
        actionDeadline: new Date(endDate.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 day grace period
      };
    } else {
      return {
        state: 'grace_period',
        phase: 'return',
        requiresAction: false
      };
    }
  }
};

// Get game cover image from games API
const getGameCoverUrl = async (gameId: string, gameName: string): Promise<string> => {
  // Check cache first
  if (gameImageCache[gameId]) {
    return gameImageCache[gameId];
  }

  try {
    // Try to fetch from games API
    const game = await API.getGame(gameId);
    if (game && game.image_url) {
      gameImageCache[gameId] = game.image_url;
      return game.image_url;
    }
  } catch (error) {
    console.log(`Could not fetch game image for ${gameId}`);
  }

  // Fallback to placeholder
  const placeholder = `https://api.dicebear.com/7.x/shapes/svg?seed=${gameId}`;
  gameImageCache[gameId] = placeholder;
  return placeholder;
};

// Get user name from API
const getUserName = async (userId: string): Promise<string> => {
  // Check cache first
  if (userNameCache[userId]) {
    return userNameCache[userId];
  }

  try {
    // Try to fetch from users API
    const user = await API.getUser(userId);
    if (user && user.email) {
      // Use email as name for now - could be enhanced with actual name field
      const name = user.email.split('@')[0];
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
      userNameCache[userId] = formattedName;
      return formattedName;
    }
  } catch (error) {
    console.log(`Could not fetch user name for ${userId}`);
  }

  // Fallback to ID substring
  const fallback = `User ${userId.substring(0, 8)}`;
  userNameCache[userId] = fallback;
  return fallback;
};

/**
 * Map backend rental data to frontend ActiveRental format (synchronous)
 * Uses placeholders for game images and user names
 */
export const mapBackendRentalToFrontend = (
  backendRental: BackendRental,
  currentUserId: string,
  role: RentalRole
): ActiveRental => {
  const startDate = new Date(backendRental.start_date);
  const endDate = new Date(backendRental.end_date);
  
  const counterpartyId = role === 'renter' 
    ? backendRental.lender_id 
    : backendRental.renter_id;
  
  const { state, phase, requiresAction, actionDeadline } = mapStatusToStateAndPhase(
    backendRental.status,
    role,
    startDate,
    endDate
  );
  
  // Calculate monthly price from deposit (simplified)
  const monthlyPrice = backendRental.deposit_amount || 9.99;
  
  return {
    id: backendRental.rental_id,
    gameId: backendRental.game_id,
    gameTitle: backendRental.game_name,
    gameCover: `https://api.dicebear.com/7.x/shapes/svg?seed=${backendRental.game_id}`,
    role,
    state,
    phase,
    counterparty: {
      id: counterpartyId,
      name: `User ${counterpartyId.substring(0, 8)}`,
      avatar: `${DEFAULT_AVATAR}${counterpartyId}`
    },
    startDate,
    endDate,
    actionDeadline,
    requiresAction,
    monthlyPrice
  };
};

/**
 * Map backend rental data to frontend ActiveRental format (async with API enrichment)
 * Fetches real game images and user names from APIs
 */
export const mapBackendRentalToFrontendAsync = async (
  backendRental: BackendRental,
  currentUserId: string,
  role: RentalRole
): Promise<ActiveRental> => {
  const startDate = new Date(backendRental.start_date);
  const endDate = new Date(backendRental.end_date);
  
  const counterpartyId = role === 'renter' 
    ? backendRental.lender_id 
    : backendRental.renter_id;
  
  const { state, phase, requiresAction, actionDeadline } = mapStatusToStateAndPhase(
    backendRental.status,
    role,
    startDate,
    endDate
  );
  
  // Calculate monthly price from deposit (simplified)
  const monthlyPrice = backendRental.deposit_amount || 9.99;

  // Fetch game cover and user name in parallel
  const [gameCover, counterpartyName] = await Promise.all([
    getGameCoverUrl(backendRental.game_id, backendRental.game_name),
    getUserName(counterpartyId)
  ]);
  
  return {
    id: backendRental.rental_id,
    gameId: backendRental.game_id,
    gameTitle: backendRental.game_name,
    gameCover,
    role,
    state,
    phase,
    counterparty: {
      id: counterpartyId,
      name: counterpartyName,
      avatar: `${DEFAULT_AVATAR}${counterpartyId}`
    },
    startDate,
    endDate,
    actionDeadline,
    requiresAction,
    monthlyPrice
  };
};

/**
 * Map multiple backend rentals to frontend format (synchronous)
 */
export const mapBackendRentalsToFrontend = (
  backendRentals: BackendRental[],
  currentUserId: string
): ActiveRental[] => {
  return backendRentals
    .filter(rental => rental.status !== 'cancelled')
    .map(rental => {
      const role: RentalRole = rental.renter_id === currentUserId ? 'renter' : 'lender';
      return mapBackendRentalToFrontend(rental, currentUserId, role);
    });
};

/**
 * Map multiple backend rentals to frontend format (async with enrichment)
 */
export const mapBackendRentalsToFrontendAsync = async (
  backendRentals: BackendRental[],
  currentUserId: string
): Promise<ActiveRental[]> => {
  const filtered = backendRentals.filter(rental => rental.status !== 'cancelled');
  
  const promises = filtered.map(rental => {
    const role: RentalRole = rental.renter_id === currentUserId ? 'renter' : 'lender';
    return mapBackendRentalToFrontendAsync(rental, currentUserId, role);
  });

  return Promise.all(promises);
};

/**
 * Map frontend rental state back to backend status for updates
 */
export const mapFrontendStateToBackendStatus = (
  state: RentalState
): 'active' | 'completed' | 'cancelled' => {
  // Completed states
  if (state === 'completed') {
    return 'completed';
  }
  
  // Cancelled states
  if (state === 'rejected_or_expired') {
    return 'cancelled';
  }
  
  // All other states are active
  return 'active';
};

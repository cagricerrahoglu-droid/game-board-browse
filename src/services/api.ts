// API configuration and utilities for frontend-lovable
const API_BASE = 'https://j27adi1rw0.execute-api.eu-west-1.amazonaws.com/dev';
const AUTH_URL = 'https://szpvn43yd9.execute-api.eu-west-1.amazonaws.com/dev/auth';

// Helper to handle fetch errors
const handleFetchError = async (response: Response, endpoint: string, action: string) => {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    console.error(`API Error [${endpoint}/${action}]:`, response.status, errorData);
    const error = new Error(errorData.error || `Request failed: ${response.status}`);
    (error as any).status = response.status;
    (error as any).data = errorData;
    throw error;
  }
  
  try {
    const data = await response.json();
    console.log(`API Response [${endpoint}/${action}]:`, data);
    return data;
  } catch (err) {
    console.error(`Failed to parse JSON response [${endpoint}/${action}]:`, err);
    throw new Error('Invalid response from server');
  }
};

export const API = {
  // Authentication
  async signup(email: string, password: string, roles: string[] = ['renter']) {
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signup', email, password, roles })
      });
      return await handleFetchError(response, AUTH_URL, 'signup');
    } catch (err) {
      console.error('Signup error:', err);
      throw err;
    }
  },

  async signin(email: string, password: string) {
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'signin', email, password })
      });
      const data = await handleFetchError(response, AUTH_URL, 'signin');
      console.log('Full signin response:', data);
      
      if ((data as any).token) {
        // Try different possible user ID fields from the response
        const userId = (data as any).user_id || (data as any).userId || (data as any).sub || email;
        console.log('Extracted user ID:', userId);
        
        localStorage.setItem('switchboard_token', (data as any).token);
        localStorage.setItem('switchboard_refresh_token', (data as any).refreshToken || '');
        localStorage.setItem('switchboard_user_id', userId);
        localStorage.setItem('switchboard_user_email', email);
      }
      return data;
    } catch (err) {
      console.error('Signin error:', err);
      throw err;
    }
  },

  async confirm(email: string, code: string) {
    try {
      const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'confirm', email, code })
      });
      return await handleFetchError(response, AUTH_URL, 'confirm');
    } catch (err) {
      console.error('Confirm error:', err);
      throw err;
    }
  },

  // Helper for authenticated requests
  async request(endpoint: string, action: string, data: any = {}) {
    const token = localStorage.getItem('switchboard_token');
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const url = `${API_BASE}${endpoint}`;
      const body = JSON.stringify({ action, ...data });
      
      console.log(`Making request to: ${url}`);
      console.log(`Token: ${token.substring(0, 20)}...`);
      console.log(`Body:`, body);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.status === 401) {
        console.error('Token expired or invalid');
        localStorage.removeItem('switchboard_token');
        localStorage.removeItem('switchboard_refresh_token');
        localStorage.removeItem('switchboard_user_id');
        localStorage.removeItem('switchboard_user_email');
        throw new Error('Token expired. Please sign in again.');
      }

      return await handleFetchError(response, endpoint, action);
    } catch (err) {
      console.error(`API request error (${endpoint}/${action}):`, err);
      if ((err as any).name === 'AbortError') {
        throw new Error('Request timeout - API server may be down');
      }
      throw err;
    }
  },

  // Games endpoints
  async listGames() {
    return this.request('/games', 'list');
  },

  async getGame(game_id: string) {
    return this.request('/games', 'get', { game_id });
  },

  async getGamesByOwner(user_id: string) {
    return this.request('/games', 'get_by_owner', { owner_id: user_id });
  },

  async checkGameAvailability(catalog_game_id: string) {
    try {
      const allGames = await this.listGames();
      // Filter games by catalog_game_id and check if any are available
      const matchingGames = allGames.filter((game: any) => 
        game.catalog_game_id === catalog_game_id && game.available === true
      );
      return {
        available: matchingGames.length > 0,
        availableCount: matchingGames.length,
        games: matchingGames
      };
    } catch (err) {
      console.error('Check game availability error:', err);
      // If we can't check, assume unavailable for safety
      return {
        available: false,
        availableCount: 0,
        games: []
      };
    }
  },

  // Catalog Games endpoints (no auth required for browsing)
  async listCatalogGames() {
    try {
      const url = `${API_BASE}/catalog-games`;
      console.log(`Fetching catalog games from: ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return await handleFetchError(response, 'catalog-games', 'list');
    } catch (err) {
      console.error('List catalog games error:', err);
      if ((err as any).name === 'AbortError') {
        throw new Error('Request timeout - API server may be down');
      }
      throw err;
    }
  },

  async getCatalogGame(catalog_game_id: string) {
    try {
      const url = `${API_BASE}/catalog-games`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get', catalog_game_id })
      });
      return await handleFetchError(response, 'catalog-games', 'get');
    } catch (err) {
      console.error('Get catalog game error:', err);
      throw err;
    }
  },

  async searchCatalogGames(name: string) {
    try {
      const url = `${API_BASE}/catalog-games`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'search', name })
      });
      return await handleFetchError(response, 'catalog-games', 'search');
    } catch (err) {
      console.error('Search catalog games error:', err);
      throw err;
    }
  },

  async listCatalogGamesByCategory(category: string) {
    try {
      const url = `${API_BASE}/catalog-games`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list_by_category', category })
      });
      return await handleFetchError(response, 'catalog-games', 'list_by_category');
    } catch (err) {
      console.error('List catalog games by category error:', err);
      throw err;
    }
  },

  async createGame(gameData: any) {
    return this.request('/games', 'create', gameData);
  },

  async updateGame(game_id: string, gameData: any) {
    return this.request('/games', 'update', { game_id, ...gameData });
  },

  async deleteGame(game_id: string) {
    return this.request('/games', 'delete', { game_id });
  },

  // Rentals endpoints
  async listRentals() {
    return this.request('/rentals', 'list');
  },

  async getRental(rental_id: string) {
    return this.request('/rentals', 'get', { rental_id });
  },

  async getRentalsByRenter(renter_id: string) {
    return this.request('/rentals', 'get_by_renter', { renter_id });
  },

  async getRentalsByLender(lender_id: string) {
    return this.request('/rentals', 'get_by_lender', { lender_id });
  },

  async getRentalsByGame(game_id: string) {
    return this.request('/rentals', 'get_by_game', { game_id });
  },

  async createRental(rentalData: any) {
    return this.request('/rentals', 'create', rentalData);
  },

  async updateRental(rental_id: string, rentalData: any) {
    return this.request('/rentals', 'update', { rental_id, ...rentalData });
  },

  async deleteRental(rental_id: string) {
    return this.request('/rentals', 'delete', { rental_id });
  },

  // Users endpoint
  async getUser(user_id: string) {
    return this.request('/users', 'get', { user_id });
  },

  async getUserByEmail(email: string) {
    return this.request('/users', 'get_by_email', { email });
  },

  async updateUser(user_id: string, userData: any) {
    return this.request('/users', 'update', { user_id, ...userData });
  },

  async createUser(userData: any) {
    return this.request('/users', 'create', userData);
  },

  // Rating methods
  async getUserRating(user_id: string) {
    const userData = await this.getUser(user_id);
    return {
      averageRating: userData.rating || 5.0,
      totalRatings: userData.total_ratings || 0
    };
  },

  async submitRenterRating(renter_id: string, rating: number) {
    // Get current rating data
    const userData = await this.getUser(renter_id);
    const currentRating = userData.rating || 5.0;
    const currentTotal = userData.total_ratings || 0;
    
    // Calculate new average
    const newTotal = currentTotal + 1;
    const newAverage = ((currentRating * currentTotal) + rating) / newTotal;
    
    // Update user with new rating
    return this.updateUser(renter_id, {
      rating: newAverage,
      total_ratings: newTotal
    });
  },

  // Utility
  isAuthenticated() {
    return !!localStorage.getItem('switchboard_token');
  },

  getCurrentUserId() {
    return localStorage.getItem('switchboard_user_id');
  },

  getCurrentUserEmail() {
    return localStorage.getItem('switchboard_user_email');
  },

  logout() {
    localStorage.removeItem('switchboard_token');
    localStorage.removeItem('switchboard_refresh_token');
    localStorage.removeItem('switchboard_user_id');
    localStorage.removeItem('switchboard_user_email');
  }
};

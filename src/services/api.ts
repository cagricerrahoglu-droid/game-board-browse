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
      if ((data as any).token) {
        localStorage.setItem('switchboard_token', (data as any).token);
        localStorage.setItem('switchboard_refresh_token', (data as any).refreshToken || '');
        localStorage.setItem('switchboard_user_id', (data as any).user_id || '');
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

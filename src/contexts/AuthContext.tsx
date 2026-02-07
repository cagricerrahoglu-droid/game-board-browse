import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { API } from "@/services/api";

interface User {
  id: string;
  email: string;
  roles: string[];
  name?: string;
  avatar?: string;
  preferences?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
    };
  };
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  isLoading: boolean;
  selectedRole: string;
  login: (email: string, password: string, selectedRole?: string) => Promise<void>;
  signup: (email: string, password: string, roles?: string[]) => Promise<void>;
  confirm: (email: string, code: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: string) => void;
  updateUserProfile: (updates: Partial<User>) => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('renter');

  // Fetch user profile from backend
  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const userData = await API.getUser(userId);
      
      if (userData && userData.user_id) {
        const roles = userData.roles || JSON.parse(localStorage.getItem('switchboard_user_roles') || '["renter", "lender"]');
        
        setUser({
          id: userData.user_id,
          email: userData.email || email,
          roles: roles,
          name: userData.name,
          avatar: userData.avatar,
          preferences: userData.preferences || {}
        });
        
        // Update localStorage with fetched data
        localStorage.setItem('switchboard_user_roles', JSON.stringify(roles));
        if (userData.name) {
          localStorage.setItem('switchboard_user_name', userData.name);
        }
        if (userData.avatar) {
          localStorage.setItem('switchboard_user_avatar', userData.avatar);
        }
      } else {
        // User exists but no data, create minimal profile
        console.log('User data not found, using minimal profile');
        const roles = JSON.parse(localStorage.getItem('switchboard_user_roles') || '["renter", "lender"]');
        setUser({
          id: userId,
          email: email,
          roles: roles,
          name: undefined,
          avatar: undefined,
          preferences: {}
        });
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      // Fall back to basic user data from localStorage
      const roles = JSON.parse(localStorage.getItem('switchboard_user_roles') || '["renter", "lender"]');
      setUser({
        id: userId,
        email: email,
        roles: roles,
        name: undefined,
        avatar: undefined,
        preferences: {}
      });
    }
  };

  // Check if user is already logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('switchboard_token');
      const userId = localStorage.getItem('switchboard_user_id');
      const email = localStorage.getItem('switchboard_user_email');
      const storedRole = localStorage.getItem('switchboard_selected_role') || 'renter';
      
      if (token && userId && email) {
        setSelectedRole(storedRole);
        setIsLoggedIn(true);
        
        // Fetch full user profile from backend
        await fetchUserProfile(userId, email);
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string, role: string = 'renter') => {
    setIsLoading(true);
    try {
      const response = await API.signin(email, password);
      
      // Get the user_id that was just stored in localStorage by the signin method
      const userId = localStorage.getItem('switchboard_user_id') || email;
      
      // Fetch full user profile
      await fetchUserProfile(userId, email);
      
      setSelectedRole(role);
      localStorage.setItem('switchboard_selected_role', role);
      setIsLoggedIn(true);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, roles: string[] = ['renter']) => {
    setIsLoading(true);
    try {
      await API.signup(email, password, roles);
      // Don't set user yet - wait for confirmation
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const confirm = async (email: string, code: string) => {
    setIsLoading(true);
    try {
      await API.confirm(email, code);
      // After confirmation, user should sign in
    } catch (error) {
      console.error('Confirmation failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    API.logout();
    setUser(null);
    setIsLoggedIn(false);
    setSelectedRole('renter');
    localStorage.removeItem('switchboard_selected_role');
    localStorage.removeItem('switchboard_user_roles');
    localStorage.removeItem('switchboard_user_name');
    localStorage.removeItem('switchboard_user_avatar');
  };

  const switchRole = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem('switchboard_selected_role', role);
  };

  const updateUserProfile = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      // Update backend
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.avatar !== undefined) updateData.avatar = updates.avatar;
      if (updates.preferences !== undefined) updateData.preferences = updates.preferences;

      await API.updateUser(user.id, updateData);

      // Update local state
      setUser(prev => prev ? { ...prev, ...updates } : null);

      // Update localStorage
      if (updates.name) localStorage.setItem('switchboard_user_name', updates.name);
      if (updates.avatar) localStorage.setItem('switchboard_user_avatar', updates.avatar);
    } catch (error) {
      console.error('Failed to update user profile:', error);
      throw error;
    }
  };

  const refetchUser = async () => {
    if (user) {
      await fetchUserProfile(user.id, user.email);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isLoggedIn, 
        user, 
        isLoading, 
        selectedRole, 
        login, 
        signup, 
        confirm, 
        logout, 
        switchRole,
        updateUserProfile,
        refetchUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

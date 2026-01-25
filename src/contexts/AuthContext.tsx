import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { API } from "@/services/api";

interface User {
  id: string;
  email: string;
  roles: string[];
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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<string>('renter');

  // Check if user is already logged in on mount
  useEffect(() => {
    const token = localStorage.getItem('switchboard_token');
    const userId = localStorage.getItem('switchboard_user_id');
    const email = localStorage.getItem('switchboard_user_email');
    const storedRole = localStorage.getItem('switchboard_selected_role') || 'renter';
    
    if (token && userId && email) {
      // All users have both roles by default
      const roles = JSON.parse(localStorage.getItem('switchboard_user_roles') || '["renter", "lender"]');
      setUser({
        id: userId,
        email: email,
        roles: roles
      });
      setSelectedRole(storedRole);
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string, role: string = 'renter') => {
    setIsLoading(true);
    try {
      const response = await API.signin(email, password);
      
      // Get the user_id that was just stored in localStorage by the signin method
      const userId = localStorage.getItem('switchboard_user_id') || email;
      
      // All users have both roles
      const roles = (response as any).roles || ['renter', 'lender'];
      localStorage.setItem('switchboard_user_roles', JSON.stringify(roles));
      
      setUser({
        id: userId,
        email: email,
        roles: roles
      });
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
  };

  const switchRole = (role: string) => {
    setSelectedRole(role);
    localStorage.setItem('switchboard_selected_role', role);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, isLoading, selectedRole, login, signup, confirm, logout, switchRole }}>
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

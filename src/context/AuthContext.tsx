import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authAPI } from '../services/api';
import type { User } from '../types';

// ============ Types ============

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string; address?: { street: string; city: string; country: string } }) => Promise<void>;
}

// ============ Create Context ============

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============ Provider Component ============

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const response = await authAPI.getMe();
          setUser(response.data.data.user);
        } catch (error) {
          // Token is invalid or expired
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    loadUser();
  }, [token]);

  // Login
  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    const { token: newToken, data } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(data.user);
  };

  // Register
  const register = async (name: string, email: string, password: string) => {
    const response = await authAPI.register({ name, email, password });
    const { token: newToken, data } = response.data;

    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(data.user);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Update Profile
  const updateProfile = async (data: {
    name?: string;
    phone?: string;
    address?: { street: string; city: string; country: string };
  }) => {
    const response = await authAPI.updateProfile(data);
    setUser(response.data.data.user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ============ Custom Hook ============

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
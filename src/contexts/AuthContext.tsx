import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import { apiClient } from '../lib/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: { username?: string; email?: string; password: string }) => Promise<void>;
  register: (data: FormData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response: AuthResponse = await apiClient.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      console.log('Not authenticated');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { username?: string; email?: string; password: string }) => {
    try {
      const response: AuthResponse = await apiClient.login(credentials);
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const register = async (formData: FormData) => {
    try {
      const response: AuthResponse = await apiClient.register(formData);
      if (response.success) {
        setUser(response.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null); // Still clear user on frontend
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const refreshAuth = async () => {
    try {
      await apiClient.refreshToken();
      await checkAuthStatus();
    } catch (error) {
      console.error('Token refresh failed:', error);
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
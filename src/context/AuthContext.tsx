'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { fetchAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUser: () => {},
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialize from localStorage and verify session with backend
  useEffect(() => {
    async function initAuth() {
      try {
        const savedToken = localStorage.getItem('fixmate_token');
        const savedUserStr = localStorage.getItem('fixmate_user');

        if (savedToken) {
          setToken(savedToken);
          if (savedUserStr) {
            try {
              setUser(JSON.parse(savedUserStr));
            } catch (e) {
              // Ignore json parse error
            }
          }

          // Fetch fresh user profile from backend
          try {
            const res = await fetchAPI<{ success: boolean; user: User }>('/auth/me');
            if (res.success && res.user) {
              setUser(res.user);
              localStorage.setItem('fixmate_user', JSON.stringify(res.user));
            }
          } catch (err) {
            console.warn('Session verification notice: Using cached user credentials.');
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('fixmate_token', newToken);
    localStorage.setItem('fixmate_user', JSON.stringify(newUser));
    // Set cookie for Next.js routing/middleware
    document.cookie = `fixmate_token=${newToken}; path=/; max-age=604800; SameSite=Lax`;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fixmate_token');
    localStorage.removeItem('fixmate_user');
    document.cookie = 'fixmate_token=; path=/; max-age=0; SameSite=Lax';
  };

  const updateUser = (updatedFields: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('fixmate_user', JSON.stringify(next));
      return next;
    });
  };

  const refreshUser = async () => {
    try {
      const res = await fetchAPI<{ success: boolean; user: User }>('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem('fixmate_user', JSON.stringify(res.user));
      }
    } catch (e) {
      console.warn('Could not refresh user:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        updateUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

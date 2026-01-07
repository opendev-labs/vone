import React, { createContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { safeNavigate } from '../services/navigation';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

interface AuthContextType extends AuthState {
  login: (user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useLocalStorage<AuthState>('void_auth', {
    isAuthenticated: false,
    user: null
  });

  const login = useCallback((user: User) => {
    setAuth({ isAuthenticated: true, user });
    safeNavigate('/');
  }, [setAuth]);

  const logout = useCallback(() => {
    setAuth({ isAuthenticated: false, user: null });
    safeNavigate('/login');
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

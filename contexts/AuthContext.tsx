import React, { createContext, useCallback, useState, useEffect } from 'react';
import { safeNavigate } from '../services/navigation';
import { auth } from '../src/config/firebase';
import {
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  gitHubAccessToken: string | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  loginWithGitHub: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthState>({
    isAuthenticated: false,
    user: null, // Note: We might want to persist basic user info or trust onAuthStateChanged
    gitHubAccessToken: localStorage.getItem('void_github_token'),
    isLoading: true
  });

  // Listen for Firebase Auth state changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          user: {
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || ''
          },
          isLoading: false
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          user: null,
          isLoading: false
        }));
      }
    });
    return () => unsubscribe();
  }, []);

  const loginWithGitHub = useCallback(async () => {
    try {
      const provider = new GithubAuthProvider();
      // Request scopes for repo access
      provider.addScope('repo');
      provider.addScope('read:user');

      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;

      if (token) {
        localStorage.setItem('void_github_token', token);
        setAuthState(prev => ({ ...prev, gitHubAccessToken: token }));
      }

      // Navigation is handled by the auth state listener or UI response
      safeNavigate('/');
    } catch (error) {
      console.error("GitHub Login Error:", error);
      // Ideally execute a toast notification here
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    localStorage.removeItem('void_github_token');
    setAuthState(prev => ({ ...prev, gitHubAccessToken: null }));
    safeNavigate('/login');
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../lib/api.js';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log('AuthProvider rendering, user:', user, 'loading:', loading);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated first
      if (!apiService.isAuthenticated()) {
        setLoading(false);
        return;
      }

      const response = await apiService.getCurrentUser();
      console.log('AuthContext - getCurrentUser response:', response);
      if (response.success && response.data) {
        console.log('AuthContext - Setting user data:', response.data);
        setUser(response.data);
      } else {
        // If profile fetch fails, clear the token
        localStorage.removeItem('auth_token');
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (email, password, name) => {
    const response = await apiService.signup({ name, email, password });
    if (!response.success) {
      return { error: { message: response.error || 'Signup failed' } };
    }
    
    // If signup is successful, fetch the complete user profile with inquiries
    const userResponse = await apiService.getCurrentUser();
    if (userResponse.success && userResponse.data) {
      console.log('AuthContext - Signup user data (full profile):', userResponse.data);
      setUser(userResponse.data);
    } else {
      // Fallback to response data if getCurrentUser fails
      if (response.data) {
        console.log('AuthContext - Signup user data (fallback):', response.data);
        setUser(response.data);
      }
    }
    
    return { error: null };
  };

  const signIn = async (email, password) => {
    const response = await apiService.login({ email, password });
    if (!response.success) {
      return { error: { message: response.error || 'Login failed' } };
    }
    
    // If login is successful, fetch the complete user profile with inquiries
    const userResponse = await apiService.getCurrentUser();
    if (userResponse.success && userResponse.data) {
      console.log('AuthContext - Login user data (full profile):', userResponse.data);
      setUser(userResponse.data);
    } else {
      // Fallback to response data if getCurrentUser fails
      if (response.data) {
        console.log('AuthContext - Login user data (fallback):', response.data);
        setUser(response.data);
      }
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await apiService.logout();
    setUser(null);
  };

  const refreshUser = async () => {
    if (!apiService.isAuthenticated()) {
      setUser(null);
      return;
    }

    const response = await apiService.getCurrentUser();
    if (response.success && response.data) {
      console.log('AuthContext - Refreshed user data:', response.data);
      setUser(response.data);
      return response.data;
    } else {
      // If profile fetch fails, clear the token
      localStorage.removeItem('auth_token');
      setUser(null);
      return null;
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

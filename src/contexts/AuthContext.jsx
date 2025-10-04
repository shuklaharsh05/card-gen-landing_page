import { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../lib/api.js';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const response = await apiService.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signUp = async (email, password, name) => {
    const response = await apiService.signup({ email, password, name });
    if (!response.success) {
      return { error: { message: response.error || 'Signup failed' } };
    }
    
    // If signup is successful, set the user
    if (response.data) {
      setUser(response.data);
    }
    
    return { error: null };
  };

  const signIn = async (email, password) => {
    const response = await apiService.login({ email, password });
    if (!response.success) {
      return { error: { message: response.error || 'Login failed' } };
    }
    
    // If login is successful, set the user
    if (response.data) {
      setUser(response.data);
    }
    
    return { error: null };
  };

  const signOut = async () => {
    await apiService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

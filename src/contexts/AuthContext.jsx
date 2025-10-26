import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('careconnect_token');
    const userData = localStorage.getItem('careconnect_user');
    
    console.log('AuthContext: Checking auth state', { token: !!token, userData: !!userData });
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        console.log('AuthContext: User found in localStorage', parsedUser);
        // Optionally verify token with backend
        verifyToken();
      } catch (error) {
        console.error('AuthContext: Error parsing user data', error);
        localStorage.removeItem('careconnect_token');
        localStorage.removeItem('careconnect_user');
        setLoading(false);
      }
    } else {
      console.log('AuthContext: No user found, setting loading to false');
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      console.log('AuthContext: Verifying token with backend');
      const response = await authService.getProfile();
      console.log('AuthContext: Profile response', response);
      setUser(response.data);
    } catch (error) {
      console.error('AuthContext: Token verification failed', error);
      // If it's a network error, keep the user logged in locally
      if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
        console.log('AuthContext: Network error, keeping user logged in locally');
        // Keep the user logged in locally if it's just a network issue
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('careconnect_token');
        localStorage.removeItem('careconnect_user');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('careconnect_token', token);
        
        // Get user profile after successful login
        const profileResponse = await authService.getProfile();
        const userData = profileResponse.data;
        localStorage.setItem('careconnect_user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true };
      } else {
        return { 
          success: false, 
          error: response.message || 'Login failed' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.message || 'An error occurred during login' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.signup(userData);
      
      if (response.data && response.data.token) {
        const { token } = response.data;
        localStorage.setItem('careconnect_token', token);
        
        // Get user profile after successful signup
        const profileResponse = await authService.getProfile();
        const userData = profileResponse.data;
        localStorage.setItem('careconnect_user', JSON.stringify(userData));
        
        setUser(userData);
        return { success: true, message: response.message };
      } else {
        return { success: false, error: response.message || 'Signup failed' };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return { 
        success: false, 
        error: error.response?.data?.detail || error.response?.data?.message || 'An error occurred during signup' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('careconnect_token');
      localStorage.removeItem('careconnect_user');
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
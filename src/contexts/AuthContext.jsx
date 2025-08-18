import React, { createContext, useContext, useState, useEffect } from 'react';

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
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Dummy authentication - in real app, this would validate with backend
    if (email === 'test@email.com' && password === 'test1234') {
      const userData = {
        id: 1,
        name: 'Dr. Jennifer Martinez',
        email: 'doctor@careconnect.com',
        role: 'doctor'
      };
      
      const token = 'dummy_jwt_token_' + Date.now();
      
      localStorage.setItem('careconnect_token', token);
      localStorage.setItem('careconnect_user', JSON.stringify(userData));
      
      setUser(userData);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    localStorage.removeItem('careconnect_token');
    localStorage.removeItem('careconnect_user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 
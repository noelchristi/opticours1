import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * Authentication Context for OptiCours
 * Provides authentication state and methods across the application
 */
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is already authenticated on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('opticours_user');
    const token = localStorage.getItem('opticours_token');
    
    if (storedUser && token) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user data', err);
        localStorage.removeItem('opticours_user');
        localStorage.removeItem('opticours_token');
      }
    }
    
    setLoading(false);
  }, []);

  /**
   * Register a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} name - User name
   * @param {string} institution - User institution
   */
  const register = async (email, password, name, institution) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call
      // Simulating API response with localStorage for demo
      const newUser = {
        id: Date.now().toString(),
        email,
        name,
        institution,
        createdAt: new Date().toISOString()
      };
      
      // Save user in localStorage (simulating database)
      const users = JSON.parse(localStorage.getItem('opticours_users') || '[]');
      
      // Check if email is already registered
      if (users.some(user => user.email === email)) {
        throw new Error('Cet email est déjà utilisé');
      }
      
      // Add user with hashed password (in real app)
      users.push({ ...newUser, password }); // In production, never store passwords in plain text
      
      localStorage.setItem('opticours_users', JSON.stringify(users));
      
      // Generate JWT token (simulated)
      const token = `simulated_jwt_${Date.now()}`;
      
      // Store user session
      localStorage.setItem('opticours_user', JSON.stringify(newUser));
      localStorage.setItem('opticours_token', token);
      
      setCurrentUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login existing user
   * @param {string} email - User email
   * @param {string} password - User password
   */
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem('opticours_users') || '[]');
      const user = users.find(user => user.email === email && user.password === password);
      
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Remove sensitive data (password)
      const { password: _, ...userWithoutPassword } = user;
      
      // Generate JWT token (simulated)
      const token = `simulated_jwt_${Date.now()}`;
      
      // Store user session
      localStorage.setItem('opticours_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('opticours_token', token);
      
      setCurrentUser(userWithoutPassword);
      return userWithoutPassword;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout current user
   */
  const logout = () => {
    localStorage.removeItem('opticours_user');
    localStorage.removeItem('opticours_token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    loading,
    error,
    register,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
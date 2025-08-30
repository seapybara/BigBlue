// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

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
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      
      if (token && savedUser) {
        try {
          // Verify token is still valid
          const response = await authAPI.getMe();
          setUser(response.data.data);
          localStorage.setItem('user', JSON.stringify(response.data.data));
          
          // Load user's favorites
          const favoritesResponse = await authAPI.getFavorites();
          setFavorites(favoritesResponse.data.data || []);
        } catch (error) {
          console.error('Token validation failed:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authAPI.login({ email, password });
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      
      // Load user's favorites after login
      try {
        const favoritesResponse = await authAPI.getFavorites();
        setFavorites(favoritesResponse.data.data || []);
      } catch (error) {
        console.error('Failed to load favorites:', error);
      }
      
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setError(null);
    setFavorites([]);
  };

  const updateProfile = async (updates) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(updates);
      const updatedUser = response.data.data;
      
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.error || 'Update failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const addToFavorites = async (locationId) => {
    try {
      await authAPI.addToFavorites(locationId);
      const favoritesResponse = await authAPI.getFavorites();
      setFavorites(favoritesResponse.data.data || []);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to add to favorites';
      return { success: false, error: message };
    }
  };

  const removeFromFavorites = async (locationId) => {
    try {
      await authAPI.removeFromFavorites(locationId);
      setFavorites(prev => prev.filter(fav => fav._id !== locationId));
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to remove from favorites';
      return { success: false, error: message };
    }
  };

  const isFavorite = (locationId) => {
    return favorites.some(fav => fav._id === locationId);
  };

  const value = {
    user,
    loading,
    error,
    favorites,
    register,
    login,
    logout,
    updateProfile,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
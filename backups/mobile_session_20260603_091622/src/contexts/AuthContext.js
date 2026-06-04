import React, { createContext, useState, useCallback } from 'react';
import api, { setAuthToken } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load token from storage on app start
  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
        }
      } catch (e) {
        console.log('Failed to restore token:', e);
      }
    };

    bootstrapAsync();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setAuthToken(token);
      
      // Save token to storage
      await AsyncStorage.setItem('userToken', token);
      
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (fullName, email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/signup', {
        fullName,
        email,
        password,
        role,
      });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      setAuthToken(token);
      
      // Save token to storage
      await AsyncStorage.setItem('userToken', token);
      
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      setToken(null);
      setUser(null);
      setAuthToken(null);
      await AsyncStorage.removeItem('userToken');
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    signup,
    logout,
    isSignedIn: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import React, { createContext, useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import api, { setAuthToken } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [pushRegistered, setPushRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [initializing, setInitializing] = useState(true);

  const registerForPushNotificationsAsync = useCallback(async () => {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications require a physical device');
        setPushRegistered(false);
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token permission');
        setPushRegistered(false);
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const newPushToken = tokenData?.data;
      if (!newPushToken) {
        setPushRegistered(false);
        return null;
      }

      await AsyncStorage.setItem('pushToken', newPushToken);
      setPushToken(newPushToken);
      return newPushToken;
    } catch (err) {
      console.log('registerForPushNotificationsAsync error', err);
      setPushRegistered(false);
      return null;
    }
  }, []);

  const retryPushRegistration = useCallback(async () => {
    if (!token) {
      return false;
    }

    const newPush = await registerForPushNotificationsAsync();
    if (!newPush) {
      return false;
    }

    try {
      await api.post('/notifications/register-device', { token: newPush });
      setPushRegistered(true);
      return true;
    } catch (err) {
      console.log('Push registration service failed', err);
      setPushRegistered(false);
      return false;
    }
  }, [registerForPushNotificationsAsync, token]);

  React.useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('userToken');
        const savedUser = await AsyncStorage.getItem('userData');

        if (savedToken) {
          setToken(savedToken);
          setAuthToken(savedToken);
          // restore push token if saved
          try {
            const savedPush = await AsyncStorage.getItem('pushToken');
            if (savedPush) {
              setPushToken(savedPush);
              setPushRegistered(true);
            } else {
              await retryPushRegistration();
            }
          } catch (e) {
            console.log('Push registration (bootstrap) failed', e);
          }
        }

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.log('Failed to restore auth state:', e);
      } finally {
        setInitializing(false);
      }
    };

    bootstrapAsync();
  }, [retryPushRegistration]);

  // configure notification handling while app is mounted
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({ shouldShowAlert: true, shouldPlaySound: false, shouldSetBadge: false }),
    });

    const receivedListener = Notifications.addNotificationReceivedListener((notification) => {
      // handle foreground notification if needed
      console.log('Notification received', notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response', response);
      try {
        const title = response.notification.request.content.title;
        const body = response.notification.request.content.body;
        const data = response.notification.request.content.data || {};
        const Toast = require('react-native-toast-message');
        if (Toast && Toast.show) {
          Toast.show({ type: 'info', text1: title || 'Notification', text2: body });
        }

        if (data.type === 'attendance') {
          router.push('/attendance');
        } else if (data.type === 'marks') {
          router.push('/students');
        } else {
          router.push('/notifications');
        }
      } catch (tErr) {
        console.log('Notification response handling failed', tErr);
      }
    });

    return () => {
      receivedListener.remove();
      responseListener.remove();
    };
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
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // register device push token after successful login
      try {
        const success = await retryPushRegistration();
        if (!success) {
          setPushRegistered(false);
        }
      } catch (e) {
        console.log('Push registration (login) failed', e);
      }

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
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      // register device push token after signup
      try {
        const success = await retryPushRegistration();
        if (!success) {
          setPushRegistered(false);
        }
      } catch (e) {
        console.log('Push registration (signup) failed', e);
      }

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
      await AsyncStorage.removeItem('userData');
    } catch (err) {
      console.log('Logout error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const userRole = user?.role || null;
  const hasRole = useCallback(
    (...roles) => roles.includes(userRole),
    [userRole]
  );

  const value = {
    user,
    token,
    loading,
    initializing,
    error,
    login,
    signup,
    logout,
    isSignedIn: !!token,
    userRole,
    hasRole,
    canEditStudents: hasRole('admin', 'teacher'),
    canMarkAttendance: hasRole('admin', 'teacher'),
    canViewChildData: hasRole('parent'),
    pushToken,
    pushRegistered,
    retryPushRegistration,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

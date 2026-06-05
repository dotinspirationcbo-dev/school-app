import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// IMPORTANT: Replace with your PC's IP address
// Find your IP by running: ipconfig
// Look for "IPv4 Address: 192.168.x.x"
const PC_IP = process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.100:5000';

const api = axios.create({
  baseURL: PC_IP,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store token in axios headers
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const token = await AsyncStorage.getItem('userToken');

        if (token) {
          const response = await axios.post(
          `${PC_IP}/api/auth/refresh`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

          if (response.data.success && response.data.data.token) {
            const newToken = response.data.data.token;
            await AsyncStorage.setItem('userToken', newToken);
            setAuthToken(newToken);

            // Retry original request with new token
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.log('Token refresh failed:', refreshError);
        // Token refresh failed, user needs to log in again
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('userData');
        setAuthToken(null);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

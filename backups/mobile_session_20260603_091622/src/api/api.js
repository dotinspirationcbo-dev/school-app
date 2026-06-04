import axios from 'axios';

// IMPORTANT: Replace with your PC's IP address
// Find your IP by running: ipconfig
// Look for "IPv4 Address: 192.168.x.x"
const PC_IP = '192.168.1.100'; // Change this to your PC IP

const api = axios.create({
  baseURL: `http://${PC_IP}:5000`,
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

export default api;

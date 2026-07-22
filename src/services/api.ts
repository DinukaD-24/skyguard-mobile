import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const getBaseUrl = () => {
  // Update this to your local IP address (e.g. 'http://192.168.1.100:3000') when testing on physical phones.
  return 'http://localhost:3000';
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('user_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

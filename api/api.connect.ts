import { SecureStorageAdapter } from '@/middelware/secure-storage';
import axios from 'axios';
// Make sure to define or import EXPO_PUBLIC_API_URL
const STAGE = process.env.EXPO_PUBLIC_STAGE || 'dev';
 export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.desarrollosweb.net.ar'


const api_url = axios.create({
    baseURL: API_URL,
})

api_url.interceptors.request.use(async (config) => {
  // Verifica si tenemos un token en el secure storage
  const token = await SecureStorageAdapter.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export { api_url };


import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

let logoutFn: (() => void) | null = null;

// Permet au AuthProvider d'enregistrer logout ici
export const setLogoutHandler = (logout: () => void) => {
  logoutFn = logout;
};

// ✅ Base URL lue depuis .env ou docker-compose (API_BASE_URL)
const baseURL = process.env.API_BASE_URL || 'http://10.45.207.15:8081';

const api = axios.create({ baseURL });

// 🔐 Ajoute automatiquement le token dans chaque requête
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔒 Intercepte les erreurs pour détecter un token expiré
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error?.response?.status;
    if ((status === 401 || status === 403) && logoutFn) {
      console.warn('🔐 Token expiré — déconnexion automatique');
      await AsyncStorage.removeItem('token');
      logoutFn();
    }
    return Promise.reject(error);
  }
);

export default api;

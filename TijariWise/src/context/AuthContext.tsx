import React, { createContext, useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setLogoutHandler } from '../services/api'; // <-- adapte le chemin

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  setToken: (_token: string | null) => {},
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Utilise useCallback pour mémoriser la fonction logout (utile pour le setLogoutHandler)
  const logout = useCallback(async () => {
    await AsyncStorage.removeItem('token');
    setToken(null);
  }, []);

  useEffect(() => {
    // On informe api.ts de la fonction logout
    setLogoutHandler(logout);
  }, [logout]);

  useEffect(() => {
    const loadToken = async () => {
      const savedToken = await AsyncStorage.getItem('token');
      setToken(savedToken ?? null);
      setLoading(false);
    };
    loadToken();
  }, []);

  useEffect(() => {
    console.log("🔐 TOKEN ACTUEL :", token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

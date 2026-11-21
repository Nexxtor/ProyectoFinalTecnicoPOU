import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authApi from '../api/auth.js';

const STORAGE_KEY = 'eventos-session-v1';
const AuthContext = createContext(null);

function loadSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session]);

  async function login(credentials) {
    setLoading(true);
    try {
      const user = await authApi.login(credentials);
      setSession(user);
      return user;
    } finally {
      setLoading(false);
    }
  }

  async function register(data) {
    setLoading(true);
    try {
      const user = await authApi.register(data);
      setSession(user);
      return user;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setSession(null);
  }

  const value = useMemo(
    () => ({
      session,
      loading,
      isAuthenticated: Boolean(session),
      isAdmin: session?.role === 'admin',
      isOrganizer: session?.role === 'organizer' || session?.role === 'admin',
      login,
      register,
      logout
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}

import { createContext, useContext, useEffect, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();
const TOKEN_KEY = 'asc_dashboard_token';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      if (!token) {
        setAuthLoading(false);
        return;
      }
      try {
        const res = await authService.me(token);
        if (!cancelled) setUser(res.data);
      } catch {
        if (!cancelled) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          setUser(null);
        }
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    hydrate();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyResult = (result) => {
    if (result.status === 'approved' && result.access_token) {
      localStorage.setItem(TOKEN_KEY, result.access_token);
      setToken(result.access_token);
      setUser({ email: result.email, status: 'approved' });
    }
    return result;
  };

  const requestAccess = async (email) => {
    const res = await authService.login(email);
    return applyResult(res.data);
  };

  const pollStatus = async (email) => {
    const res = await authService.checkStatus(email);
    return applyResult(res.data);
  };

  const logout = async () => {
    try {
      if (token) await authService.logout(token);
    } catch {
      // ignore network/API errors — clear the local session regardless
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!token && !!user,
        authLoading,
        requestAccess,
        pollStatus,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

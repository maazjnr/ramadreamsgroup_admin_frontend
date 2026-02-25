import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getMeRequest, loginRequest } from "../api/authApi";

const STORAGE_KEY = "rdg_admin_auth";

const loadStoredAuth = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { token: "", admin: null };
    }
    return JSON.parse(raw);
  } catch {
    return { token: "", admin: null };
  }
};

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const initial = loadStoredAuth();
  const [token, setToken] = useState(initial.token || "");
  const [admin, setAdmin] = useState(initial.admin || null);
  const [loading, setLoading] = useState(Boolean(initial.token));

  const persistAuth = useCallback((nextToken, nextAdmin) => {
    setToken(nextToken);
    setAdmin(nextAdmin);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: nextToken, admin: nextAdmin })
    );
  }, []);

  const clearAuth = useCallback(() => {
    setToken("");
    setAdmin(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getMeRequest(token)
      .then((response) => {
        if (!isMounted) {
          return;
        }
        persistAuth(token, response.data);
      })
      .catch(() => {
        if (isMounted) {
          clearAuth();
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, persistAuth, clearAuth]);

  const login = useCallback(
    async (credentials) => {
      const response = await loginRequest(credentials);
      persistAuth(response.data.token, response.data.admin);
    },
    [persistAuth]
  );

  const logout = useCallback(() => {
    clearAuth();
  }, [clearAuth]);

  const value = useMemo(
    () => ({
      token,
      admin,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, admin, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

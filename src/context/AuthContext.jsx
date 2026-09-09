import { createContext, useEffect, useState, useCallback } from "react";
import * as authApi from "../api/auth.api";
import { tokenStorage } from "../api/axiosClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // "checking" until we've resolved whether an existing token is still valid,
  // so ProtectedRoute never bounces a logged-in user to /login on a page refresh.
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const token = tokenStorage.get();
    if (!token) {
      setStatus("guest");
      return;
    }
    authApi
      .getMe()
      .then((me) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => {
        tokenStorage.clear();
        setStatus("guest");
      });
  }, []);

  const login = useCallback(async (email, password) => {
    const result = await authApi.login(email, password);
    tokenStorage.set(result.token);
    setUser(result.user);
    setStatus("authenticated");
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      tokenStorage.clear();
      setUser(null);
      setStatus("guest");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

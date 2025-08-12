// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { api, setToken, clearToken, getToken } from "../lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Check token on app load
  useEffect(() => {
    const t = getToken();
    if (!t) {
      setReady(true);
      return;
    }
    api("/api/auth/me")
      .then((u) => setUser(u))
      .catch(() => clearToken())
      .finally(() => setReady(true));
  }, []);

  // Login
  async function login(email, password) {
    const resp = await api("/api/auth/login", {
      method: "POST",
      auth: false,
      body: { email, password },
    });
    setToken(resp.token);
    setUser(resp.user);
  }

  // Register
  async function register(name, email, password) {
    const resp = await api("/api/auth/register", {
      method: "POST",
      auth: false,
      body: { name, email, password },
    });
    setToken(resp.token);
    setUser(resp.user);
  }

  // Logout
  function logout() {
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Protected route wrapper
export function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="p-6">Loading…</div>;
  if (!user) return <div className="p-6">Please login to continue.</div>;
  return children;
}
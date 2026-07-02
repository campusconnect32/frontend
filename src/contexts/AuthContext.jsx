import { createContext, useCallback, useContext, useEffect, useState, useRef } from "react";
import { getMe, logout as apiLogout } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const initialCheckDone = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔍 Auth refresh - token exists:", !!token);
      if (!token) {
        setUser(null);
        return null;
      }
      const u = await getMe();
      console.log("✅ Auth refresh - user:", u?.email);
      setUser(u);
      return u;
    } catch (err) {
      console.warn("❌ Auth refresh failed:", err?.response?.status);
      localStorage.removeItem("token");
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    if (initialCheckDone.current) return;
    initialCheckDone.current = true;

    let isMounted = true;

    (async () => {
      const token = localStorage.getItem("token");
      console.log("🔍 Initial auth check - token exists:", !!token);
      if (!token) {
        if (isMounted) setLoading(false);
        return;
      }
      try {
        const u = await getMe();
        console.log("✅ Initial auth check - user:", u?.email);
        if (isMounted) setUser(u);
      } catch (err) {
        console.warn("❌ Initial auth check failed:", err?.response?.status);
        localStorage.removeItem("token");
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, []);

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch (err) { console.warn("Logout API failed:", err); }
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  const value = {
    user,
    setUser,
    loading,
    refresh,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

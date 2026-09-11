"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { adminLogin as apiLogin } from "@/lib/api";

const AuthContext = createContext(null);

function isTokenValid(token) {
  if (!token) return false;
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const decoded = JSON.parse(jsonPayload);
    // JWT exp is in seconds, Date.now() is in milliseconds
    return decoded.exp * 1000 > Date.now();
  } catch (e) {
    return false; // If token is invalid or malformed
  }
}

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
    } else if (token) {
      localStorage.removeItem("admin_token");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== "/login") {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, pathname, router]);

  const logout = useCallback(() => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    router.push("/login");
  }, [router]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const token = localStorage.getItem("admin_token");
      if (token && !isTokenValid(token)) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [isAuthenticated, logout]);

  const login = useCallback(async (username, password) => {
    const data = await apiLogin(username, password);
    if (data.success && data.token) {
      localStorage.setItem("admin_token", data.token);
      setIsAuthenticated(true);
      router.push("/");
      return data;
    }
    throw new Error("Login failed");
  }, [router]);



  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

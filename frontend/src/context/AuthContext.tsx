"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types";
import { fetchAPI } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in cookies
    const checkAuth = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("access_token="))
          ?.split("=")[1];

        if (token) {
          // Fetch user profile if token exists
          // We need a /users/me endpoint, but for now we can rely on what we have,
          // or just assume if token exists, we fetch it.
          // Let's assume we have an endpoint for this, or we store user in localStorage
          const storedUser = localStorage.getItem("gssoc_user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Auth check failed", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = (token: string, userData: User) => {
    document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Strict`;
    localStorage.setItem("gssoc_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.removeItem("gssoc_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
  initialToken,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialToken?: string;
}) {
  const [user, setUser] = useState<User | null>(initialUser || null);

  // Set initial token from server
  useEffect(() => {
    if (initialToken) {
      apiClient.setAccessToken(initialToken);
    }
  }, [initialToken]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user: userData } = await response.json();
        setUser(userData);

        // Get the new token for client-side use
        const tokenResponse = await fetch("/api/auth/token");
        if (tokenResponse.ok) {
          const { accessToken } = await tokenResponse.json();
          apiClient.setAccessToken(accessToken);
        }

        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      apiClient.setAccessToken("");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  image: string;
  phone: string;
  isVerified: boolean;
  Agent: {
    sip_username: string;
    isAvailable: boolean;
    totalCalls: number;
    successCalls: number;
    jobTitle: string;
    department: string;
    status: string;
    droppedCalls: number;
  };
  ownedOrganization: {
    id: string;
    name: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  token?: string;
  isLoading: boolean;
  error: string | null;
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
  const [token, setToken] = useState<string | undefined>(initialToken);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          const message = errorData?.message || "Login failed";
          setError(message);
          toast.error(message);
          return false;
        }

        const { user: userData, token: authToken } = await response.json();

        setUser(userData);
        setToken(authToken);

        toast.success("Logged in successfully!");
        return true;
      } catch (err) {
        const message = "Network error during login";
        setError(message);
        toast.error(message);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message = errorData?.message || "Logout failed";
        setError(message);
        toast.error(message);
      } else {
        toast.success("Logged out successfully!");
      }
    } catch (err) {
      const message = "Network error during logout";
      setError(message);
      toast.error(message);
      console.error("Logout error:", err);
    } finally {
      setUser(null);
      setToken(undefined);
      setIsLoading(false);

      // Redirect user after logout
      window.location.href = "/";
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
        isLoading,
        error,
      }}
    >
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

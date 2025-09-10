"use client";

import React, { createContext, useContext, useState } from "react";

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  image: string;
  ownedOrganization: {
    id: string;
    name: string;
  }
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  token?: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
  token,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  token?: string;
}) {
  const [user, setUser] = useState<User | null>(initialUser || null);

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

        return true;
      }
      return false;
    } catch {
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

      window.location.href = "/";
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        token,
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

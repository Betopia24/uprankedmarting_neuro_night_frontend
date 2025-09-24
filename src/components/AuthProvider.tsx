"use client";

import React, { createContext, useContext, useState } from "react";

interface Agent {
  sip_username: string;
  isAvailable: boolean;
  totalCalls: number;
  successCalls: number;
  jobTitle: string;
  department: string;
  status: string;
  droppedCalls: number;
  organization: {
    id: string;
    name: string;
    organizationNumber: string;
  };
}

interface OrganizationInfo {
  id: string;
  name: string;
  industry: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
  image: string;
  phone: string;
  isVerified: boolean;
  Agent: Agent | null; // Allow Agent to be null
  ownedOrganization: OrganizationInfo | null;
  callStatistics: {
    totalSuccessCalls: number;
    totalCalls: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  token?: string | undefined;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Type guard to validate User structure
function isValidUser(user: User): user is User {
  return (
    user &&
    typeof user.id === "string" &&
    typeof user.email === "string" &&
    typeof user.role === "string" &&
    typeof user.name === "string" &&
    typeof user.image === "string" &&
    typeof user.phone === "string" &&
    typeof user.isVerified === "boolean" &&
    (user.Agent === null ||
      (typeof user.Agent === "object" &&
        typeof user.Agent.sip_username === "string" &&
        typeof user.Agent.isAvailable === "boolean"))
  );
}

export function AuthProvider({
  children,
  initialUser,
  token,
}: {
  children: React.ReactNode;
  initialUser?: any;
  token?: string;
}) {
  // Validate and normalize the initialUser data
  const normalizedInitialUser =
    initialUser && isValidUser(initialUser)
      ? {
          ...initialUser,
          Agent: initialUser.Agent || null, // Ensure Agent is null if undefined
          ownedOrganization: initialUser.ownedOrganization || null, // Ensure ownedOrganization is null if undefined
        }
      : null;

  const [user, setUser] = useState<User | null>(normalizedInitialUser);

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
        if (isValidUser(userData)) {
          setUser({
            ...userData,
            Agent: userData.Agent || null,
            ownedOrganization: userData.ownedOrganization || null,
          });
          return true;
        }
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

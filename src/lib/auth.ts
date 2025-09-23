import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginPath } from "@/paths";
import { env } from "@/env";
import { AuthMe, Me } from "@/types/user";

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

// Cache the auth check for the duration of a single request
export const getServerAuth = cache(
  async (): Promise<(AuthMe & { accessToken: string }) | null> => {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    try {
      const response = await fetch(`${env.API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `${accessToken}`,
        },
        cache: "no-store", // Don't cache the HTTP response
      });

      if (response.ok) {
        const responseData: AuthMe = await response.json();
        return { ...responseData, accessToken };
      }
    } catch {
      return null;
    }

    return null;
  }
);

export async function requireAuth(): Promise<AuthMe | null> {
  const data = await getServerAuth();
  if (!data) {
    redirect(loginPath());
  }
  return data;
}

export interface AuthResponse {
  success: boolean;
  data: Me;
  message?: string;
}

// Cache the Me endpoint as well to avoid duplicate calls
export const getMe = cache(async (): Promise<Me | null> => {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    if (!accessToken) {
      return null;
    }

    const res = await fetch(`${env.API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${accessToken}`,
      },
      cache: "no-store", // Don't cache the HTTP response
    });

    if (!res.ok) {
      return null;
    }

    const data: AuthResponse = await res.json();

    if (!data?.success) {
      return null;
    }
    return data.data;
  } catch (error) {
    env.NEXT_PUBLIC_APP_ENV === "development" &&
      console.error("Auth check error:", error);
    return null;
  }
});

// Optional: If you need a unified function that can return either format
export const getAuthUser = cache(
  async (): Promise<{
    authMe: AuthMe & { accessToken: string };
    me: Me;
  } | null> => {
    const authData = await getServerAuth();
    if (!authData) return null;

    const meData = await getMe();
    if (!meData) return null;

    return {
      authMe: authData,
      me: meData,
    };
  }
);

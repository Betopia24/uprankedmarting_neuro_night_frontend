import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginPath } from "@/paths";
import { env } from "@/env";
import { AuthMe } from "@/types/user";

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export async function getServerAuth(): Promise<
  (AuthMe & { accessToken: string }) | null
> {
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
    });

    if (response.ok) {
      const responseData: AuthMe = await response.json();

      return { ...responseData, accessToken };
    }
  } catch (error) {
    return null;
  }

  return null;
}

export async function requireAuth(): Promise<AuthMe | null> {
  const data = await getServerAuth();
  if (!data) {
    redirect(loginPath());
  }
  return data;
}

import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginPath } from "@/paths";

export interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

export async function getServerAuth(): Promise<{
  user: User | null;
  accessToken: string | null;
}> {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("accessToken")?.value;

  if (!accessToken) {
    return { user: null, accessToken: null };
  }

  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const { user, accessToken: newAccessToken } = await response.json();
      const cookieStore = cookies();
      (await cookieStore).set("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      });

      return { user, accessToken: newAccessToken };
    }
  } catch (error) {
    return { user: null, accessToken: null };
  }

  return { user: null, accessToken: null };

  /*
 // will try to verify token
  try {
    // Verify token with your backend
    const response = await fetch(`${process.env.BACKEND_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const user = await response.json();
      return { user, accessToken };
    }

    // Token invalid, try to refresh
    const refreshToken = (await cookieStore).get("refreshToken")?.value;
    if (refreshToken) {
      const refreshResponse = await fetch(
        `${process.env.BACKEND_URL}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );

      if (refreshResponse.ok) {
        const { accessToken: newAccessToken, user } =
          await refreshResponse.json();

        // Update cookies
        const cookieStore = cookies();
        (await cookieStore).set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 3600,
        });

        return { user, accessToken: newAccessToken };
      }
    }

    return { user: null, accessToken: null };
  } catch (error) {
    return { user: null, accessToken: null };
  }
  */
}

export async function requireAuth(): Promise<{
  user: User;
  accessToken: string;
}> {
  const { user, accessToken } = await getServerAuth();

  if (!user || !accessToken) {
    redirect(loginPath());
  }

  return { user, accessToken };
}

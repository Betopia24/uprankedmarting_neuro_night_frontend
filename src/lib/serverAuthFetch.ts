import { cookies } from "next/headers";
import { env } from "@/env";

export default async function serverAuthFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  if (!refreshToken) return null;

  // Refresh accessToken from backend
  const tokenRes = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!tokenRes.ok) return null;
  const { accessToken, role } = await tokenRes.json();

  const res = await fetch(`${env.API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 10, ...options.next },
  });

  if (!res.ok) return null;
  return { data: await res.json(), role };
}

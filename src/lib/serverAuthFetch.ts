import { cookies } from "next/headers";
import { env } from "@/env";

export type ServerAuthFetchResult<T> = {
  data: T;
  accessToken: string;
  role: string;
};

export default async function serverAuthFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ServerAuthFetchResult<T> | null> {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) return null;

  // Refresh access token
  const response = await fetch(`${env.API_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) return null;

  const { accessToken, role } = await response.json();

  // Fetch actual API data
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

  const data = await res.json();

  return { data, accessToken, role: "super_admin" };
}

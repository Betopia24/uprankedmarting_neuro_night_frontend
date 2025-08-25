import { cookies } from "next/headers";

export async function checkAuth(): Promise<boolean> {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) return false;

  try {
    const res = await fetch(`/api/me`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  }
}

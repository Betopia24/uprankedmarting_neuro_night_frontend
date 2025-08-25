import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function GET() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  if (!refreshToken)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  // Use refresh endpoint or backend 'me' endpoint; here we refresh to ensure access token
  const res = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok)
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });

  const data = await res.json();
  // data includes accessToken, role, maybe user id
  return NextResponse.json({ role: data.role, accessToken: data.accessToken });
}

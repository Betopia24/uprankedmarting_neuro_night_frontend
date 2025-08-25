import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;
  if (!refreshToken)
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  const res = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok)
    return NextResponse.json(
      { error: "Refresh failed" },
      { status: res.status }
    );

  const data = await res.json();

  // Update refresh token if backend sends new one
  if (data.refreshToken) {
    (await cookies()).set({
      name: "refreshToken",
      value: data.refreshToken,
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return NextResponse.json({
    accessToken: data.accessToken,
    role: "super-admin",
  });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const refreshToken = (await cookies()).get("refreshToken")?.value;

  if (!refreshToken)
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });

  const res = await fetch(`${process.env.API_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok)
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });

  const { accessToken } = await res.json();

  return NextResponse.json({ accessToken });
}

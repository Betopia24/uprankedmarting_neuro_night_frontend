import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function POST() {
  const refreshToken = (await cookies()).get("refreshToken")?.value;
  if (!refreshToken)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const res = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok)
    return NextResponse.json({ error: "Refresh failed" }, { status: 401 });

  const { accessToken } = await res.json();
  return NextResponse.json({ accessToken });
}

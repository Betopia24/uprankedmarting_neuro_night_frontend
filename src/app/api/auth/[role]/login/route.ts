// /app/api/auth/[role]/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function POST(
  req: Request,
  { params }: { params: { role: string } }
) {
  const body = await req.json();
  const role = params.role; // admin / agent / organization

  const response = await fetch(`${env.API_BASE_URL}/${role}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) return NextResponse.json(data, { status: response.status });

  // Save refresh token in httpOnly cookie
  (await cookies()).set({
    name: "refreshToken",
    value: data.refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  // Return accessToken + role to client
  return NextResponse.json({ accessToken: data.accessToken, role: data.role });
}

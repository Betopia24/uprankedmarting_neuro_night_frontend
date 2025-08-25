import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function POST(
  req: Request,
  { params }: { params: { role: string } }
) {
  const body = await req.json();
  const role = params.role;

  const response = await fetch(`${env.API_BASE_URL}/${role}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) return NextResponse.json(data, { status: response.status });

  (await cookies()).set({
    name: "refreshToken",
    value: data.refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({
    accessToken: data.accessToken,
    role: "super_admin",
  });
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/env";

export async function POST(req: Request) {
  const body = await req.json();
  console.log(body);

  const response = await fetch(`${env.API_BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log({ response });
  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(error, { status: response.status });
  }

  const { accessToken, refreshToken } = await response.json();

  // HttpOnly cookie
  (await cookies()).set({
    name: "refreshToken",
    value: refreshToken,
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return NextResponse.json({ accessToken });
}

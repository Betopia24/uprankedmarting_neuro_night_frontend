import { env } from "@/env";
import { UserToken } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const response = await fetch(`${env.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      console.log(response);
      return Response.json(
        { success: false, message: response.statusText },
        { status: response.status }
      );
    }

    const loginData = await response.json();
    const {
      success,
      message,
      data: { accessToken, refreshToken },
    } = loginData;

    const user: UserToken = JSON.parse(atob(accessToken.split(".")[1]));
    const nextResponse = NextResponse.json({ user, success, message });

    const refreshTokenPayload: UserToken = JSON.parse(
      atob(refreshToken.split(".")[1])
    );

    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: user.exp * 1000,
      path: "/",
      domain: undefined,
    });

    nextResponse.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenPayload.exp * 1000,
      path: "/",
      domain: undefined,
    });

    return nextResponse;
  } catch (error: unknown) {
    return Response.json(
      { ok: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

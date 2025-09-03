import { env } from "@/env";
import { UserToken } from "@/types/user";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 🔹 Call backend login API
    const response = await fetch(`${env.API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        body ?? { success: false, message: response.statusText },
        { status: response.status }
      );
    }

    const { success, message, data } = body as {
      success: boolean;
      message: string;
      data: {
        accessToken?: string;
        refreshToken?: string;
        isVerified?: boolean;
      };
    };

    const { accessToken, refreshToken } = data;

    // 🔹 Decode JWTs if tokens exist
    let user: UserToken | undefined;
    let refreshTokenPayload: UserToken | undefined;

    if (accessToken) {
      user = JSON.parse(atob(accessToken.split(".")[1]));
    }

    if (refreshToken) {
      refreshTokenPayload = JSON.parse(atob(refreshToken.split(".")[1]));
    }

    // 🔹 Build response
    const nextResponse = NextResponse.json(
      {
        success,
        message,
        data: { user, accessToken, refreshToken, isVerified: data.isVerified },
      },
      { status: 200 }
    );

    // 🔹 Set cookies if tokens exist
    if (accessToken && user) {
      nextResponse.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: user.exp,
        path: "/",
      });
    }

    if (refreshToken && refreshTokenPayload) {
      nextResponse.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: refreshTokenPayload.exp,
        path: "/",
      });
    }

    return nextResponse;
  } catch (error: unknown) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

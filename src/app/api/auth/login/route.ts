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
      // ❌ Forward backend error as-is
      return NextResponse.json(
        body ?? { success: false, message: response.statusText },
        {
          status: response.status,
        }
      );
    }

    // ✅ Successful login → extract tokens
    const { success, message, data } = body as {
      success: boolean;
      message: string;
      data: { accessToken: string; refreshToken: string };
    };

    const { accessToken, refreshToken } = data;

    // 🔹 Decode JWTs for expiry
    const user: UserToken = JSON.parse(atob(accessToken.split(".")[1]));
    const refreshTokenPayload: UserToken = JSON.parse(
      atob(refreshToken.split(".")[1])
    );

    // 🔹 Build response, but still pass what server sent
    const nextResponse = NextResponse.json(
      { success, message, data: { user, accessToken, refreshToken } },
      { status: 200 }
    );

    // 🔹 Set secure cookies
    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: user.exp * 1000, // NOTE: exp is in seconds, careful
      path: "/",
    });

    nextResponse.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: refreshTokenPayload.exp * 1000,
      path: "/",
    });

    return nextResponse;
  } catch (error: unknown) {
    console.error("Login Error:", error);

    return NextResponse.json(
      { success: false, message: (error as Error).message },
      { status: 500 }
    );
  }
}

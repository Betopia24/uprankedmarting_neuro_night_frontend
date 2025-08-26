// src/app/api/auth/refresh/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = cookies();
    const refreshToken = (await cookieStore).get("refreshToken")?.value;

    if (!refreshToken) {
      return Response.json({ error: "No refresh token" }, { status: 401 });
    }

    // Call your backend to refresh
    const response = await fetch(`${process.env.BACKEND_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!response.ok) {
      return Response.json({ error: "Refresh failed" }, { status: 401 });
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
      expiresIn,
    } = await response.json();

    // SET NEW HTTP-ONLY SECURE COOKIES ✅
    const nextResponse = NextResponse.json({ success: true });

    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true, // ✅
      secure: process.env.NODE_ENV === "production", // ✅
      sameSite: "lax", // ✅
      maxAge: expiresIn || 3600,
      path: "/",
    });

    nextResponse.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true, // ✅
      secure: process.env.NODE_ENV === "production", // ✅
      sameSite: "lax", // ✅
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return nextResponse;
  } catch (error) {
    return Response.json({ error: "Refresh failed" }, { status: 500 });
  }
}

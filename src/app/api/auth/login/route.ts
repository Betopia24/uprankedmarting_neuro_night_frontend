import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 1. Call YOUR external backend
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return Response.json({ error: "Login failed" }, { status: 401 });
    }

    const { accessToken, refreshToken, user, expiresIn } =
      await response.json();

    // 2. SET HTTP-ONLY SECURE COOKIES HERE ✅
    const nextResponse = NextResponse.json({ user });

    // Access Token Cookie (HTTP-only, Secure)
    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true, // ✅ Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in production
      sameSite: "lax", // ✅ CSRF protection
      maxAge: expiresIn || 3600, // 1 hour
      path: "/", // ✅ Available on all routes
    });

    // Refresh Token Cookie (HTTP-only, Secure)
    nextResponse.cookies.set("refreshToken", refreshToken, {
      httpOnly: true, // ✅ Cannot be accessed by JavaScript
      secure: process.env.NODE_ENV === "production", // ✅ HTTPS only in production
      sameSite: "lax", // ✅ CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/", // ✅ Available on all routes
    });

    // 3. Return response with cookies set
    return nextResponse;
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

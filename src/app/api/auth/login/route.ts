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
      return Response.json({ error: "Login failed" }, { status: 401 });
    }

    const loginData = await response.json();
    const {
      success,
      message,
      data: { accessToken },
    } = loginData;

    console.log({ loginData });

    console.log({ success, message, accessToken });

    const user: UserToken = JSON.parse(atob(accessToken.split(".")[1]));

    const nextResponse = NextResponse.json({ user, success, message });

    nextResponse.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: user.exp,
      path: "/",
    });

    // nextResponse.cookies.set("refreshToken", refreshToken, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "lax",
    //   maxAge: 60 * 60 * 24 * 7,
    //   path: "/",
    // });

    return nextResponse;
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

// import { env } from "@/env";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

import { env } from "@/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Check raw headers first
    const cookieHeader = request.headers.get("cookie");

    // Check if we can see cookies at all
    const allHeaders = Object.fromEntries(request.headers.entries());

    const cookieStore = await cookies();

    // Try to get specific cookies
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

    // Manual parsing fallback
    if (cookieHeader && !accessToken) {
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>);
    }

    if (!accessToken?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Your existing auth logic here...
    return NextResponse.json({ message: "Auth check successful" });
  } catch (error) {
    env.NEXT_PUBLIC_APP_ENV === "development" &&
      console.error("❌ Auth check failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

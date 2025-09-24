import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "@/env";

export async function GET() {
  try {
    if (!env.API_BASE_URL) {
      console.error("❌ API_BASE_URL is missing in environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration: API_BASE_URL missing" },
        { status: 500 }
      );
    }

    // Read accessToken cookie
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;

    console.log({ accessToken });

    if (!accessToken) {
      return NextResponse.json(
        { error: "Unauthorized: No access token found" },
        { status: 401 }
      );
    }

    // Call backend
    const res = await fetch(
      `${env.API_BASE_URL}/agents/agent-calls-management-info`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: accessToken,
        },
        credentials: "include",
        cache: "no-store",
      }
    );

    // Forward raw response
    const body = await res.json();
    const headers = new Headers(res.headers);

    return new NextResponse(body, {
      status: res.status,
      headers,
    });
  } catch (err) {
    console.error(
      "❌ Unexpected error in GET /api/agent-calls-management-info",
      err
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

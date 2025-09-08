import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Type for backend response
interface AgentIdsResponse {
  success: boolean;
  data: string[];
  message?: string;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const accessToken = (await cookieStore).get("accessToken")?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, data: [], message: "Missing access token" },
        { status: 401 }
      );
    }

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/agents/get-agent-ids`,
      {
        method: "GET",
        headers: {
          Authorization: accessToken, // raw token, no Bearer
        },
      }
    );

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return NextResponse.json(
        {
          success: false,
          data: [],
          message: `Failed to fetch: ${res.status} - ${text}`,
        },
        { status: res.status }
      );
    }

    const data: AgentIdsResponse = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        data: [],
        message: `Network error: ${(err as Error).message}`,
      },
      { status: 500 }
    );
  }
}

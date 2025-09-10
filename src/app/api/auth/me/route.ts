// import { env } from "@/env";
// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    console.log("=== AUTH CHECK DEBUG ===");

    // Check raw headers first
    const cookieHeader = request.headers.get("cookie");
    console.log("Raw cookie header:", cookieHeader);

    // Check if we can see cookies at all
    const allHeaders = Object.fromEntries(request.headers.entries());
    console.log("All request headers:", allHeaders);

    const cookieStore = await cookies();
    console.log("All cookies via Next.js:", cookieStore.getAll());

    // Try to get specific cookies
    const accessToken = cookieStore.get("accessToken");
    const refreshToken = cookieStore.get("refreshToken");

    console.log("accessToken cookie object:", accessToken);
    console.log("refreshToken cookie object:", refreshToken);
    console.log("accessToken value:", accessToken?.value);

    // Manual parsing fallback
    if (cookieHeader && !accessToken) {
      console.log("Attempting manual cookie parsing...");
      const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        if (key && value) {
          acc[key] = decodeURIComponent(value);
        }
        return acc;
      }, {} as Record<string, string>);

      console.log("Manually parsed cookies:", cookies);
    }

    if (!accessToken?.value) {
      console.log("❌ No access token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("✅ Access token found, proceeding with auth check");

    // Your existing auth logic here...
    return NextResponse.json({ message: "Auth check successful" });
  } catch (error) {
    console.error("❌ Auth check failed:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// export async function GET() {
//   try {
//     const cookieStore = await cookies();
//     const accessToken = cookieStore.get("accessToken")?.value;

//     console.log("accessToken from cookie:", accessToken);

//     if (!accessToken) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const response = await fetch(`${env.API_BASE_URL}/auth/me`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `${accessToken}`, // ✅ fix
//       },
//       cache: "no-store",
//     });

//     const data = await response.json();
//     console.log("backend /auth/me response:", data);

//     if (!response.ok || !data?.success) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     return NextResponse.json(data.data, { status: 200 });
//   } catch (error) {
//     console.error("Auth check failed:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

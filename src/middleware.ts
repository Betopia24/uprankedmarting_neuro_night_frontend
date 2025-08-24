import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const refreshToken = req.cookies.get("refreshToken")?.value;

  // 1️⃣ Redirect logged-in users away from /auth pages
  if (req.nextUrl.pathname.startsWith("/auth") && refreshToken) {
    url.pathname = "/dashboard"; // or your default logged-in page
    return NextResponse.redirect(url);
  }

  // 2️⃣ Protect private routes
  const protectedPaths = ["/dashboard", "/agent", "/admin"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !refreshToken) {
    url.pathname = "/auth/error";
    return NextResponse.redirect(url);
  }

  // 3️⃣ Allow all other routes
  return NextResponse.next();
}

// 4️⃣ Apply middleware to these routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/agent/:path*",
    "/admin/:path*",
    "/auth/:path*", // include auth pages to redirect logged-in users
  ],
};

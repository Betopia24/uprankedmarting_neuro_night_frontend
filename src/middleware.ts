import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { loginPath } from "./paths";
import {
  AGENT_ROLE,
  ORGANIZATION_ADMIN_ROLE,
  SUPER_ADMIN_ROLE,
} from "./constants";

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  if (!refreshToken)
    return NextResponse.redirect(new URL(loginPath(), req.url));

  // Call backend to get user role (could use /auth/me)
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
    headers: { Cookie: `refreshToken=${refreshToken}` },
  });

  if (!res.ok) return NextResponse.redirect(new URL(loginPath(), req.url));

  const { role } = await res.json();

  // Protect routes based on role
  if (
    req.nextUrl.pathname.startsWith("/dashboard/admin") &&
    role !== SUPER_ADMIN_ROLE
  )
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  if (
    req.nextUrl.pathname.startsWith("/dashboard/agent") &&
    role !== AGENT_ROLE
  )
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  if (
    req.nextUrl.pathname.startsWith("/dashboard/organization") &&
    role !== ORGANIZATION_ADMIN_ROLE
  )
    return NextResponse.redirect(new URL("/unauthorized", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/agent/:path*",
    "/dashboard/organization/:path*",
  ],
};

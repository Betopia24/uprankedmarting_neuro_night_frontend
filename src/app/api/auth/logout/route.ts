import { NextResponse } from "next/server";

export async function POST() {
  // CLEAR HTTP-ONLY COOKIES ✅
  const response = NextResponse.json({ success: true });

  response.cookies.delete("accessToken");
  response.cookies.delete("refreshToken");

  return response;
}

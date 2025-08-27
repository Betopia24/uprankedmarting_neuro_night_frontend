import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    console.log(formData);

    return new NextResponse();

    const response = await fetch(`${process.env.BACKEND_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return Response.json({ error: "Signup failed" }, { status: 401 });
    }

    const user = await response.json();

    console.log(user);
    const nextResponse = NextResponse.json({ user });

    return nextResponse;
  } catch (error) {
    return Response.json({ error: "Login failed" }, { status: 500 });
  }
}

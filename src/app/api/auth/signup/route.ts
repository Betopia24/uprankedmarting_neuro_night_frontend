import { env } from "@/env";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const formData = await request.json();

    const payload = {
      userData: {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phoneNumber,
      },
      organizationData: {
        name: formData.businessName,
        websiteLink: formData.website,
        address: formData.address,
        industry: formData.industry,
      },
    };

    const response = await fetch(`${env.API_BASE_URL}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
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

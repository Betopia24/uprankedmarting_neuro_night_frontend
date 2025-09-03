import { env } from "@/env";
import { NextResponse } from "next/server";
import { organizationSignupSchema } from "@/features/auth/utils/validation";
import { ZodError } from "zod";

/**
 * 🔹 Request shape from frontend form
 */
type OrganizationSignupRequest = {
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  businessName: string;
  website?: string;
  address?: string;
  industry?: string;
};

/**
 * 🔹 Utility: Format Zod validation errors
 */
function formatZodError(error: ZodError) {
  return error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}

export async function POST(request: Request) {
  try {
    const formData: OrganizationSignupRequest = await request.json();

    // ✅ Validate payload with Zod
    const payload = organizationSignupSchema.parse({
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
    });

    // ✅ Forward request to backend
    const response = await fetch(`${env.API_BASE_URL}/users/register-user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // ✅ Pass through backend response as-is
    const responseBody = await response.json().catch(() => null);

    return NextResponse.json(responseBody, { status: response.status });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          statusCode: 400,
          message: "Validation failed. Please check your input.",
          errors: formatZodError(error),
        },
        { status: 400 }
      );
    }

    console.error("Signup Error:", error);

    return NextResponse.json(
      {
        success: false,
        statusCode: 500,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}

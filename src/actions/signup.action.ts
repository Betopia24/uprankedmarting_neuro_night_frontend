"use server";

import { SignupFormSchema } from "@/components/auth/_utils/validation";

export async function createOrganization(data: SignupFormSchema) {
  const API_BASE = process.env.API_BASE_URL;
  if (!API_BASE) throw new Error("API_BASE_URL is required");
  try {
    const response = await fetch(`${API_BASE}/organization/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });

    if (!response.ok) {
      if (response.status === 422) {
        const json = await response.json();
        return { success: false, errors: json.detail };
      }
      throw new Error(`Unexpected error: ${response.status}`);
    }

    const result = await response.text();
    return { success: true, message: result };
  } catch (error) {
    return {
      success: false,
      errors: [
        {
          msg: error instanceof Error ? error.message : "Something went wrong",
          type: "unknown",
          loc: [],
        },
      ],
    };
  }
}

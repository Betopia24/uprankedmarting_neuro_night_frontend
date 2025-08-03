"use server";

import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

const LoginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

const RegisterFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

export type FormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
  };
};

export async function login(
  prevState: FormState | undefined,
  formData: FormData
) {
  const validatedFields = LoginFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Login.",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await signIn("credentials", { email, password, redirect: false });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { message: "Invalid email or password." };
        default:
          return { message: "Something went wrong. Please try again." };
      }
    }
    throw error;
  }
  return { message: "Login successful" };
}

export async function register(
  prevState: FormState | undefined,
  formData: FormData
) {
  const validatedFields = RegisterFormSchema.safeParse(
    Object.fromEntries(formData.entries())
  );
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Register.",
    };
  }

  const { name, email, password } = validatedFields.data;

  console.log("Registering user:", { name, email });

  if (email === "user@example.com") {
    return {
      message: "An account with this email already exists.",
      errors: { email: ["Email already in use."] },
    };
  }
  return { message: "Registration successful! You can now log in." };
}

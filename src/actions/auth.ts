"use server";

import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";

// Schemas
const OtpSchema = z.object({
  "otp-1": z.string().length(1, "OTP digit required."),
  "otp-2": z.string().length(1, "OTP digit required."),
  "otp-3": z.string().length(1, "OTP digit required."),
  "otp-4": z.string().length(1, "OTP digit required."),
});

const ForgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const ResetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

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
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

// State Types
export type FormState = {
  message: string;
  errors?: {
    email?: string[];
    password?: string[];
    name?: string[];
    confirmPassword?: string[];
    terms?: string[];
    otp?: string[];
  };
};

// Actions
export async function verifyOtp(
  prevState: FormState | undefined,
  formData: FormData
) {
  const validatedFields = OtpSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    const fieldErrors = validatedFields.error.flatten().fieldErrors;
    const otpErrors = Object.values(fieldErrors).flat();
    return {
      errors: { otp: otpErrors },
      message: "Please enter a valid 4-digit OTP.",
    };
  }

  const otp = Object.values(validatedFields.data).join('');

  // --- TODO: External API Call to verify OTP --- //
  // For example:
  // const res = await fetch(`${process.env.EXTERNAL_API_URL}/auth/verify-otp`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ otp }),
  // });
  // if (!res.ok) { ... handle error ... }

  console.log(`Verifying OTP: ${otp}`);

  // Simulate successful verification
  if (otp === "1234") {
    return { message: "OTP verified successfully!" };
  } else {
    return { message: "Invalid OTP. Please try again.", errors: { otp: ["Invalid OTP."] } };
  }
}

export async function sendPasswordResetLink(
  prevState: FormState | undefined,
  formData: FormData
) {
  const validatedFields = ForgotPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Invalid email address.",
    };
  }

  const { email } = validatedFields.data;

  // --- TODO: External API Call --- //
  // Here you would call your external API to send the reset link.
  // For example:
  // const res = await fetch(`${process.env.EXTERNAL_API_URL}/auth/forgot-password`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ email }),
  // });
  // if (!res.ok) { ... handle error ... }

  console.log(`Password reset link sent to: ${email}`);

  return {
    message: "If an account with that email exists, a password reset link has been sent.",
  };
}

export async function resetPassword(
  token: string | null,
  prevState: FormState | undefined,
  formData: FormData
) {
  if (!token) {
    return { message: "Invalid or missing reset token.", errors: {} };
  }

  const validatedFields = ResetPasswordSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Reset Password.",
    };
  }

  const { password } = validatedFields.data;

  // --- TODO: External API Call --- //
  // Here you would call your external API to reset the password.
  // For example:
  // const res = await fetch(`${process.env.EXTERNAL_API_URL}/auth/reset-password`,
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ token, password }),
  // });
  // if (!res.ok) { ... handle error ... }

  console.log(`Password reset for token: ${token}`);

  return { message: "Your password has been reset successfully. You can now log in." };
}

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

  // --- TODO: External API Call for registration --- //
  console.log("Registering user:", { name, email });

  // Example of checking if user exists
  if (email === "user@example.com") {
    return {
      message: "An account with this email already exists.",
      errors: { email: ["Email already in use."] },
    };
  }
  return { message: "Registration successful! You can now log in." };
}

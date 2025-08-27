import { z } from "zod";
import {
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
  PASSWORD_REGEX,
} from "./constants";

// -------------------- Signup Schema --------------------
export const signupSchema = z
  .object({
    name: z
      .string({ message: "Fullname is required" })
      .min(6, { message: "Fullname must be at least 6 characters long" })
      .max(25, { message: "Fullname must be at most 25 characters long" })
      .trim(),

    email: z.email("Invalid email address"),

    password: z
      .string({ message: "Password is required" })
      .min(MIN_PASSWORD_LENGTH, {
        message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
      })
      .max(MAX_PASSWORD_LENGTH, {
        message: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`,
      })
      .regex(PASSWORD_REGEX, {
        message:
          "Password must include uppercase, lowercase, number, and special character (!@#$%^&* etc.)",
      })
      .trim(),

    confirmPassword: z
      .string({ message: "Please retype your password" })
      .min(MIN_PASSWORD_LENGTH, {
        message: "Confirm password must be at least 8 characters long",
      })
      .max(MAX_PASSWORD_LENGTH, {
        message: "Confirm password must not exceed 64 characters",
      }),

    businessName: z
      .string({ message: "Business name is required" })
      .min(6, { message: "Business name must be at least 6 characters long" }),

    phoneNumber: z
      .string({ message: "Phone number is required" })
      .regex(/^\+[1-9]\d{9,14}$/, {
        message: "Phone number must include country code",
      }),

    industry: z.string({ message: "Industry is required" }),

    website: z
      .string({ message: "Website is required" })
      .url("Invalid URL")
      .optional(),

    address: z
      .string({ message: "Address is required" })
      .min(6, {
        message: "Address must be at least 6 characters long",
      })
      .refine((val) => val.split(",").length === 3, {
        message:
          "Address must contain exactly 3 comma-separated values (e.g., Street, City, Country)",
      }),

    acceptTerms: z
      .boolean({
        message: "You must accept the terms and conditions",
      })
      .refine((val) => val === true, {
        message: "You must accept the terms and conditions",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// -------------------- Login Schema --------------------
export const loginSchema = z.object({
  email: z.email("Invalid email address"),

  password: z
    .string({ message: "Password is required" })
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`,
    })
    .trim(),

  rememberMe: z.boolean(),
  callbackUrl: z.string().optional(),
});

export const forgotPassword = z.object({
  email: z.email("Invalid email address"),
});

export const resetPassword = z.object({
  new_password: z
    .string({ message: "Password is required" })
    .min(MIN_PASSWORD_LENGTH, {
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`,
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: `Password must not exceed ${MAX_PASSWORD_LENGTH} characters`,
    })
    .regex(PASSWORD_REGEX, {
      message:
        "Password must include uppercase, lowercase, number, and special character (!@#$%^&* etc.)",
    })
    .trim(),

  confirm_new_password: z
    .string({ message: "Please confirm your password" })
    .min(MIN_PASSWORD_LENGTH, {
      message: "Confirm password must be at least 8 characters long",
    })
    .max(MAX_PASSWORD_LENGTH, {
      message: "Confirm password must not exceed 64 characters",
    }),

  token: z.string(),
});

// -------------------- Types --------------------
export type SignupFormSchema = z.infer<typeof signupSchema>;
export type LoginFormSchema = z.infer<typeof loginSchema>;
export type ForgotPasswordFormSchema = z.infer<typeof forgotPassword>;
export type ResetPasswordFormSchema = z.infer<typeof resetPassword>;

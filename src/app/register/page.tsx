"use client";

import { useActionState } from "react";
import { register } from "@/actions/auth";
import Link from "next/link";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import FormField from "@/components/auth/FormField";
import FormButton from "@/components/auth/FormButton";

export default function RegisterPage() {
  const [state, dispatch] = useActionState(register, undefined);

  return (
    <AuthFormLayout
      title="Get Started Now"
      description="Create your account to start your journey."
      footerText="Already have an account?"
      footerLink="/login"
      footerLinkText="Log in"
    >
      <form action={dispatch} className="space-y-6">
        <FormField
          label="Full Name"
          name="name"
          type="text"
          autoComplete="name"
          required
          error={state?.errors?.name}
        />
        <FormField
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={state?.errors?.email}
        />
        <FormField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          error={state?.errors?.password}
        />

        <label className="text-xs flex gap-2">
          <input type="checkbox" name="terms" required />I agree to the{" "}
          <Link href="/terms" className="font-medium text-primary hover:underline">
            Terms and Conditions
          </Link>
        </label>

        {state?.message && (
          <p
            className={`mt-2 text-sm ${
              state.errors ? "text-red-500" : "text-green-500"
            }`}
          >
            {state.message}
          </p>
        )}

        <FormButton pendingText="Creating Account...">Create Account</FormButton>
      </form>
    </AuthFormLayout>
  );
}
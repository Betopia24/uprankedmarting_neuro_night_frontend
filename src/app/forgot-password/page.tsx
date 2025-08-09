"use client";

import { useActionState } from "react";
import { sendPasswordResetLink } from "@/actions/auth";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import FormField from "@/components/auth/FormField";
import FormButton from "@/components/auth/FormButton";

export default function ForgotPasswordPage() {
  const [state, dispatch] = useActionState(sendPasswordResetLink, undefined);

  return (
    <AuthFormLayout
      title="Forgot Your Password?"
      description="No problem! Enter your email address below and we'll send you a link to reset it."
      footerText="Remember your password?"
      footerLink="/login"
      footerLinkText="Log in"
      showSocialLogins={false}
    >
      <form action={dispatch} className="space-y-6">
        <FormField
          label="Email Address"
          name="email"
          type="email"
          autoComplete="email"
          required
          error={state?.errors?.email}
        />

        {state?.message && (
          <p
            className={`mt-2 text-sm ${
              state.errors ? "text-red-500" : "text-green-500"
            }`}
          >
            {state.message}
          </p>
        )}

        <FormButton pendingText="Sending Link...">Send Reset Link</FormButton>
      </form>
    </AuthFormLayout>
  );
}

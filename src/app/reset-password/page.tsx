"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/actions/auth";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import FormField from "@/components/auth/FormField";
import FormButton from "@/components/auth/FormButton";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const resetPasswordWithToken = resetPassword.bind(null, token);
  const [state, dispatch] = useActionState(resetPasswordWithToken, undefined);

  return (
    <AuthFormLayout
      title="Reset Your Password"
      description="Create a new, strong password for your account."
      footerText="Remembered your password?"
      footerLink="/login"
      footerLinkText="Log in"
    >
      <form action={dispatch} className="space-y-6">
        <FormField
          label="New Password"
          name="password"
          type="password"
          required
          error={state?.errors?.password}
        />
        <FormField
          label="Confirm New Password"
          name="confirmPassword"
          type="password"
          required
          error={state?.errors?.confirmPassword}
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

        <FormButton pendingText="Resetting Password...">Reset Password</FormButton>
      </form>
    </AuthFormLayout>
  );
}

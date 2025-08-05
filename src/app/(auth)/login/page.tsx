"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import Link from "next/link";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import FormField from "@/components/auth/FormField";
import FormButton from "@/components/auth/FormButton";
import { signupPath } from "@/paths";

export default function LoginPage() {
  const [state, dispatch] = useActionState(login, undefined);

  return (
    <AuthFormLayout
      title="Welcome Back!"
      description="Enter your Credentials to access your account"
      footerText="Don't have an account?"
      footerLink={signupPath()}
      footerLinkText="Sign up"
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

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-primary hover:text-primary"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <FormField
            label=""
            name="password"
            type="password"
            autoComplete="current-password"
            required
            error={state?.errors?.password}
          />
        </div>

        <label className="text-xs flex gap-2">
          <input type="checkbox" name="remember" />
          Remember for 30 days
        </label>

        {state?.message && !state.errors && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <FormButton pendingText="Signing In...">Sign In</FormButton>
      </form>
    </AuthFormLayout>
  );
}

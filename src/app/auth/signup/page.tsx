"use client";

import AuthLayout from "@/features/auth/AuthLayout";
import SignupForm from "@/features/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm callbackUrl={""} />
    </AuthLayout>
  );
}

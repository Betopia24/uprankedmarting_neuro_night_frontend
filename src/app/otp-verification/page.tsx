"use client";

import { useActionState } from "react";
import AuthFormLayout from "@/components/auth/AuthFormLayout";
import FormButton from "@/components/auth/FormButton";
import { verifyOtp } from "@/actions/auth";

export default function OtpVerificationPage() {
  const [state, dispatch] = useActionState(verifyOtp, undefined);

  // Function to handle input changes and move focus
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { maxLength, value, name } = e.target;
    const [fieldName, fieldIndex] = name.split("-");

    // Move to next input if current one is filled
    if (value.length >= maxLength) {
      const nextSibling = document.querySelector(
        `input[name=otp-${parseInt(fieldIndex) + 1}]`
      ) as HTMLInputElement;

      if (nextSibling !== null) {
        nextSibling.focus();
      }
    }
  };

  return (
    <AuthFormLayout
      title="Verification"
      description="Please enter the 4-digit code sent to your email."
      footerText="Didn't receive the code?"
      footerLink="#" // Placeholder for resend logic
      footerLinkText="Resend Code"
    >
      <form action={dispatch} className="space-y-6">
        <div className="flex justify-center space-x-2">
          {[1, 2, 3, 4].map((index) => (
            <input
              key={index}
              type="text"
              name={`otp-${index}`}
              maxLength={1}
              className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-primary focus:border-primary"
              onChange={handleInputChange}
              required
            />
          ))}
        </div>

        {state?.message && (
          <p
            className={`mt-2 text-sm ${
              state.errors ? "text-red-500" : "text-green-500"
            }`}
          >
            {state.message}
          </p>
        )}

        <FormButton pendingText="Verifying...">Verify Code</FormButton>
      </form>
    </AuthFormLayout>
  );
}

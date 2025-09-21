"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthCard } from "./AuthForm";
import AuthLayout from "./AuthLayout";

import { useSearchParams } from "next/navigation";
import { env } from "@/env";
import { toast } from "sonner";
import OTPButton from "./OTPButton";

export default function OTPForm() {
  const searchParams = useSearchParams();
  const encodedEmail = searchParams.get("email");
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : "";

  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp: Number(otp) }),
        }
      );

      const result = await response.json().catch(() => null);

      if (!response.ok || !result?.success) {
        // Show field-level errors if any
        if (result?.errors?.length) {
          result.errors.forEach((err: { field: string; message: string }) =>
            toast.error(`${err.field}: ${err.message}`)
          );
        } else {
          toast.error(result?.message || "OTP verification failed.");
        }
        return;
      }

      // ✅ Success
      toast.success(result.message || "OTP verified successfully!");
      setOtp("");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = "/auth/login";
    } catch (error) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("Error verifying OTP:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthCard.Header>
          <AuthCard.Title>Verify OTP</AuthCard.Title>
          <AuthCard.Subtitle>
            Enter the OTP sent to your email
          </AuthCard.Subtitle>
        </AuthCard.Header>

        <AuthCard.Content>
          <div className="flex flex-col gap-4 items-center">
            <InputOTP
              maxLength={4}
              pattern="^[0-9]*$"
              value={otp}
              onChange={setOtp}
            >
              <InputOTPGroup className="gap-6">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={otp.length !== 4 || isSubmitting}
              className={cn("w-full")}
            >
              {isSubmitting ? "Verifying..." : "Verify OTP"}
            </Button>
          </div>
        </AuthCard.Content>
        <AuthCard.Footer>
          <OTPButton />
        </AuthCard.Footer>
      </AuthCard>
    </AuthLayout>
  );
}

"use client";

import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthCard } from "@/features/auth/AuthForm";
import AuthLayout from "@/features/auth/AuthLayout";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import OTPButton from "@/features/auth/OTPButton";

export default function OTPForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const encodedEmail: string | null = searchParams.get("email");
  const email: string = encodedEmail ? decodeURIComponent(encodedEmail) : "";

  const [otp, setOtp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (): Promise<void> => {
    if (!email) {
      toast.error("Email is missing.");
      return;
    }

    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      toast.error("Enter a valid 4-digit OTP.");
      return;
    }

    setIsSubmitting(true);
    try {
      const nextUrl = `/auth/forgot-password/reset?email=${encodeURIComponent(
        email
      )}&otp=${encodeURIComponent(otp)}`;

      toast.success("OTP entered successfully!");
      await new Promise<void>((resolve) => setTimeout(resolve, 500));

      router.push(nextUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again later.";
      toast.error(message);
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
              onChange={(value: string) => setOtp(value)}
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
              {isSubmitting ? "Redirecting..." : "Continue"}
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

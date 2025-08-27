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

export default function OTPForm() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleComplete = (value: string) => {
    if (value === "1234") {
      setError(null);
      console.log("OTP Verified!");
    } else {
      setError("Invalid OTP. Try again.");
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
              onComplete={handleComplete}
            >
              <InputOTPGroup className="gap-6">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
            </InputOTP>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <Button
              type="button"
              onClick={() => handleComplete(otp)}
              disabled={otp.length !== 4}
              className={cn("w-full")}
            >
              Verify OTP
            </Button>
          </div>
        </AuthCard.Content>
        {/* <AuthCard.Footer>
          <AuthCard.Text>Need to start over?</AuthCard.Text>
          <AuthCard.Link href={forgotPasswordPath()}>
            Request Reset Link
          </AuthCard.Link>
        </AuthCard.Footer> */}
      </AuthCard>
    </AuthLayout>
  );
}

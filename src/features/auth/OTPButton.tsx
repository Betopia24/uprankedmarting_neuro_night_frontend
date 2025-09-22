"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { env } from "@/env";

export default function OTPButton() {
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const searchParams = useSearchParams();

  const encodedEmail = searchParams.get("email");
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : "";

  async function handleSendOTP() {
    if (loading || cooldown > 0) return;

    setLoading(true);

    try {
      // mock request — replace with your backend later
      const response = await fetch(
        env.NEXT_PUBLIC_API_URL + "/auth/resend-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) throw new Error("Failed to send OTP");

      const result = await response.json();

      if (result.success) {
        toast.success(result.message || "OTP sent successfully");
        setCooldown(30); // 30s cooldown before resend
        startCooldown();
      } else {
        toast.error(result.message || "Failed to send OTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function startCooldown() {
    let timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  return (
    <div className="flex items-center">
      <p className="text-xs text-gray-500">
        {cooldown > 0
          ? "Please wait before requesting a new OTP."
          : "Didn’t get the code? You can request a new one."}
      </p>
      <Button
        variant="link"
        onClick={handleSendOTP}
        disabled={loading || cooldown > 0}
      >
        {loading
          ? "Sending..."
          : cooldown > 0
            ? `Resend in ${cooldown}s`
            : "Resend OTP"}
      </Button>
    </div>
  );
}

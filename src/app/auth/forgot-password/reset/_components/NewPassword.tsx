"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Form } from "@/components/ui/form";
import { AuthCard } from "@/features/auth/AuthForm";
import AuthButton from "@/features/auth/AuthButton";
import { env } from "@/env";
import { loginPath } from "@/paths";
import AuthLayout from "@/features/auth/AuthLayout";
import PasswordField from "@/features/auth/PasswordField";

// ✅ Zod schema
const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormSchema = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email: string | null = searchParams.get("email");
  const otp: string | null = searchParams.get("otp");

  const form = useForm<ResetPasswordFormSchema>({
    mode: "all",
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordFormSchema): Promise<void> => {
    if (!email || !otp) {
      toast.error("Invalid request. Email or OTP missing.");
      return;
    }

    try {
      const res = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/users/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            otp: Number(otp),
            newPassword: values.newPassword,
          }),
        }
      );

      const data: { message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to reset password");
      }

      toast.success("Password reset successful!", {
        description: "You can now log in with your new password.",
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push(loginPath());
    } catch (err: unknown) {
      let message = "Please try again later.";
      if (err instanceof Error) {
        message = err.message;
      }

      toast.error("Something went wrong", {
        description: message,
      });
    }
  };

  return (
    <AuthLayout>
      <AuthCard>
        <AuthCard.Header>
          <AuthCard.Title>Set a New Password</AuthCard.Title>
          <AuthCard.Subtitle>
            Enter your new password to reset your account.
          </AuthCard.Subtitle>
        </AuthCard.Header>

        <AuthCard.Content>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset className="space-y-6">
                <PasswordField
                  label="New Password"
                  name="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                />
                <PasswordField
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your new password"
                />
              </fieldset>
              <div className="mt-4">
                <AuthButton
                  disabled={
                    !form.formState.isValid || form.formState.isSubmitting
                  }
                  className="w-full"
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                >
                  Reset Password
                </AuthButton>
              </div>
            </form>
          </Form>
        </AuthCard.Content>
      </AuthCard>
    </AuthLayout>
  );
}

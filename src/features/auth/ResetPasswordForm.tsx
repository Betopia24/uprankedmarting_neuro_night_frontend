"use client";

import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideMail } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "./AuthForm";
import { forgotPassword, ForgotPasswordFormSchema } from "./utils/validation";
import { env } from "@/env";
import AuthButton from "./AuthButton";
import { forgotPasswordPath, loginPath } from "@/paths";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ForgotPasswordForm() {
  const url = `${env.NEXT_PUBLIC_API_URL}/users/forgot-password`;
  const router = useRouter();

  const form = useForm<ForgotPasswordFormSchema>({
    mode: "all",
    resolver: zodResolver(forgotPassword),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (formData: ForgotPasswordFormSchema) => {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data: { message?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to send OTP");
      }

      toast.success("An OTP has been sent to your email.", {
        description: "Use the code to reset your password.",
      });

      router.push(`${forgotPasswordPath()}/verify?email=${formData.email}`);

      form.reset();
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
    <AuthCard>
      <AuthCard.Header>
        <AuthCard.Title>Forgot Password?</AuthCard.Title>
        <AuthCard.Subtitle>
          Enter your email and we&apos;ll send you a one-time password (OTP) to
          reset your account.
        </AuthCard.Subtitle>
      </AuthCard.Header>

      <AuthCard.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="space-y-6">
              <TextField
                label="Email"
                name="email"
                placeholder="Enter your email"
              >
                <LucideMail className="size-9 p-2.5 absolute right-0 bottom-0" />
              </TextField>
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
                Send OTP
              </AuthButton>
            </div>
          </form>
        </Form>
      </AuthCard.Content>

      <AuthCard.Footer>
        <AuthCard.Text>Remembered your password?</AuthCard.Text>
        <AuthCard.Link href={loginPath()}>Back to Login</AuthCard.Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}

"use client";
import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideMail } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "./AuthForm";
import PasswordField from "./PasswordField";
import {
  resetPassword,
  ResetPasswordFormSchema,
  forgotPassword,
  ForgotPasswordFormSchema,
} from "./utils/validation";

import AuthButton from "./AuthButton";
import { forgotPasswordPath, loginPath } from "@/paths";
import { useSearchParams } from "next/navigation";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormSchema>({
    mode: "all",
    resolver: zodResolver(forgotPassword),
    defaultValues: {
      email: "",
    },
  });
  const onSubmit = async (formData: ForgotPasswordFormSchema) => {};

  return (
    <AuthCard>
      <AuthCard.Header>
        <AuthCard.Title>Forgot Password?</AuthCard.Title>
        <AuthCard.Subtitle>
          No worries! Enter your email and we'll send you a link to reset your
          password.
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
              />
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

export function NewPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const form = useForm<ResetPasswordFormSchema>({
    mode: "all",
    resolver: zodResolver(resetPassword),
    defaultValues: {
      new_password: "",
      confirm_new_password: "",
      token,
    },
  });
  const onSubmit = async (formData: ResetPasswordFormSchema) => {};

  return (
    <AuthCard>
      <AuthCard.Header>
        <AuthCard.Title>Reset Password</AuthCard.Title>
        <AuthCard.Subtitle>
          Choose a new password to secure your account. Make sure it’s strong
          and memorable.
        </AuthCard.Subtitle>
      </AuthCard.Header>

      <AuthCard.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="space-y-6">
              <PasswordField
                label="Password"
                name="new_password"
                placeholder="Enter your password"
              />
              <PasswordField
                label="Confirm Password"
                name="confirm_new_password"
                placeholder="Confirm your password"
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
              />
            </div>
          </form>
        </Form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <AuthCard.Text>Need to start over?</AuthCard.Text>
        <AuthCard.Link href={forgotPasswordPath()}>
          Request Reset Link
        </AuthCard.Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}

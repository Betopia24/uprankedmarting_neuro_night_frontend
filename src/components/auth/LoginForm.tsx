"use client";
import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideMail } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "./AuthForm";
import PasswordField from "./PasswordField";
import { loginSchema, LoginFormSchema } from "./validation";
import CheckboxField from "./CheckboxField";

import { loginPath, signupPath } from "@/paths";

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const form = useForm<LoginFormSchema>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      callbackUrl: callbackUrl,
    },
  });
  const rememberMe = form.watch("rememberMe");
  const onSubmit = async (formData: LoginFormSchema) => {};

  const redirectSignupUrl = callbackUrl
    ? `${signupPath()}?callbackUrl=${callbackUrl}`
    : signupPath();

  return (
    <AuthCard>
      <AuthCard.Header>
        <AuthCard.Title>Welcome back!</AuthCard.Title>
        <AuthCard.Subtitle>
          Enter your Credentials to access your account
        </AuthCard.Subtitle>
      </AuthCard.Header>
      <AuthCard.Content>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <TextField type="hidden" name="callbackUrl" />
            <fieldset className="space-y-6">
              <TextField
                label="Email"
                name="email"
                placeholder="Enter your email"
              >
                <LucideMail className="size-9 p-2.5 absolute right-0 bottom-0" />
              </TextField>
              <PasswordField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter your password"
              />
              <CheckboxField
                label="Remember me for 30 days"
                name="rememberMe"
                checked={rememberMe}
              />
            </fieldset>
          </form>
        </Form>
      </AuthCard.Content>
      <AuthCard.Footer>
        <AuthCard.Text>Don&apos;t have an account yet?</AuthCard.Text>
        <AuthCard.Link href={`${redirectSignupUrl}`}>
          Create an account
        </AuthCard.Link>
      </AuthCard.Footer>
    </AuthCard>
  );
}

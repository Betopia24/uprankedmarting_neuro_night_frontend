"use client";
import TextField from "./TextField";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LucideMail } from "lucide-react";
import { useForm } from "react-hook-form";
import { AuthCard } from "./AuthForm";
import PasswordField from "./PasswordField";
import { loginSchema, LoginFormSchema } from "./_utils/validation";
import CheckboxField from "./CheckboxField";
import { signIn } from "next-auth/react";

import { forgotPasswordPath, signupPath } from "@/paths";
import AuthButton from "./AuthButton";
import Link from "next/link";

import { loginOrganization } from "@/actions/signin.action";

import { toast } from "sonner";

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
  // const onSubmit = async (formData: LoginFormSchema) => {
  //   console.log(formData);
  //   try {
  //     const result = await loginOrganization(formData);

  //     console.log(result);

  //     if (result.success) {
  //       // toast("Organization created successfully");
  //       form.reset();
  //       // router.push(loginPath());
  //     } else {
  //       toast.error("==");
  //     }
  //   } catch (error) {
  //     toast.error("Something went wrong");
  //   }
  // };

  const onSubmit = async (data: LoginFormSchema) => {
    // Use NextAuth signIn with "credentials"
    const result = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
      url: "auth/organization/login",
    });
    console.log({ result });

    if (result?.error) {
      console.error("Login failed:", result.error);
      return;
    }

    if (result?.ok) {
      console.log("Login successful, redirecting...");
      // window.location.href = "/dashboard"; // or use next/navigation router
    }
  };

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
                redirectLink={
                  <Link
                    className="text-xs text-blue-500 hover:underline-offset-1 underline"
                    href={forgotPasswordPath()}
                  >
                    forgot password
                  </Link>
                }
              />
              <CheckboxField
                label="Remember me for 30 days"
                name="rememberMe"
                checked={rememberMe}
              />
            </fieldset>
            <div className="mt-4">
              <AuthButton
                disabled={
                  !form.formState.isValid ||
                  form.formState.isSubmitting ||
                  !rememberMe
                }
                className="w-full"
                type="submit"
              >
                Submit
              </AuthButton>
            </div>
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

"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth";
import Link from "next/link";
import FormField from "@/components/auth/FormField";
import FormButton from "@/components/auth/FormButton";
import { signupPath } from "@/paths";
import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  const [state, dispatch] = useActionState(login, undefined);

  return <LoginForm callbackUrl="" />;
}

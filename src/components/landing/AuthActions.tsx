"use client";

import Link from "next/link";
import Button from "../Button";
import { loginPath, signupPath } from "@/paths";
import { useAuth } from "../AuthProvider";
import LogoutButton from "@/features/auth/LogoutButton";
import DashboardButton from "@/features/auth/DashboardButton";

export default function AuthActions() {
  const { user } = useAuth();

  return !user ? (
    <>
      <Button size="sm" variant="secondary" asChild>
        <Link href={`${loginPath()}`}>Login</Link>
      </Button>
      <Button variant="primary" size="sm" asChild>
        <Link href={`${signupPath()}`}>Sign Up</Link>
      </Button>
    </>
  ) : (
    <>
      <DashboardButton variant="secondary" />
      <LogoutButton>Sign out</LogoutButton>
    </>
  );
}

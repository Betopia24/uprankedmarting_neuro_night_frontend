"use client";
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { loginPath } from "@/paths";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { useAuth } from "@/components/AuthProvider";

// export const metadata: Metadata = {
//   title: "Unauthorized • 401",
//   description: "You don't have permission to view this page.",
//   robots: { index: false },
// };

export default function Unauthorized() {
  const auth = useAuth();

  return (
    <main className="min-h-[100dvh] bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-background flex items-center justify-center px-4">
      <section aria-labelledby="unauthorized-title" className="w-full max-w-md">
        <div className="rounded-2xl border bg-white/90 dark:bg-card shadow-xl p-8 backdrop-blur">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-6">
            <ShieldX
              className="h-6 w-6 text-blue-600 dark:text-blue-400"
              aria-hidden
            />
          </div>

          <h1
            id="unauthorized-title"
            className="text-2xl font-semibold tracking-tight text-blue-700 dark:text-blue-300"
          >
            Unauthorized (401)
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            You don’t have permission to view this page. You may need to sign in
            with an account that has access.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href={loginPath()}>Go to Login</Link>
            </Button>

            <Button asChild variant="outline" className="border-blue-200">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>

          <div className="mt-6">
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer">
                Why am I seeing this?
              </summary>
              <div className="mt-2">
                You might be signed out, your session expired, or your role
                doesn’t meet the required permissions.
              </div>
            </details>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          If you believe this is a mistake, contact support.
        </p>
      </section>
    </main>
  );
}

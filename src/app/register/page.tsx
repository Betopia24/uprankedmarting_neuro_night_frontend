"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/actions/auth";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [state, dispatch] = useActionState(register, undefined);

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join us and start your journey.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
                 <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
              <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.618-3.67-11.283-8.591l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            </svg>
            Google
          </button>
          <button
            onClick={() => signIn("apple", { callbackUrl: "/dashboard" })}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md shadow-sm hover:bg-gray-800 dark:bg-gray-200 dark:text-black dark:hover:bg-gray-300"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 2.25C6.62 2.25 2.25 6.62 2.25 12c0 5.38 4.37 9.75 9.75 9.75c.5 0 .93-.38 1.02-.87c.02-.12.03-.24.03-.36c0-1.14-.06-2.77-.18-3.89c-.13-1.11-.29-2.2-.47-3.26h.01c.03-.15.06-.3.09-.45c.22-.9.5-1.77.86-2.58c.35-.8.78-1.53 1.28-2.18c.5-.65 1.06-1.2 1.68-1.64c.62-.44 1.28-.77 1.98-.98c.7-.2 1.4-.26 2.09-.18c.69.08 1.32.29 1.88.63c.56.34 1.02.78 1.38 1.3c.36.52.6 1.1.72 1.74c.12.64.12 1.28.01 1.91c-.11.64-.34 1.26-.68 1.85c-.34.59-.78 1.13-1.3 1.6c-.52.47-1.1.86-1.74 1.16c-.64.3-1.32.48-2.02.53c-.7.05-1.4-.02-2.08-.2c-.68-.18-1.32-.48-1.9-.88c-.58-.4-1.09-.9-1.52-1.47c-.43-.57-.78-1.2-1.04-1.88c-.26-.68-.43-1.4-.5-2.15c-.07-.75-.03-1.5.1-2.2c.13-.7.38-1.35.72-1.93c.34-.58.78-1.08 1.28-1.5c.5-.42 1.05-.75 1.65-.98c.6-.23 1.22-.35 1.85-.35c.63 0 1.25.12 1.85.35c.6.23 1.15.55 1.65.98c.5.42.94.92 1.28 1.5c.34.58.59 1.23.72 1.93c.13.7.17 1.45.1 2.2c-.07.75-.24 1.47-.5 2.15c-.26.68-.61 1.31-1.04 1.88c-.43.57-.94 1.07-1.52 1.47c-.58.4-1.22.7-1.9.88c-.68-.18-1.4.25-2.08.2c-.7-.05-1.38-.23-2.02-.53c-.64-.3-1.22-.69-1.74-1.16c-.52-.47-.96-1.01-1.3-1.6c-.34-.59-.57-1.21-.68-1.85c-.11-.63-.11-1.27.01-1.91c.12-.64.36-1.22.72-1.74c.36-.52.82-.96 1.38-1.3c.56-.34 1.19-.55 1.88-.63c.69-.08 1.39.02 2.09.18c.7.21 1.36.54 1.98.98c.62.44 1.18 1 1.68 1.64c.5.65.93 1.38 1.28 2.18c.36.81.64 1.68.86 2.58c.03.15.06.3.09.45h-.01c-.18 1.06-.34 2.15-.47 3.26c-.12 1.12-.18 2.75-.18 3.89c0 .12.01.24.03.36c.09-.5.52-.87 1.02-.87c5.38 0 9.75-4.37 9.75-9.75C21.75 6.62 17.38 2.25 12 2.25z" />
            </svg>
            Apple
          </button>
        </div>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          <span className="flex-shrink mx-4 text-sm text-gray-500 dark:text-gray-400">
            Or sign up with email
          </span>
          <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
        </div>

        <form action={dispatch} className="space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            {state?.errors?.name && (
              <p className="mt-2 text-sm text-red-500">{state.errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            {state?.errors?.email && (
              <p className="mt-2 text-sm text-red-500">{state.errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            />
            {state?.errors?.password && (
              <p className="mt-2 text-sm text-red-500">{state.errors.password}</p>
            )}
          </div>

          {state?.message && (
            <p
              className={`mt-2 text-sm ${state.errors ? 'text-red-500' : 'text-green-500'}`}>
              {state.message}
            </p>
          )}

          <RegisterButton />
        </form>

        <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}

function RegisterButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 dark:bg-indigo-500 dark:hover:bg-indigo-600"
      aria-disabled={pending}
    >
      {pending ? "Creating Account..." : "Create Account"}
    </button>
  );
}

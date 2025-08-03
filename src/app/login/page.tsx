"use client";

import Link from "next/link";

// ... (rest of the imports)

export default function LoginPage() {
  // ... (rest of the component)
  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        {/* ... (form code) */}
        <div className="text-center">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

// ... (LoginButton component)

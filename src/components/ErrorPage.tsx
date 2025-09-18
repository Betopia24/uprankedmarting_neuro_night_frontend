import { useEffect } from "react";
import { env } from "@/env";

interface ErrorPageProps {
  error?: Error | string;
  reset?: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    if (error) {
      console.error("Logged error:", error);
    }
  }, [error]);

  return (
    <div
      style={{
        height: "calc(100vh - var(--_sidebar-header-height))",
      }}
      className="flex flex-col items-center justify-center  bg-gray-50 px-4 text-center -mt-20"
    >
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
        <p className="text-lg text-gray-700 mb-6">Something went wrong.</p>
        {env.NEXT_PUBLIC_APP_ENV === "development" && (
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-red-500 overflow-x-auto mb-6">
            {error instanceof Error ? error.stack : String(error)}
          </pre>
        )}
        {env.NEXT_PUBLIC_APP_ENV === "production" && (
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-red-500 overflow-x-auto mb-6">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        )}
        {reset && (
          <button
            onClick={reset}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { loginPath } from "@/paths";

const PaymentSuccessPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(loginPath());
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md w-full">
        <CheckCircle2 className="mx-auto text-green-600" size={64} />
        <h1 className="text-3xl font-bold text-green-700 mt-6">
          Payment Successful
        </h1>
        <p className="text-gray-600 mt-3">
          Your subscription has been activated successfully.
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Redirecting you to your dashboard...
        </p>

        <button
          onClick={() => router.push(loginPath())}
          className="mt-6 w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const PaymentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // Extract subscriptionId from query
  const subscriptionId = searchParams.get("subscriptionId");

  // useEffect(() => {
  //   // If subscriptionId missing, redirect back to home
  //   if (!subscriptionId) {
  //     toast.error("Invalid access. Redirecting...");
  //     // router.replace("/"); // redirect to home
  //     return;
  //   }

  //   // Optional: Verify subscription on server
  //   const verifySubscription = async () => {
  //     try {
  //       const res = await fetch(
  //         `${process.env.NEXT_PUBLIC_API_URL}/subscriptions/verify/${subscriptionId}`
  //       );
  //       const data = await res.json();

  //       if (!res.ok || data?.success === false) {
  //         toast.error("Invalid subscription. Redirecting...");
  //         router.replace("/");
  //       }
  //     } catch (err) {
  //       toast.error("Something went wrong. Redirecting...");
  //       router.replace("/");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   verifySubscription();
  // }, [subscriptionId, router]);

  if (loading) return <p className="p-8 text-center">Verifying...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-8">
      <div className="bg-white p-12 rounded-xl shadow-xl text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          Your subscription has been activated successfully.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;

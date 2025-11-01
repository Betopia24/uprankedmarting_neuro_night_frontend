"use client";

import { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";
import CheckoutForm from "./CheckoutForm";

interface Plan {
  id: string;
  planName: string;
  amount: number;
  planLevel: string;
  defaultAgents: number;
}

export default function SubscriptionForm({ plans }: { plans: Plan[] }) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlanSelect = async (plan: Plan) => {
    setSelectedPlan(plan);
    setLoading(true);

    try {
      // Call your API to create setup intent
      const response = await fetch("/api/subscriptions/create-setup-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();
      setClientSecret(data.data.clientSecret);
    } catch {
      alert("Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {!selectedPlan ? (
        // Plan Selection
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition"
            >
              <h3 className="text-xl font-bold mb-2">{plan.planName}</h3>
              <p className="text-3xl font-bold mb-4">
                ${plan.amount}
                <span className="text-sm text-gray-600">/mo</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {plan.defaultAgents} agents included
              </p>
              <button
                onClick={() => handlePlanSelect(plan)}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Select Plan"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        // Payment Form
        <div>
          <button
            onClick={() => setSelectedPlan(null)}
            className="mb-4 text-blue-600 hover:underline"
          >
            ← Back to plans
          </button>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">
              Subscribe to {selectedPlan.planName}
            </h2>
            <p className="mb-6">
              1-day free trial. You'll be charged ${selectedPlan.amount} after
              trial ends.
            </p>

            {clientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm plan={selectedPlan} clientSecret={clientSecret} />
              </Elements>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

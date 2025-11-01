"use client";

import { useState, FormEvent } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

interface CheckoutFormProps {
  plan: any;
  clientSecret: string;
}

export default function CheckoutForm({
  plan,
  clientSecret,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    numberOfAgents: plan.defaultAgents,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError("");

    try {
      // 1. Confirm card setup
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error("Card element not found");

      const { setupIntent, error: stripeError } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: formData.name,
              email: formData.email,
              phone: formData.phone,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
        setLoading(false);
        return;
      }

      // 2. Create subscription with payment method
      const response = await fetch("/api/subscriptions/create-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          planId: plan.id,
          planLevel: plan.planLevel,
          purchasedNumber: formData.phone,
          sid: "frontend_subscription", // You may need to get this from phone selection
          numberOfAgents: formData.numberOfAgents,
          paymentMethodId: setupIntent.payment_method,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push("/dashboard?subscription=success");
      } else {
        setError(result.message || "Subscription failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone Number</label>
        <input
          type="tel"
          required
          placeholder="+1234567890"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Number of Agents
        </label>
        <input
          type="number"
          min={plan.defaultAgents}
          value={formData.numberOfAgents}
          onChange={(e) =>
            setFormData({
              ...formData,
              numberOfAgents: parseInt(e.target.value),
            })
          }
          className="w-full border rounded-lg px-4 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="border rounded-lg px-4 py-3">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : `Start Free Trial`}
      </button>

      <p className="text-xs text-gray-500 text-center">
        You won't be charged until your 1-day trial ends. Cancel anytime.
      </p>
    </form>
  );
}

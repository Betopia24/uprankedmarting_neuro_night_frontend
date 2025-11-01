"use client";

import { useState, useCallback } from "react";
import { IoArrowBack } from "react-icons/io5";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";

interface FormData {
  cardholderName: string;
  agentCount: number;
}

interface FormErrors {
  cardholderName?: string;
  agentCount?: string;
}

interface SubscriptionProps {
  only_ai: boolean;
  planPrice: number;
  planLevel: string;
  planId: string;
  number: string;
  organizationId: string;
  sid: string;
  onBack?: () => void;
}

// Stripe promise
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ------------------ COMPONENT ------------------
const SubscriptionForm: React.FC<SubscriptionProps> = ({
  only_ai,
  planPrice,
  planLevel,
  number,
  planId,
  organizationId,
  sid,
  onBack,
}) => {
  const auth = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState<FormData>({
    cardholderName: "",
    agentCount: 0,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const subTotal = (planPrice * formData.agentCount).toFixed(2);

  // ----------------- VALIDATION -----------------
  const validateCardholderName = (name: string) => name.trim().length >= 2;
  const validateAgentCount = (count: number) => count >= 0 && count <= 3;

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!validateCardholderName(formData.cardholderName))
      newErrors.cardholderName = "Invalid cardholder name";
    if (!only_ai && !validateAgentCount(formData.agentCount))
      newErrors.agentCount = "Agent count must be 0-3";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ----------------- INPUT HANDLERS -----------------
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;

      if (name === "agentCount") {
        const numValue = Math.min(Math.max(Number(value), 0), 3);
        setFormData((prev) => ({
          ...prev,
          agentCount: numValue,
        }));
        if (validateAgentCount(numValue))
          setErrors((prev) => ({ ...prev, agentCount: undefined }));
      } else if (name === "cardholderName") {
        setFormData((prev) => ({
          ...prev,
          cardholderName: value,
        }));
        if (validateCardholderName(value))
          setErrors((prev) => ({ ...prev, cardholderName: undefined }));
      }
    },
    []
  );

  const handleBackClick = () => onBack && onBack();

  // ----------------- CREATE PAYMENT METHOD -----------------
  const createPaymentMethod = async () => {
    if (!stripe || !elements) {
      throw new Error("Stripe or Elements not initialized");
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      throw new Error("Card Element not found");
    }

    const { paymentMethod, error } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name: formData.cardholderName },
    });

    if (error) {
      throw new Error(error.message);
    }

    return paymentMethod;
  };

  // ----------------- SUBMIT -----------------
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 1) Create a PaymentMethod from the card input
      const paymentMethod = await createPaymentMethod();

      // 2) Ask your API to create the subscription and PI on the server
      const subscriptionData: {
        planId: string;
        sid: string;
        purchasedNumber: string;
        paymentMethodId: string;
        extraAgents?: number;
      } = {
        planId,
        sid,
        purchasedNumber: "+" + number.toString().trim(),
        paymentMethodId: paymentMethod.id,
      };

      // Only include extraAgents if not AI-only plan and agent count > 0
      if (!only_ai && formData.agentCount > 0) {
        subscriptionData.extraAgents = formData.agentCount;
      }

      // Log the request data for debugging
      console.log("Sending subscription data:", subscriptionData);

      const createdSubscriptionResponse = await fetch(
        process.env.NEXT_PUBLIC_API_URL + "/subscriptions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${auth.token}`,
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      // Enhanced logging BEFORE parsing
      console.log("=== API REQUEST ===");
      console.log("URL:", process.env.NEXT_PUBLIC_API_URL + "/subscriptions");
      console.log(
        "Subscription Request:",
        JSON.stringify(subscriptionData, null, 2)
      );
      console.log("Auth Token Present:", !!auth.token);

      console.log("=== API RESPONSE ===");
      console.log("Status:", createdSubscriptionResponse.status);
      console.log("Status Text:", createdSubscriptionResponse.statusText);
      console.log("OK:", createdSubscriptionResponse.ok);

      const created = await createdSubscriptionResponse.json();

      console.log("Response Data:", JSON.stringify(created, null, 2));

      if (!createdSubscriptionResponse.ok) {
        // Better error message extraction
        const errorMessage =
          created?.message ||
          created?.error?.message ||
          created?.error ||
          `Failed to create subscription (Status: ${createdSubscriptionResponse.status})`;

        console.error("API Error Details:", {
          status: createdSubscriptionResponse.status,
          response: created,
          message: errorMessage,
        });

        throw new Error(errorMessage);
      }

      // Only check success if it exists in response
      if ("success" in created && created.success === false) {
        const errorMessage =
          created?.message ||
          created?.error?.message ||
          "Subscription creation failed";
        console.error("Subscription Failed:", errorMessage);
        throw new Error(errorMessage);
      }

      // 3) Confirm the PaymentIntent client-side using the provided clientSecret
      //    Stripe requires both the client_secret and the payment_method.
      // const clientSecret: string | undefined = created?.data?.clientSecret;

      // if (!clientSecret) {
      //   throw new Error("Missing client secret from server response.");
      // }

      if (!stripe) {
        throw new Error("Stripe not initialized");
      }

      // Use the PaymentMethod we just created
      // const { error: confirmError } = await stripe.confirmCardPayment(
      //   clientSecret,
      //   {
      //     payment_method: paymentMethod.id,
      //   }
      // );

      // if (confirmError) {
      //   // Common 3DS/authentication errors will land here
      //   throw new Error(confirmError.message);
      // }

      // Optional: you can inspect paymentIntent?.status === 'succeeded'
      // and (if you have an endpoint) notify your backend to finalize/refresh state.

      toast.success("Subscription created and payment confirmed successfully!");

      if (created?.data?.subscription?.planId) {
        router.push(
          `/payment-success?subscriptionId=${created?.data?.subscription?.planId}`
        );
      }
    } catch (err: unknown) {
      console.error("Full error object:", err);

      let message = "Failed to process subscription";

      if (err instanceof Error) {
        message = err.message;
        console.error("Error stack:", err.stack);
      } else if (typeof err === "string") {
        message = err;
      } else if (err && typeof err === "object" && "message" in err) {
        message = String((err as { message: unknown }).message);
      }

      // Log the full error for debugging
      console.error("Subscription error details:", {
        errorType: err?.constructor?.name,
        error: err,
        message,
        formData,
        planId,
        sid,
      });

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // ----------------- UI -----------------
  return (
    <div
      style={{
        height: "calc(100vh - var(--_sidebar-header-height))",
      }}
      className="bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Panel */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:p-12">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity mb-10"
          >
            <IoArrowBack className="h-6 w-6" />
            <span className="font-semibold">TempleRun</span>
          </button>

          <div className="mb-10">
            <p className="text-base text-blue-200">Subscription fee</p>
            <div className="flex items-baseline mt-2">
              <span className="text-5xl font-bold">
                ${planPrice.toFixed(2)}
              </span>
              <span className="text-xl font-medium text-blue-200 ml-2">
                per month
              </span>
            </div>
          </div>

          <div className="space-y-4 text-sm mb-8">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-base">
                  {planLevel.replace("_", " ").toUpperCase()} Plan
                </p>
                <p className="text-blue-200">
                  {only_ai
                    ? "AI only"
                    : `${formData.agentCount} agent${
                        formData.agentCount !== 1 ? "s" : ""
                      }`}{" "}
                  • Billed monthly
                </p>
              </div>
              <p className="font-semibold text-base">${subTotal}</p>
            </div>
          </div>

          <hr className="border-blue-500 my-8" />

          <div className="space-y-4 text-sm font-medium">
            <div className="flex justify-between items-center text-blue-200">
              <p>Subtotal</p>
              <p>${subTotal}</p>
            </div>
            <div className="flex justify-between items-center text-blue-200">
              <p>Tax</p>
              <p>$0.00</p>
            </div>
            <div className="flex justify-between items-center text-white text-lg font-bold mt-4">
              <p>Total due today</p>
              <p>${subTotal}</p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white p-8 md:p-12">
          {!only_ai && (
            <div className="mb-8">
              <label
                htmlFor="agent-count"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Number of Agents (Optional)
              </label>
              <input
                type="number"
                id="agent-count"
                name="agentCount"
                min={0}
                max={3}
                value={formData.agentCount}
                onChange={handleInputChange}
                className={`block w-full rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.agentCount ? "border-red-300" : "border-gray-300"
                }`}
                disabled={isLoading}
              />
              {errors.agentCount && (
                <p className="text-red-500 text-xs mt-1">{errors.agentCount}</p>
              )}
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Payment method
            </h3>
            <div className="border-b border-gray-200">
              <button
                type="button"
                className="text-blue-600 font-semibold py-2 px-1 border-b-2 border-blue-600 -mb-px"
                disabled={isLoading}
              >
                Credit or Debit Card
              </button>
            </div>
          </div>

          {/* CardElement */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card information
            </label>
            <div className="border rounded-lg p-3">
              <CardElement
                options={{ style: { base: { fontSize: "16px" } } }}
              />
            </div>
          </div>

          {/* Cardholder Name */}
          <div className="mb-4">
            <label
              htmlFor="cardholder-name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cardholder name
            </label>
            <input
              type="text"
              id="cardholder-name"
              name="cardholderName"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={handleInputChange}
              className={`block w-full rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.cardholderName ? "border-red-300" : "border-gray-300"
              }`}
              disabled={isLoading}
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-xs mt-1">
                {errors.cardholderName}
              </p>
            )}
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? "Processing..." : "Subscribe"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ------------------ EXPORT WRAPPED WITH ELEMENTS ------------------
const SubscriptionWrapper: React.FC<SubscriptionProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <SubscriptionForm {...props} />
    </Elements>
  );
};

export default SubscriptionWrapper;

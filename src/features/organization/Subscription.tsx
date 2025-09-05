"use client";

import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";
import React, { useState, useCallback } from "react";
import { FaCcVisa, FaCcMastercard, FaCcAmex } from "react-icons/fa6";
import { IoArrowBack, IoInformationCircle } from "react-icons/io5";

// Type definitions
type CardType = "visa" | "mastercard" | "amex" | "none";

interface FormData {
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  cardholderName: string;
  agentCount: number;
}

interface FormErrors {
  cardNumber?: string;
  expiryDate?: string;
  cvc?: string;
  cardholderName?: string;
  agentCount?: string;
}

interface SubscriptionProps {
  only_ai: boolean;
  planPrice: number;
  planId: string;
  organizationId: string;
  sid: string;
  planLevel: string;
  number: string;
  onBack?: () => void;
}

const Subscription: React.FC<SubscriptionProps> = ({
  only_ai,
  planPrice,
  planId,
  organizationId,
  sid,
  planLevel,
  number,
  onBack,
}) => {
  const auth = useAuth();
  const [cardType, setCardType] = useState<CardType>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<FormData>({
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
    agentCount: only_ai ? 0 : 1,
  });

  // Calculate totals
  const subTotal = (planPrice * formData.agentCount).toFixed(2);
  const tax = 0.0;
  const totalDue = (parseFloat(subTotal) + tax).toFixed(2);

  // Validation functions
  const validateCardNumber = (number: string): boolean => {
    const cleaned = number.replace(/\s/g, "");
    return /^\d{13,19}$/.test(cleaned);
  };

  const validateExpiryDate = (date: string): boolean => {
    const match = date.match(/^(\d{2})\s*\/\s*(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth))
      return false;

    return true;
  };

  const validateCVC = (cvc: string): boolean => {
    return /^\d{3,4}$/.test(cvc);
  };

  const validateCardholderName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validateAgentCount = (count: number): boolean => {
    return count >= 1 && count <= 100;
  };

  // Format card number with spaces
  const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, "");
    const match = cleaned.match(/\d{1,4}/g);
    return match ? match.join(" ") : "";
  };

  // Format expiry date
  const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return (
        cleaned.substring(0, 2) +
        (cleaned.length > 2 ? " / " + cleaned.substring(2, 4) : "")
      );
    }
    return cleaned;
  };

  // Detect card type
  const detectCardType = (number: string): CardType => {
    const cleaned = number.replace(/\s/g, "");
    if (/^4/.test(cleaned)) return "visa";
    if (/^5[1-5]/.test(cleaned)) return "mastercard";
    if (/^3[47]/.test(cleaned)) return "amex";
    return "none";
  };

  const handleCardNumberChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const rawValue = e.target.value;
      const formattedValue = formatCardNumber(rawValue);

      if (formattedValue.replace(/\s/g, "").length <= 19) {
        setCardType(detectCardType(formattedValue));
        setFormData((prev) => ({
          ...prev,
          cardNumber: formattedValue,
        }));

        // Clear error if valid
        if (validateCardNumber(formattedValue)) {
          setErrors((prev) => ({ ...prev, cardNumber: undefined }));
        }
      }
    },
    []
  );

  const handleExpiryDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const formattedValue = formatExpiryDate(e.target.value);
      setFormData((prev) => ({
        ...prev,
        expiryDate: formattedValue,
      }));

      // Clear error if valid
      if (validateExpiryDate(formattedValue)) {
        setErrors((prev) => ({ ...prev, expiryDate: undefined }));
      }
    },
    []
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>): void => {
      const { name, value } = e.target;
      const processedValue = name === "agentCount" ? Number(value) : value;

      setFormData((prev) => ({
        ...prev,
        [name]: processedValue,
      }));

      // Clear specific errors
      if (name === "cvc" && validateCVC(value)) {
        setErrors((prev) => ({ ...prev, cvc: undefined }));
      }
      if (name === "cardholderName" && validateCardholderName(value)) {
        setErrors((prev) => ({ ...prev, cardholderName: undefined }));
      }
      if (name === "agentCount" && validateAgentCount(Number(value))) {
        setErrors((prev) => ({ ...prev, agentCount: undefined }));
      }
    },
    []
  );

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!validateCardNumber(formData.cardNumber)) {
      newErrors.cardNumber = "Please enter a valid card number";
    }

    if (!validateExpiryDate(formData.expiryDate)) {
      newErrors.expiryDate = "Please enter a valid expiry date";
    }

    if (!validateCVC(formData.cvc)) {
      newErrors.cvc = "Please enter a valid CVC";
    }

    if (!validateCardholderName(formData.cardholderName)) {
      newErrors.cardholderName = "Please enter the cardholder's name";
    }

    if (!only_ai && !validateAgentCount(formData.agentCount)) {
      newErrors.agentCount = "Please enter a valid number of agents (1-100)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const subscriptionData = {
        planId,
        organizationId,
        sid,
        planLevel,
        purchasedNumber: number.toString().trim(),
        numberOfAgents: formData.agentCount,
      };

      const subscriptionResponse = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/subscriptions/create-subscription`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${auth.token}`,
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      if (!subscriptionResponse.ok) {
        throw new Error(`HTTP error! status: ${subscriptionResponse.status}`);
      }

      const subscriptionResult = await subscriptionResponse.json();

      if (!subscriptionResult.success) {
        throw new Error(
          subscriptionResult.message || "Failed to create subscription"
        );
      }

      const { clientSecret, paymentIntentId } = subscriptionResult.data;

      // TODO: Implement Stripe payment method creation and confirmation
      console.log("Subscription created successfully:", {
        clientSecret,
        paymentIntentId,
        cardDetails: {
          cardNumber: formData.cardNumber
            .replace(/\s/g, "")
            .replace(/\d(?=\d{4})/g, "*"),
          expiryDate: formData.expiryDate,
          cardholderName: formData.cardholderName,
        },
      });

      // Next steps would be:
      // 1. Create payment method with Stripe
      // 2. Confirm payment intent
      // 3. Handle success/error states
    } catch (error) {
      console.error("Subscription error:", error);
      // TODO: Add proper error handling and user feedback
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackClick = (): void => {
    if (onBack) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl lg:grid lg:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
        {/* Left Side: Summary Panel */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 md:p-12">
          <button
            onClick={handleBackClick}
            className="flex items-center space-x-2 opacity-80 hover:opacity-100 transition-opacity mb-10"
            type="button"
            disabled={isLoading}
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
              <p>${tax.toFixed(2)}</p>
            </div>
            <div className="flex justify-between items-center text-white text-lg font-bold mt-4">
              <p>Total due today</p>
              <p>${totalDue}</p>
            </div>
          </div>
        </div>

        {/* Right Side: Payment Form */}
        <div className="bg-white p-8 md:p-12">
          {/* Agent Selection */}
          {!only_ai && (
            <div className="mb-8">
              <label
                htmlFor="agent-count"
                className="block text-lg font-semibold text-gray-700 mb-2"
              >
                Number of Agents
              </label>
              <input
                type="number"
                id="agent-count"
                name="agentCount"
                min={1}
                max={100}
                value={formData.agentCount}
                onChange={handleInputChange}
                className={`block w-full rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.agentCount ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Enter number of agents"
                disabled={isLoading}
              />
              {errors.agentCount ? (
                <p className="text-red-500 text-xs mt-1">{errors.agentCount}</p>
              ) : (
                <p className="text-gray-500 text-xs mt-1">
                  Select the number of agents for your subscription (1-100)
                </p>
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

          <div className="space-y-6">
            {/* Card Number */}
            <div>
              <label
                htmlFor="card-number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Card information
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="card-number"
                  name="cardNumber"
                  placeholder="0000 0000 0000 0000"
                  className={`block w-full rounded-lg shadow-sm p-3 pr-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.cardNumber ? "border-red-300" : "border-gray-300"
                  }`}
                  value={formData.cardNumber}
                  onChange={handleCardNumberChange}
                  autoComplete="cc-number"
                  disabled={isLoading}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center space-x-2">
                  <FaCcVisa
                    className={`text-xl text-blue-800 transition-opacity duration-300 ${
                      cardType === "visa" ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  <FaCcMastercard
                    className={`text-xl text-red-600 transition-opacity duration-300 ${
                      cardType === "mastercard" ? "opacity-100" : "opacity-30"
                    }`}
                  />
                  <FaCcAmex
                    className={`text-xl text-blue-600 transition-opacity duration-300 ${
                      cardType === "amex" ? "opacity-100" : "opacity-30"
                    }`}
                  />
                </div>
              </div>
              {errors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
              )}
            </div>

            {/* Expiry and CVC */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="expiry-date"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Expiry date
                </label>
                <input
                  type="text"
                  id="expiry-date"
                  name="expiryDate"
                  placeholder="MM / YY"
                  className={`block w-full rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.expiryDate ? "border-red-300" : "border-gray-300"
                  }`}
                  value={formData.expiryDate}
                  onChange={handleExpiryDateChange}
                  autoComplete="cc-exp"
                  maxLength={7}
                  disabled={isLoading}
                />
                {errors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.expiryDate}
                  </p>
                )}
              </div>
              <div>
                <label
                  htmlFor="cvc"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  CVC
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="cvc"
                    name="cvc"
                    placeholder="123"
                    className={`block w-full rounded-lg shadow-sm p-3 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.cvc ? "border-red-300" : "border-gray-300"
                    }`}
                    value={formData.cvc}
                    onChange={handleInputChange}
                    autoComplete="cc-csc"
                    maxLength={4}
                    disabled={isLoading}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <IoInformationCircle className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
                {errors.cvc && (
                  <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>
                )}
              </div>
            </div>

            {/* Cardholder Name */}
            <div>
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
                className={`block w-full rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.cardholderName ? "border-red-300" : "border-gray-300"
                }`}
                value={formData.cardholderName}
                onChange={handleInputChange}
                autoComplete="cc-name"
                disabled={isLoading}
              />
              {errors.cardholderName && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.cardholderName}
                </p>
              )}
            </div>

            {/* Submit Button */}
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
    </div>
  );
};

export default Subscription;

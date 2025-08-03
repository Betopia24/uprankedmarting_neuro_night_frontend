"use client";

import { useState } from "react";
import Button from "../Button";
import Container from "../Container";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Essentials",
      price: 29,
      description:
        "Best for businesses who want help to individuals or small businesses:",
      features: [
        "Unlimited Minutes",
        "AI Agents",
        "1 Local Phone Numbers",
        "Unlimited Tokens (AI Usage)",
        "Deep Analytics & Call Insights",
        "Priority Support (Phone, Chat & Email)",
        "7-Day Free Trial",
        "Cancel Anytime",
      ],
      buttonText: "Try it free",
      showNoCredit: true,
    },
    {
      name: "Growth",
      price: 49,
      description:
        "Best for businesses who want help and development needs individuals or small businesses:",
      features: [
        "Unlimited Minutes",
        "Human Agents",
        "1 Local Phone Numbers",
        "Unlimited Tokens (AI Usage)",
        "Deep Analytics & Call Insights",
        "Priority Support (Phone, Chat & Email)",
        "7-Day Free Trial",
        "Cancel Anytime",
      ],
      buttonText: "Subscribe",
      showNoCredit: false,
    },
    {
      name: "Enterprise",
      price: 89,
      description:
        "Best for businesses who want help and development needs individuals or small businesses:",
      features: [
        "Unlimited Minutes",
        "Human Agents",
        "Unlimited AI Phone Agents",
        "1 Local Phone Numbers",
        "Unlimited Tokens (AI Usage)",
        "Deep Analytics & Call Insights",
        "Priority Support (Phone, Chat & Email)",
        "7-Day Free Trial",
        "Cancel Anytime",
      ],
      buttonText: "Subscribe",
      showNoCredit: false,
    },
  ];

  return (
    <Container>
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-4">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setBillingPeriod("monthly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingPeriod === "monthly"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod("quarterly")}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                billingPeriod === "quarterly"
                  ? "bg-teal-500 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              Quarterly (Save 20%)
            </button>
          </div>
          <div className="flex items-center gap-2">
            {/* Custom Switch */}
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                isAnnual ? "bg-teal-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isAnnual ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
            <span className="text-gray-700 font-medium">Annual (25% off)</span>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className="relative bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="p-6 pb-4 min-h-36">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {plan.name}
              </h3>
              <p className="text-sm">{plan.description}</p>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6 space-y-6 flex flex-col justify-stretch flex-1">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-gray-600">/mo</span>
              </div>
              <p className="text-sm text-gray-600">Per agent</p>

              <div className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-start gap-3">
                    {/* Custom Check Icon */}
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-teal-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="px-6 py-8 relative">
              <Button size="sm" className="w-full">
                {plan.buttonText}
              </Button>
              {plan.showNoCredit && (
                <p className="text-[10px] text-gray-500 text-center mt-2 absolute 4 inset-x-0">
                  No credit card required *
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

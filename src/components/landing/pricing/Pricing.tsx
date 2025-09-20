"use client";

import { useState } from "react";
import { Container, Button } from "@/components";
import { LucideCheck } from "lucide-react";
import { Section } from "@/components";
import CardAnimationWrapper from "./CardAnimationWrapper";
import CardAnimation from "./CardAnimation";
import Link from "next/link";
import { loginPath } from "@/paths";

// ✅ Plan type (mirrors your API response but simplified for the UI)
export interface Plan {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
  description: string;
  features: string[];
}

// ✅ Props type
type PricingProps = {
  monthlyPlans: Plan[];
  yearlyPlans: Plan[];
};

export default function Pricing({ monthlyPlans, yearlyPlans }: PricingProps) {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );

  const plans = billingPeriod === "monthly" ? monthlyPlans : yearlyPlans;

  return (
    <Section className="bg-success-500">
      <Container>
        <CardAnimationWrapper>
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="max-w-3xl mx-auto">
              <Section.Heading>
                A Cost-Effective Solution That Grows with Your Business
              </Section.Heading>
            </div>
            <div className="max-w-5xl mx-auto">
              <p className="text-lg">
                Get smart support without the high costs. Designed to adapt as
                your business expands, our solution offers flexibility,
                efficiency, and value — no matter your size.
              </p>
            </div>

            {/* Billing Toggle */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-4">
                <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                      billingPeriod === "monthly"
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod("yearly")}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${
                      billingPeriod === "yearly"
                        ? "bg-teal-500 text-white shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Yearly
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan, idx) => (
              <CardAnimation
                key={plan.id}
                direction={
                  (idx === 0 && "left") || (idx === 2 && "right") || "center"
                }
                className="relative bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
              >
                {/* Card Header */}
                <div className="p-6 pb-4 min-h-36">
                  <h3 className="text-xl font-bold text-[#0B0B0B]">
                    {plan.planName}
                  </h3>
                  <p className="text-sm text-[#4D4D4D] mt-4">
                    {plan.description}
                  </p>
                </div>

                {/* Card Content */}
                <div className="px-6 pb-6 space-y-6 flex flex-col justify-stretch flex-1">
                  <div className="border-t border-b border-gray-300 pt-8 pb-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900 uppercase">
                        ${plan.amount}
                      </span>
                      <span className="text-gray-600">
                        /{plan.interval === "month" ? "mo" : "yr"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">Per agent</p>
                  </div>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start gap-3"
                      >
                        <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                          <LucideCheck size={16} />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="px-6 py-8 relative">
                  <Button asChild size="sm" className="w-full">
                    <Link href={loginPath()}>Choose {plan.planName}</Link>
                  </Button>
                </div>
              </CardAnimation>
            ))}
          </div>
        </CardAnimationWrapper>
      </Container>
    </Section>
  );
}

"use client";

import { useState } from "react";
import { Container, Button } from "@/components";
import { LucideCheck } from "lucide-react";
import { Section } from "@/components";
import CardAnimationWrapper from "./CardAnimationWrapper";
import CardAnimation from "./CardAnimation";
import Link from "next/link";
import { loginPath } from "@/paths";

// Updated Plan interface matching the new API structure
type ExtraAgentPricing = {
  agents: number;
  price: number;
};

export interface Plan {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
  intervalCount: number;
  freeTrialDays: number | null;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  features: string[];
  planLevel: string;
  defaultAgents: number;
  extraAgentPricing: ExtraAgentPricing[];
  totalMinuteLimit: number;
  createdAt: string;
  updatedAt: string;
}

type PricingProps = {
  plans: Plan[];
};

export function Pricing({ plans }: PricingProps) {
  if (!plans.length) {
    return <div className="text-center py-6 text-gray-500">No plans found</div>;
  }

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
              <p className="text-lg text-gray-600">
                Get smart support without the high costs. Designed to adapt as
                your business expands, our solution offers flexibility,
                efficiency, and value — no matter your size.
              </p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {plans.map((plan, idx) => (
              <CardAnimation
                key={plan.id}
                direction={
                  (idx === 0 && "left") || (idx === 2 && "right") || "center"
                }
                className="relative bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
              >
                {/* Header */}
                <div className="p-6 pb-4 min-h-36">
                  <h3 className="text-xl font-bold text-[#0B0B0B]">
                    {plan.planName}
                  </h3>
                  <p className="text-sm text-[#4D4D4D] mt-4">
                    {plan.description}
                  </p>
                </div>

                {/* Price */}
                <div className="px-6 pb-6 flex-1">
                  <div className="border-t border-b border-gray-300 pt-8 pb-4 mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-gray-900 uppercase">
                        ${plan.amount}
                      </span>
                      <span className="text-gray-600">
                        /{plan.interval === "month" ? "mo" : "yr"}
                      </span>
                    </div>
                    {plan.planLevel !== "only_ai" && (
                      <p className="text-xs text-gray-600">Per agent</p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-start gap-3">
                        <LucideCheck
                          size={16}
                          className="text-teal-500 mt-0.5 flex-shrink-0"
                        />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Extra Agent Pricing (Optional) */}
                  {plan.extraAgentPricing.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <p className="font-semibold text-gray-700 mb-2">
                        Extra Agents:
                      </p>
                      <ul className="space-y-1">
                        {plan.extraAgentPricing.map((extra, extraIdx) => (
                          <li key={extraIdx} className="text-sm text-gray-600">
                            +{extra.agents} agent{extra.agents > 1 ? "s" : ""}:{" "}
                            ${extra.price}/
                            {plan.interval === "month" ? "mo" : "yr"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="px-6 py-8">
                  <Button asChild size="sm" className="w-full">
                    <Link href={loginPath()}>Purchase</Link>
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

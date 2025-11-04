import { Container, Button } from "@/components";
import { LucideCheck } from "lucide-react";
import { Section } from "@/components";
import { env } from "@/env";
import Link from "next/link";
import { cn } from "@/lib/utils";

// New API Response Types
type ExtraAgentPricing = {
  agents: number;
  price: number;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "MONTH" | "YEAR";
  trialDays: number;
  stripePriceId: string;
  stripeProductId: string;
  isActive: boolean;
  description: string;
  features: string[];
  planLevel: "only_ai" | "only_real_agent" | "ai_then_real_agent";
  defaultAgents: number;
  extraAgentPricing: ExtraAgentPricing[];
  totalMinuteLimit: number;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type ApiResponse = {
  success: boolean;
  message: string;
  data: Plan[];
};

const MONTHLY = "month";
const YEARLY = "year";

export default async function Pricing({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  query.plan = query.plan || MONTHLY;

  const response = await fetch(`${env.API_BASE_URL}/plans`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch plans");
  }

  const apiResponse: ApiResponse = await response.json();
  const plans = apiResponse.data;

  if (!plans || !plans.length) {
    return <div className="text-center py-6">No plans found</div>;
  }

  return (
    <Container>
      <div className="text-center space-y-4">
        <div className="max-w-3xl mx-auto">
          <Section.Heading>
            A Cost-Effective Solution That Grows with Your Business
          </Section.Heading>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="relative bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="p-6 pb-4 min-h-36">
              <h3 className="text-xl font-bold text-[#0B0B0B]">{plan.name}</h3>
              <p className="text-sm text-[#4D4D4D] mt-4">{plan.description}</p>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6 space-y-6 flex flex-col justify-stretch flex-1">
              <div className="border-t border-b border-gray-300 pt-8 pb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 uppercase">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">
                    /{plan.interval.toLowerCase()}
                  </span>
                </div>
                {plan.planLevel !== "only_ai" && (
                  <p className="text-xs text-gray-600">Per agent</p>
                )}
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                      <LucideCheck size={16} />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Extra Agent Pricing (Optional Display) */}
              {plan.extraAgentPricing.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    Extra Agents:
                  </p>
                  <div className="space-y-1">
                    {plan.extraAgentPricing.map((extra, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        +{extra.agents} agent{extra.agents > 1 ? "s" : ""}: $
                        {extra.price}/month
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <SubscriptionButton
              query={query}
              planLevel={plan.planLevel}
              planId={plan.id}
            />
          </div>
        ))}
      </div>
    </Container>
  );
}

function ChoosePlan({
  query,
}: {
  query: Record<string, string | string[] | undefined>;
}) {
  return (
    <div className="inline-flex gap-1 items-center border rounded p-0.5">
      <Link
        className={cn(
          "px-3 py-1.5 rounded cursor-pointer",
          MONTHLY === query.plan && "bg-primary text-white"
        )}
        href={{
          pathname: "buy-number",
          query: { ...query, plan: MONTHLY },
        }}
      >
        Monthly
      </Link>
      <Link
        className={cn("px-3 py-1.5 rounded cursor-pointer", {
          "bg-primary text-white": YEARLY === query.plan,
        })}
        href={{
          pathname: "buy-number",
          query: { ...query, plan: YEARLY },
        }}
      >
        Yearly
      </Link>
    </div>
  );
}

type SubscriptionButtonProps = {
  query: Record<string, string | string[] | undefined>;
  planLevel: string;
  planId: string;
};

function SubscriptionButton({
  query,
  planLevel,
  planId,
}: SubscriptionButtonProps) {
  return (
    <div className="px-6 py-8 relative">
      <Button asChild size="sm" className="w-full">
        <Link
          href={{
            pathname: "buy-number/checkout",
            query: { ...query, type: planLevel, pid: planId },
          }}
        >
          Get Started
        </Link>
      </Button>
    </div>
  );
}

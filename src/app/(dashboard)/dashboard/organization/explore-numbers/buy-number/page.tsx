import { Container, Button } from "@/components";
import { LucideCheck } from "lucide-react";
import { Section } from "@/components";
import { env } from "@/env";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface Plan {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: string | number;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  features: string[];
  planLevel: string;
  createdAt: string;
  updatedAt: string;
}

const MONTHLY = "month";
const YEARLY = "year";

export default async function Pricing({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const query = await searchParams;
  query.plan = query.plan || MONTHLY;
  const planInterval = query.plan;

  const response = await fetch(`${env.API_BASE_URL}/plans`, {
    next: { revalidate: 5000 },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch plans");
  }

  const { data: plans }: { data: Plan[] } = await response.json();

  if (!plans.length) {
    return <div className="text-center py-6">No plans found</div>;
  }

  const filteredPlans = plans.filter((plan) => plan.interval === planInterval);

  return (
    <Container>
      <div className="text-center space-y-4">
        <div className="max-w-3xl mx-auto">
          <Section.Heading>
            A Cost-Effective Solution That Grows with Your Business
          </Section.Heading>
        </div>
        {/* <div className="max-w-5xl mx-auto">
          <p className="text-lg">
            Get smart support without the high costs. Designed to adapt as your
            business expands, our solution offers flexibility, efficiency, and
            value — no matter your size.
          </p>
        </div> */}
        <ChoosePlan query={query} />
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        {filteredPlans.map((plan) => (
          <div
            key={plan.id}
            className="relative bg-white/80 backdrop-blur-sm border border-gray-200 shadow-lg rounded-lg overflow-hidden flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="p-6 pb-4 min-h-36">
              <h3 className="text-xl font-bold text-[#0B0B0B]">
                {plan.planName}
              </h3>
              <p className="text-sm text-[#4D4D4D] mt-4">{plan.description}</p>
            </div>

            {/* Card Content */}
            <div className="px-6 pb-6 space-y-6 flex flex-col justify-stretch flex-1">
              <div className="border-t border-b border-gray-300 pt-8 pb-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900 uppercase">
                    ${plan.amount}
                  </span>
                  <span className="text-gray-600">
                    /{plan.intervalCount} {plan.interval}
                  </span>
                </div>
                {plan.planLevel !== "only_ai" && (
                  <p className="text-xs text-gray-600">Per agent</p>
                )}
              </div>

              <div className="space-y-3">
                {plan?.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0">
                      <LucideCheck size={16} />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
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

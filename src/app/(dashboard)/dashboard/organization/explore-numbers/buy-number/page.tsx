import { Container, Button } from "@/components";
import { LucideCheck } from "lucide-react";
import { Section } from "@/components";
import { env } from "@/env";

export interface Plan {
  id: string;
  planName: string;
  amount: number;
  currency: string;
  interval: string;
  intervalCount: number;
  freeTrialDays: any;
  productId: string;
  priceId: string;
  active: boolean;
  description: string;
  features: string[];
  planLevel: string;
  createdAt: string;
  updatedAt: string;
}

export default async function Pricing() {
  const url = new URL(`${env.API_BASE_URL}/plans`);
  url.searchParams.set("interval", "1");

  const response = await fetch(url.toString(), {
    // optional caching config depending on your needs
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch plans");
  }

  const { data: plans }: { data: Plan[] } = await response.json();

  return (
    <Section className="bg-success-500">
      <Container>
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
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
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
                    <span className="text-4xl font-bold text-gray-900">
                      {plan.currency} {plan.amount}
                    </span>
                    <span className="text-gray-600">
                      /{plan.intervalCount} {plan.interval}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">Per agent</p>
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
              </div>

              <div className="px-6 py-8 relative">
                <Button size="sm" className="w-full">
                  Get Started
                </Button>
                <p className="text-[10px] text-gray-500 text-center mt-2 absolute inset-x-0">
                  No credit card required *
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

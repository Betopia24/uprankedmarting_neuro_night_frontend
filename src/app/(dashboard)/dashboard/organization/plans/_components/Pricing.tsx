"use client";

import { Container, Button } from "@/components";
import { LucideCheck } from "lucide-react";
import { Section } from "@/components";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { env } from "@/env";
import { useRouter } from "next/navigation";

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
  myPlanId: string;
};

export function Pricing({ plans, myPlanId }: PricingProps) {
  const { token } = useAuth();
  const [extraAgents, setExtraAgents] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  if (!plans.length) {
    return <div className="text-center py-6 text-gray-500">No plans found</div>;
  }

  const handleOpenDialog = (plan: Plan) => {
    setSelectedPlan(plan);
    setExtraAgents(0);
    setIsOpen(true);
  };

  const handleChangePlan = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/subscriptions/switch`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token || "",
          },
          body: JSON.stringify({
            newPlanId: selectedPlan.id,
            extraAgents,
          }),
        }
      );

      const json = await response.json();

      if (response.ok) {
        toast.success(json.message || "Subscription updated successfully");
        setIsOpen(false);
        router.refresh();
      } else {
        throw new Error(json.message || "Failed to change subscription");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to change subscription");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleExtraAgentsChange = (value: string) => {
    const num = parseInt(value) || 0;
    const clamped = Math.max(0, Math.min(3, num));
    setExtraAgents(clamped);
  };

  return (
    <Section className="bg-success-500">
      <Container>
        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-10">
          {plans.map((plan) => (
            <div
              key={plan.id}
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
                          +{extra.agents} agent{extra.agents > 1 ? "s" : ""}: $
                          {extra.price}/
                          {plan.interval === "month" ? "mo" : "yr"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="px-6 py-8">
                <Button
                  disabled={myPlanId === plan.id}
                  size="sm"
                  className={cn("w-full", myPlanId === plan.id && "opacity-50")}
                  onClick={() => handleOpenDialog(plan)}
                >
                  {myPlanId === plan.id && <span>Current Plan</span>}
                  {myPlanId !== plan.id && <span>Change Plan</span>}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Change Plan Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Change Subscription Plan</DialogTitle>
              <DialogDescription>
                You are changing to {selectedPlan?.planName} plan. Add extra
                agents if needed (0-3 agents).
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="extra-agents">Extra Agents (0-3)</Label>
                <Input
                  id="extra-agents"
                  name="extraAgents"
                  type="number"
                  min={0}
                  max={3}
                  value={extraAgents}
                  onChange={(e) => handleExtraAgentsChange(e.target.value)}
                  placeholder="0"
                />
                <p className="text-xs text-gray-500">
                  Enter a number between 0 and 3
                </p>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button disabled={isLoading}>Cancel</Button>
              </DialogClose>
              <Button
                type="submit"
                onClick={handleChangePlan}
                disabled={isLoading}
              >
                {isLoading ? "Changing..." : "Change Subscription"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Container>
    </Section>
  );
}

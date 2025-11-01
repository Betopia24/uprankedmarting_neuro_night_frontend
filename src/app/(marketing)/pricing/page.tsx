import ContactForm from "@/components/Contact";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { env } from "@/env";

// New API Response Types
type ExtraAgentPricing = {
  agents: number;
  price: number;
};

type RawPlan = {
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
  data: RawPlan[];
};

// Transformed Plan interface for the Pricing component
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

export default async function PricingPage() {
  const url = `${env.API_BASE_URL}/plans`;

  let plans: Plan[] = [];

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error(`Failed to fetch plans: ${res.statusText}`);

    const json: ApiResponse = await res.json();

    console.log(json);

    if (json.success && Array.isArray(json.data)) {
      plans = json.data.map<Plan>((p) => ({
        id: p.id,
        planName: p.name,
        amount: p.price,
        currency: p.currency.toLowerCase(),
        interval: p.interval === "MONTH" ? "month" : "year",
        intervalCount: 1,
        freeTrialDays: p.trialDays ?? null,
        productId: p.stripeProductId,
        priceId: p.stripePriceId,
        active: p.isActive,
        description: p.description,
        features: p.features,
        planLevel: p.planLevel,
        defaultAgents: p.defaultAgents,
        extraAgentPricing: p.extraAgentPricing,
        totalMinuteLimit: p.totalMinuteLimit,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
    }
  } catch (error) {
    console.error("Error fetching plans:", error);
  }

  return (
    <>
      <Pricing plans={plans} />
      <ContactForm />
    </>
  );
}

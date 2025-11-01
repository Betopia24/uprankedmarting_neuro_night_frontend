import ContactForm from "@/components/Contact";
import { Pricing } from "@/components/landing/pricing/Pricing";
import { env } from "@/env";

type PlanFeature = {
  aiSupport: boolean;
  analytics: boolean;
  customVoice: boolean;
  prioritySupport: boolean;
  realAgentSupport: boolean;
};

type RawPlan = {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: "MONTH" | "YEAR";
  trialDays?: number | null;
  stripeProductId: string;
  stripePriceId: string;
  isActive: boolean;
  description: string;
  features: PlanFeature;
  planLevel: string;
  createdAt: string;
  updatedAt: string;
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
  features: PlanFeature;
  planLevel: string;
  createdAt: string;
  updatedAt: string;
}

export default async function PricingPage() {
  const url = `${env.API_BASE_URL}/plans`;

  let plans: Plan[] = [];

  try {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error(`Failed to fetch plans: ${res.statusText}`);

    const json: { success: boolean; data: RawPlan[] } = await res.json();

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
        features: {
          aiSupport: p.features.aiSupport,
          analytics: p.features.analytics,
          customVoice: p.features.customVoice,
          prioritySupport: p.features.prioritySupport,
          realAgentSupport: p.features.realAgentSupport,
        },
        planLevel: p.planLevel,
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
      {/* <ContactForm /> */}
    </>
  );
}

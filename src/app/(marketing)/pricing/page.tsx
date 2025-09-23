import { Pricing } from "@/components/landing/pricing";
import { env } from "@/env";

interface Plan {
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
  createdAt: string;
  updatedAt: string;
}

export default async function PricingPage() {
  const url = `${env.API_BASE_URL}/plans`;

  let monthlyPlans: Plan[] = [];
  let yearlyPlans: Plan[] = [];

  try {
    const res = await fetch(url, {
      next: { revalidate: 500 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch plans: ${res.statusText}`);
    }

    const json = await res.json();

    if (json?.success && Array.isArray(json?.data)) {
      const plans: Plan[] = json.data;

      monthlyPlans = plans.filter((plan) => plan.interval === "month");
      yearlyPlans = plans.filter((plan) => plan.interval === "year");
    }
  } catch (error) {
    console.error("Error fetching plans:", error);
    // gracefully fallback with empty arrays
    monthlyPlans = [];
    yearlyPlans = [];
  }

  return <Pricing monthlyPlans={monthlyPlans} yearlyPlans={yearlyPlans} />;
}

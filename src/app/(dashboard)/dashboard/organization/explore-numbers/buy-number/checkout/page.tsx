import Subscription from "@/features/organization/Subscription";
import { notFound } from "next/navigation";

type CheckoutPageProps = {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const query = (await searchParams) ?? {};
  const { pid: planId, ci, ts } = query;

  if (!planId || !ci || !ts) {
    notFound();
  }

  const response = await fetch(`${process.env.API_BASE_URL}/plans/${planId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    notFound();
  }

  const planData = await response.json();
  const only_ai = planData.data.planLevel === "only_ai";

  return (
    <>{<Subscription only_ai={only_ai} planPrice={planData.data.amount} />}</>
  );
}

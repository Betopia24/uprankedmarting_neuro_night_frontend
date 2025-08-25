import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";
import fetchWithAuth from "@/lib/fetchWithAuth";

export default async function DashboardPage() {
  const d = await fetchWithAuth("/api/token", { method: "POST" });
  console.log(d);
  return (
    <>
      <CallGraph />
      <CallGraphBarChart />
    </>
  );
}

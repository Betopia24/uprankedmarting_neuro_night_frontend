import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";

export default async function DashboardPage() {
  return (
    <>
      <CallGraph />
      <CallGraphBarChart />
    </>
  );
}

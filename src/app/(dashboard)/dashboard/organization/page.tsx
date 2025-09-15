import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";

export default async function OrganizationDashboardPage() {
  return (
    <div className="space-y-6 flex-1">
      <CallGraph />
      <CallGraphBarChart />
    </div>
  );
}

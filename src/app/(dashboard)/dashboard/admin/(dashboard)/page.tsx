import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";
import Feedback from "@/features/dashboard/Feedback";

export default async function DashboardPage() {
  return (
    <div className="lg:flex gap-10">
      <div className="space-y-6 flex-1">
        <CallGraph />
        <CallGraphBarChart />
      </div>
      <div className="basis-72 max-w-72">
        <Feedback />
      </div>
    </div>
  );
}

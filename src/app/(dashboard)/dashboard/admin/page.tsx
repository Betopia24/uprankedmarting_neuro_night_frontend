import CallGraph from "./_components/CallGraph";
import CallGraphBarChart from "./_components/CallGraphBarChart";

export default async function DashboardPage() {
  return (
    <>
      <CallGraph />
      <CallGraphBarChart />
    </>
  );
}

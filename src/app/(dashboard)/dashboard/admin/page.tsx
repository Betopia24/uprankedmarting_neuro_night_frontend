import { env } from "@/env";
import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";
import Feedback from "@/features/dashboard/Feedback";

export const dynamic = "force-dynamic";
import { getServerAuth } from "@/lib/auth";

const DEFAULT_MONTH = 12;
const DEFAULT_YEAR = new Date().getFullYear();
const API_URL = `${env.API_BASE_URL}/dashboard/admin-dashboard-stats?month=${DEFAULT_MONTH}&year=${DEFAULT_YEAR}`;

type MonthlyReport = {
  month: string;
  successCalls: number;
  totalCalls: number;
  aiCalls: number;
  humanCalls: number;
  humanTotalCallDuration: number;
  aiTotalCallDuration: number;
};

type CallTiming = {
  avgTotalCallTime: number;
  avgAICallTime: number;
  avgHumanCallTime: number;
};

type DashboardStatsData = {
  totalCalls: number;
  totalHumanCalls: number;
  totalAICalls: number;
  totalSuccessCalls: number;
  todayHumanCalls: number;
  todayAICalls: number;
  todaySuccessCalls: number;
  monthlyReport: MonthlyReport[];
  callTiming: CallTiming;
};

type DashboardStatsResponse = {
  success: boolean;
  message: string;
  data: DashboardStatsData;
};

async function fetchDashboardStats(): Promise<DashboardStatsData | null> {
  const auth = await getServerAuth();
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 60 },
      headers: { Authorization: auth?.accessToken || "" },
    });

    if (!res.ok) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("API responded with status:", res.status);
      return null;
    }

    const json: DashboardStatsResponse = await res.json();
    if (!json.success) {
      env.NEXT_PUBLIC_APP_ENV === "development" &&
        console.error("API success flag false:", json.message);
      return null;
    }

    // No runtime validation here, trusting the API shape
    return json.data;
  } catch (error) {
    env.NEXT_PUBLIC_APP_ENV === "development" &&
      console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

export default async function OrganizationDashboardPage() {
  const statsData = await fetchDashboardStats();

  if (!statsData) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load dashboard statistics. Please try again later.
      </div>
    );
  }

  const callStats = {
    totalCalls: statsData.totalCalls,
    totalHumanCalls: statsData.totalHumanCalls,
    totalAICalls: statsData.totalAICalls,
    totalSuccessCalls: statsData.totalSuccessCalls,
    todayHumanCalls: statsData.todayHumanCalls,
    todayAICalls: statsData.todayAICalls,
    todaySuccessCalls: statsData.todaySuccessCalls,
    avgCallTime: statsData.callTiming.avgTotalCallTime,
    avgAICallTime: statsData.callTiming.avgAICallTime,
    avgHumanCallTime: statsData.callTiming.avgHumanCallTime,
  };

  return (
    <div className="lg:flex gap-10">
      <div className="space-y-6 flex-1">
        <CallGraph callStats={callStats} />
        <CallGraphBarChart monthlyReport={statsData.monthlyReport} />
      </div>
      <div className="basis-72 max-w-72">
        <Feedback />
      </div>
    </div>
  );
}

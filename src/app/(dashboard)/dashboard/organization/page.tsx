import { env } from "@/env";
import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";

export const dynamic = "force-dynamic";
import { getServerAuth } from "@/lib/auth";

const DEFAULT_MONTH = 12;
const DEFAULT_YEAR = new Date().getFullYear();
const API_URL = `${env.API_BASE_URL}/dashboard/stats?month=${DEFAULT_MONTH}&year=${DEFAULT_YEAR}`;

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
      console.error("API responded with status:", res.status);
      return null;
    }

    const json: DashboardStatsResponse = await res.json();
    if (!json.success) {
      console.error("API success flag false:", json.message);
      return null;
    }

    console.log(json.data);

    // No runtime validation here, trusting the API shape
    return json.data;
  } catch (error) {
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

  return (
    <div className="space-y-6 flex-1">
      <CallGraph />
      <CallGraphBarChart monthlyReport={statsData.monthlyReport} />
    </div>
  );
}

import { env } from "@/env";
import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

import { getServerAuth } from "@/lib/auth";

const DEFAULT_MONTH = 12;
const DEFAULT_YEAR = new Date().getFullYear();

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

async function fetchDashboardStats(
  year?: string | number
): Promise<DashboardStatsData | null> {
  const auth = await getServerAuth();
  // Add timestamp to prevent caching
  const timestamp = Date.now();
  const API_URL = `${
    env.API_BASE_URL
  }/dashboard/stats?month=${DEFAULT_MONTH}&year=${
    year || DEFAULT_YEAR
  }&_t=${timestamp}`;

  try {
    const res = await fetch(API_URL, {
      cache: "no-store",
      headers: {
        Authorization: auth?.accessToken || "",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
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

    return json.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return null;
  }
}

type Props = {
  searchParams: Promise<{ year?: string }>;
};

export default async function OrganizationDashboardPage({
  searchParams,
}: Props) {
  const params = await searchParams;
  const year = params.year;

  const statsData = await fetchDashboardStats(year);

  if (!statsData) {
    return (
      <div className="p-6 text-center text-red-600">
        Failed to load dashboard statistics. Please try again later.
      </div>
    );
  }

  const callStats = {
    totalCalls: statsData?.totalCalls,
    totalHumanCalls: statsData?.totalHumanCalls,
    totalAICalls: statsData?.totalAICalls,
    totalSuccessCalls: statsData?.totalSuccessCalls,
    todayHumanCalls: statsData?.todayHumanCalls,
    todayAICalls: statsData?.todayAICalls,
    todaySuccessCalls: statsData?.todaySuccessCalls,
    avgCallTime: statsData?.callTiming?.avgTotalCallTime,
    avgAICallTime: statsData?.callTiming?.avgAICallTime,
    avgHumanCallTime: statsData?.callTiming?.avgHumanCallTime,
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Add key prop to force re-render when year changes */}
      <CallGraph key={`graph-${year}`} callStats={callStats} />
      <CallGraphBarChart
        key={`chart-${year}`}
        monthlyReport={statsData.monthlyReport}
      />
    </div>
  );
}

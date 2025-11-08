"use client";

import { useEffect, useState, Suspense, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { env } from "@/env";
import Feedback from "@/features/dashboard/Feedback";
import PageLoader from "@/components/PageLoader";
import CallGraph from "@/features/dashboard/CallGraph";
import CallGraphBarChart from "@/features/dashboard/CallGraphBarChart";

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

export default function AdminDashboardPage() {
  const { token } = useAuth();

  const [statsData, setStatsData] = useState<DashboardStatsData | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [errorStats, setErrorStats] = useState<string | null>(null);

  const [year, setYear] = useState(DEFAULT_YEAR);
  const [barChartData, setBarChartData] = useState<MonthlyReport[]>([]);
  const [loadingChart, setLoadingChart] = useState(false);
  const [errorChart, setErrorChart] = useState<string | null>(null);

  const years = useMemo(
    () => Array.from({ length: 6 }, (_, i) => DEFAULT_YEAR - i),
    []
  );

  // Fetch main dashboard stats once
  useEffect(() => {
    if (!token) return;

    const fetchStats = async () => {
      setLoadingStats(true);
      setErrorStats(null);

      try {
        const timestamp = Date.now();
        const API_URL = `${env.NEXT_PUBLIC_API_URL}/dashboard/admin-dashboard-stats?month=${DEFAULT_MONTH}&year=${DEFAULT_YEAR}&_t=${timestamp}`;

        const res = await fetch(API_URL, {
          cache: "no-store",
          headers: { Authorization: token },
        });

        if (!res.ok) throw new Error(`API responded with status ${res.status}`);
        const json = await res.json();
        if (!json.success)
          throw new Error(json.message || "Failed to fetch stats");

        setStatsData(json.data);
        setBarChartData(json.data.monthlyReport); // initialize bar chart
      } catch (err: any) {
        console.error(err);
        setErrorStats(err.message || "Failed to load dashboard stats");
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, [token]);

  // Fetch bar chart only when year changes
  useEffect(() => {
    if (!token || !statsData) return;

    // If current year, use already fetched data
    if (year === DEFAULT_YEAR) {
      setBarChartData(statsData.monthlyReport);
      return;
    }

    const fetchBarChart = async () => {
      setLoadingChart(true);
      setErrorChart(null);

      try {
        const timestamp = Date.now();
        const API_URL = `${env.NEXT_PUBLIC_API_URL}/dashboard/admin-dashboard-stats?month=${DEFAULT_MONTH}&year=${year}&_t=${timestamp}`;

        const res = await fetch(API_URL, {
          cache: "no-store",
          headers: { Authorization: token },
        });

        if (!res.ok) throw new Error(`API responded with status ${res.status}`);
        const json = await res.json();
        if (!json.success)
          throw new Error(json.message || "Failed to fetch stats");

        setBarChartData(json.data.monthlyReport);
      } catch (err: any) {
        console.error(err);
        setErrorChart(err.message || "Failed to load bar chart data");
      } finally {
        setLoadingChart(false);
      }
    };

    fetchBarChart();
  }, [token, year, statsData]);

  if (!token)
    return <p className="text-center mt-10 text-red-600">No access token</p>;

  if (loadingStats) return <PageLoader />;

  return (
    <div className="space-y-6">
      {errorStats && (
        <p className="text-center mt-10 text-red-600">{errorStats}</p>
      )}

      {!loadingStats && statsData && (
        <div className="lg:flex gap-10">
          <div className="space-y-6 flex-1">
            <Suspense
              fallback={
                <p className="text-center text-gray-500">
                  Loading call graph...
                </p>
              }
            >
              <CallGraph
                callStats={{
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
                }}
              />
            </Suspense>

            {/* Year Selector for Bar Chart only */}
            <div className="mx-12 flex items-center gap-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter Bar Chart by Year
              </label>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value))}
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Bar Chart */}
            <Suspense
              fallback={
                <p className="text-center text-gray-500">
                  Loading bar chart...
                </p>
              }
            >
              {loadingChart && (
                <p className="text-center text-gray-500">
                  Loading bar chart...
                </p>
              )}
              {errorChart && (
                <p className="text-center text-red-600">{errorChart}</p>
              )}
              {!loadingChart && !errorChart && (
                <CallGraphBarChart monthlyReport={barChartData} />
              )}
            </Suspense>
          </div>

          <div className="basis-72 max-w-72">
            <Feedback />
          </div>
        </div>
      )}
    </div>
  );
}

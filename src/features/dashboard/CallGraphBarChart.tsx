"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface MonthlyReportItem {
  month: string; // e.g. "Oct 2024"
  successCalls: number;
  totalCalls: number;
  aiCalls: number;
  humanCalls: number;
  humanTotalCallDuration: number;
  aiTotalCallDuration: number;
}

interface CallDurationStats {
  totalHumanDuration: number;
  totalAIDuration: number;
  maxHumanDuration: number;
  maxAIDuration: number;
  largestValue: number;
  ticks: number[];
}

interface DashboardData {
  totalCalls: number;
  totalHumanCalls: number;
  totalAICalls: number;
  totalSuccessCalls: number;
  todayHumanCalls: number;
  todayAICalls: number;
  todaySuccessCalls: number;
  monthlyReport: MonthlyReportItem[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: DashboardData;
}

const apiResponse: ApiResponse = {
  success: true,
  message: "Organization Admin Dashboard statistics fetched successfully!",
  data: {
    totalCalls: 50,
    totalHumanCalls: 40,
    totalAICalls: 10,
    totalSuccessCalls: 25,
    todayHumanCalls: 2,
    todayAICalls: 1,
    todaySuccessCalls: 1,
    monthlyReport: [
      {
        month: "Oct 2024",
        successCalls: 2,
        totalCalls: 5,
        aiCalls: 1,
        humanCalls: 4,
        humanTotalCallDuration: 120,
        aiTotalCallDuration: 30,
      },
      {
        month: "Nov 2024",
        successCalls: 1,
        totalCalls: 4,
        aiCalls: 1,
        humanCalls: 3,
        humanTotalCallDuration: 90,
        aiTotalCallDuration: 20,
      },
      {
        month: "Dec 2024",
        successCalls: 3,
        totalCalls: 6,
        aiCalls: 2,
        humanCalls: 4,
        humanTotalCallDuration: 130,
        aiTotalCallDuration: 60,
      },
      {
        month: "Jan 2025",
        successCalls: 2,
        totalCalls: 5,
        aiCalls: 1,
        humanCalls: 4,
        humanTotalCallDuration: 110,
        aiTotalCallDuration: 40,
      },
      {
        month: "Feb 2025",
        successCalls: 2,
        totalCalls: 4,
        aiCalls: 0,
        humanCalls: 4,
        humanTotalCallDuration: 100,
        aiTotalCallDuration: 0,
      },
      {
        month: "Mar 2025",
        successCalls: 3,
        totalCalls: 7,
        aiCalls: 2,
        humanCalls: 5,
        humanTotalCallDuration: 140,
        aiTotalCallDuration: 50,
      },
      {
        month: "Apr 2025",
        successCalls: 1,
        totalCalls: 3,
        aiCalls: 1,
        humanCalls: 2,
        humanTotalCallDuration: 60,
        aiTotalCallDuration: 25,
      },
      {
        month: "May 2025",
        successCalls: 2,
        totalCalls: 5,
        aiCalls: 2,
        humanCalls: 3,
        humanTotalCallDuration: 90,
        aiTotalCallDuration: 55,
      },
      {
        month: "Jun 2025",
        successCalls: 2,
        totalCalls: 4,
        aiCalls: 1,
        humanCalls: 3,
        humanTotalCallDuration: 85,
        aiTotalCallDuration: 30,
      },
      {
        month: "Jul 2025",
        successCalls: 2,
        totalCalls: 5,
        aiCalls: 1,
        humanCalls: 4,
        humanTotalCallDuration: 95,
        aiTotalCallDuration: 40,
      },
      {
        month: "Aug 2025",
        successCalls: 1,
        totalCalls: 3,
        aiCalls: 0,
        humanCalls: 3,
        humanTotalCallDuration: 70,
        aiTotalCallDuration: 0,
      },
      {
        month: "Sep 2025",
        successCalls: 7,
        totalCalls: 7,
        aiCalls: 1,
        humanCalls: 6,
        humanTotalCallDuration: 600,
        aiTotalCallDuration: 1000,
      },
    ],
  },
};

const parseMonthString = (str: string): Date => {
  const [monthStr, yearStr] = str.split(" ");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const monthIndex = months.indexOf(monthStr);
  if (monthIndex === -1) {
    throw new Error(`Invalid month abbreviation: ${monthStr}`);
  }
  return new Date(Number(yearStr), monthIndex, 1);
};

const COLORS = {
  totalCalls: "#3b82f6", // Tailwind Blue 500
  successCalls: "#f97316", // Tailwind Orange 500
  aiCalls: "#8b5cf6", // Tailwind Purple 500
  humanCalls: "#06b6d4", // Tailwind Cyan 500
  aiTotalCallDuration: "#f59e0b", // Tailwind Amber 500
  humanTotalCallDuration: "#6366f1", // Tailwind Indigo 500
};

export default function DashboardChart() {
  // Sort monthly report by date
  const sortedReport = React.useMemo(() => {
    return [...apiResponse.data.monthlyReport].sort(
      (a, b) =>
        parseMonthString(a.month).getTime() -
        parseMonthString(b.month).getTime()
    );
  }, []);

  // Prepare data for chart
  const data = sortedReport.map((item) => ({
    name: item.month,
    totalCalls: item.totalCalls,
    successCalls: item.successCalls,
    aiCalls: item.aiCalls,
    humanCalls: item.humanCalls,
    aiTotalCallDuration: item.aiTotalCallDuration,
    humanTotalCallDuration: item.humanTotalCallDuration,
  }));

  // Calculate max value for Y-axis scale
  const maxValue = React.useMemo(() => {
    let max = 0;
    data.forEach((item) => {
      max = Math.max(
        max,
        item.totalCalls,
        item.successCalls,
        item.aiCalls,
        item.humanCalls,
        item.aiTotalCallDuration,
        item.humanTotalCallDuration
      );
    });
    return max;
  }, [data]);

  // Generate 10 ticks (11 values including 0) evenly spaced from 0 to maxValue
  const ticks = React.useMemo(() => {
    const step = Math.ceil(maxValue / 10);
    return Array.from({ length: 11 }, (_, i) => i * step);
  }, [maxValue]);

  return (
    <section
      style={{
        maxWidth: 1200,
        margin: "auto",
        padding: 16,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: 24,
          fontWeight: "700",
          color: "#333",
        }}
      >
        Organization Admin Dashboard Calls & Durations (Oct 2024 - Sep 2025)
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        {[
          { label: "Total Calls", value: apiResponse.data.totalCalls },
          { label: "Human Calls", value: apiResponse.data.totalHumanCalls },
          { label: "AI Calls", value: apiResponse.data.totalAICalls },
          {
            label: "Successful Calls",
            value: apiResponse.data.totalSuccessCalls,
          },
          {
            label: "Today's Human Calls",
            value: apiResponse.data.todayHumanCalls,
          },
          { label: "Today's AI Calls", value: apiResponse.data.todayAICalls },
          {
            label: "Today's Successful Calls",
            value: apiResponse.data.todaySuccessCalls,
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              background: "#f5f7fa",
              padding: "12px 24px",
              borderRadius: 8,
              boxShadow: "0 1px 4px rgb(0 0 0 / 0.1)",
              minWidth: 140,
              textAlign: "center",
              fontWeight: 600,
              color: "#444",
              userSelect: "none",
            }}
          >
            <div
              style={{
                fontSize: 14,
                marginBottom: 4,
                color: "#777",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {label}
            </div>
            <div style={{ fontSize: 22, color: "#222" }}>{value}</div>
          </div>
        ))}
      </div>

      <div style={{ width: "100%", height: 480 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
            barGap={0} // Remove gap between bars
            barCategoryGap="0%" // Remove gap between categories
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              interval={0}
              tick={{ fontSize: 12, fill: "#555" }}
              angle={-45}
              textAnchor="end"
              height={70}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{ fill: "#555", fontSize: 12 }}
              allowDecimals={false}
              ticks={ticks}
            />
            <Tooltip
              formatter={(value: number, name: string) => [
                typeof value === "number" ? value.toLocaleString() : value,
                name,
              ]}
              contentStyle={{ fontSize: 14 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 14, fontWeight: "600" }}
              verticalAlign="top"
              height={36}
            />
            <Bar
              dataKey="totalCalls"
              fill={COLORS.totalCalls}
              name="Total Calls"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="successCalls"
              fill={COLORS.successCalls}
              name="Successful Calls"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="aiCalls"
              fill={COLORS.aiCalls}
              name="AI Calls"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="humanCalls"
              fill={COLORS.humanCalls}
              name="Human Calls"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="aiTotalCallDuration"
              fill={COLORS.aiTotalCallDuration}
              name="AI Call Duration (sec)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="humanTotalCallDuration"
              fill={COLORS.humanTotalCallDuration}
              name="Human Call Duration (sec)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

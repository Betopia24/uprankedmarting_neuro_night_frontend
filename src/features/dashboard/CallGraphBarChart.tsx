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
import YearFilter from "./YearFilter";

interface MonthlyReportItem {
  month: string;
  successCalls: number;
  totalCalls: number;
  aiCalls: number;
  humanCalls: number;
  humanTotalCallDuration: number;
  aiTotalCallDuration: number;
}

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

export default function DashboardChart({
  monthlyReport,
}: {
  monthlyReport: MonthlyReportItem[];
}) {
  // Sort monthly report by date
  const sortedReport = React.useMemo(() => {
    return monthlyReport.sort(
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
    if (data.length === 0) return 10;

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
    return max > 0 ? max : 10;
  }, [data]);

  const ticks = React.useMemo(() => {
    const step = Math.ceil(maxValue / 10);
    if (step === 0) return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    return Array.from({ length: 11 }, (_, i) => i * step);
  }, [maxValue]);

  return (
    <section className="-mx-12">
      <YearFilter />
      <div style={{ width: "100%", height: 480 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
            barGap={2}
            barCategoryGap="0%"
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
              wrapperStyle={{
                fontSize: 14,
                fontWeight: "600",
              }}
              verticalAlign="top"
              height={54}
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
              name="Total Successful Calls"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="aiCalls"
              fill={COLORS.aiCalls}
              name="AI Successful Calls"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="humanCalls"
              fill={COLORS.humanCalls}
              name="Human Successful Calls"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="aiTotalCallDuration"
              fill={COLORS.aiTotalCallDuration}
              name="AI Successful Call Duration (sec)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="humanTotalCallDuration"
              fill={COLORS.humanTotalCallDuration}
              name="Human Successful Call Duration (sec)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

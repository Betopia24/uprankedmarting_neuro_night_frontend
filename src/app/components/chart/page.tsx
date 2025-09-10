"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";

type Range = "7d" | "30d" | "90d";

type DashboardProps = {
  title?: string;
  defaultRange?: Range;
};

const defaultKpis = [
  { label: "Revenue", value: "$82,400", delta: "+12.3%" },
  { label: "Orders", value: "1,245", delta: "+3.1%" },
  { label: "Active Users", value: "8,902", delta: "-1.2%" },
  { label: "Conversion", value: "3.7%", delta: "+0.4%" },
];

const trendDataBase = [
  { day: "Mon", revenue: 8200, orders: 160 },
  { day: "Tue", revenue: 10200, orders: 190 },
  { day: "Wed", revenue: 9800, orders: 180 },
  { day: "Thu", revenue: 11100, orders: 210 },
  { day: "Fri", revenue: 13500, orders: 240 },
  { day: "Sat", revenue: 9600, orders: 175 },
  { day: "Sun", revenue: 10000, orders: 185 },
];

const categoryBase = [
  { category: "Electronics", sales: 18200 },
  { category: "Apparel", sales: 12400 },
  { category: "Home", sales: 9800 },
  { category: "Beauty", sales: 7300 },
  { category: "Sports", sales: 6100 },
];

const sessionsBase = [
  { day: "Mon", sessions: 5200 },
  { day: "Tue", sessions: 6100 },
  { day: "Wed", sessions: 5750 },
  { day: "Thu", sessions: 6400 },
  { day: "Fri", sessions: 7100 },
  { day: "Sat", sessions: 4900 },
  { day: "Sun", sessions: 5300 },
];

const topProducts = [
  {
    sku: "SKU-001",
    name: "Wireless Headphones",
    price: 129,
    sold: 412,
    stock: 84,
  },
  { sku: "SKU-002", name: "Smart Watch Pro", price: 199, sold: 355, stock: 42 },
  { sku: "SKU-003", name: "Ergo Chair", price: 289, sold: 143, stock: 23 },
  { sku: "SKU-004", name: "Cotton T-Shirt", price: 25, sold: 920, stock: 350 },
  { sku: "SKU-005", name: "Running Shoes", price: 89, sold: 267, stock: 76 },
];

const recentOrders = [
  {
    id: "INV-10231",
    customer: "Alex Johnson",
    total: 249.99,
    status: "Paid",
    date: "2025-08-01",
  },
  {
    id: "INV-10230",
    customer: "Priya Singh",
    total: 89.0,
    status: "Pending",
    date: "2025-08-01",
  },
  {
    id: "INV-10229",
    customer: "Chen Wei",
    total: 129.99,
    status: "Paid",
    date: "2025-07-31",
  },
  {
    id: "INV-10228",
    customer: "Maria Gomez",
    total: 59.49,
    status: "Refunded",
    date: "2025-07-31",
  },
  {
    id: "INV-10227",
    customer: "John Smith",
    total: 399.0,
    status: "Paid",
    date: "2025-07-30",
  },
];

export default function Dashboard({
  title = "Dashboard",
  defaultRange = "7d",
}: DashboardProps) {
  const [range, setRange] = useState<Range>(defaultRange);

  // Fake "range" transforms: extend/duplicate the base arrays to simulate ranges
  const { trendData, categoryData, sessionsData, conversion } = useMemo(() => {
    const multiplier = range === "7d" ? 1 : range === "30d" ? 4 : 8;
    const extend = <T,>(arr: T[]) =>
      Array.from({ length: multiplier }, (_, i) =>
        arr.map((d) => ({
          ...d,
          day: (d as any).day
            ? `${(d as any).day} ${i + 1}`
            : (d as any).category,
        }))
      ).flat();

    const trend = extend(trendDataBase).map((d, i) => ({
      ...d,
      revenue: d.revenue + (i % 5) * 150,
      orders: d.orders + (i % 7) * 3,
    }));

    const cats = categoryBase.map((c, i) => ({
      ...c,
      sales: c.sales + multiplier * (i + 1) * 500,
    }));

    const sessions = extend(sessionsBase).map((d, i) => ({
      ...d,
      sessions: d.sessions + (i % 6) * 120,
    }));

    // Simulated conversion rate average
    const conv = 3.2 + (multiplier - 1) * 0.1;

    return {
      trendData: trend,
      categoryData: cats,
      sessionsData: sessions,
      conversion: parseFloat(conv.toFixed(1)),
    };
  }, [range]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
          <p className="text-sm text-neutral-500">
            Overview of your key metrics and recent activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label
            htmlFor="range"
            className="text-sm font-medium text-neutral-700"
          >
            Range
          </label>
          <select
            id="range"
            name="range"
            value={range}
            onChange={(e) => setRange(e.target.value as Range)}
            className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm text-neutral-900 shadow-sm outline-none focus:ring-2 focus:ring-neutral-800"
            aria-label="Select date range"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {defaultKpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6"
          >
            <div className="text-sm text-neutral-500">{kpi.label}</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900">
              {kpi.value}
            </div>
            <div
              className={`mt-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                kpi.delta.startsWith("-")
                  ? "bg-red-50 text-red-700 ring-1 ring-inset ring-red-100"
                  : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100"
              }`}
            >
              {kpi.delta}
            </div>
          </div>
        ))}
      </section>

      {/* Charts grid */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Revenue trend */}
        <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Revenue Trend
            </h2>
            <span className="text-xs text-neutral-500">
              Line and bar for revenue and orders
            </span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedTrend data={trendData} />
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sales by category */}
        <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Sales by Category
            </h2>
            <span className="text-xs text-neutral-500">Top categories</span>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e5e5" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e5e5" }}
                />
                <Tooltip cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Legend />
                <Bar
                  dataKey="sales"
                  name="Sales"
                  radius={[6, 6, 0, 0]}
                  fill="#0ea5a6"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sessions area */}
        <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Sessions
            </h2>
            <span className="text-xs text-neutral-500">Daily sessions</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sessionsData}>
                <defs>
                  <linearGradient
                    id="colorSessions"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e5e5" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={{ stroke: "#e5e5e5" }}
                />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="sessions"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSessions)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Conversion radial */}
        <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Conversion Rate
            </h2>
            <span className="text-xs text-neutral-500">Goal: 4.0%</span>
          </div>
          <div className="h-[260px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="90%"
                data={[
                  { name: "Conversion", value: conversion, fill: "#0ea5a6" },
                  {
                    name: "Remaining",
                    value: Math.max(0, 10 - conversion),
                    fill: "#e5e7eb",
                  },
                ]}
                startAngle={90}
                endAngle={-270}
              >
                <RadialBar
                  // minAngle={15}
                  background
                  // clockWise
                  dataKey="value"
                  cornerRadius={8}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <div className="text-3xl font-semibold text-neutral-900">
                {conversion}%
              </div>
              <div className="text-xs text-neutral-500">vs target 4.0%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Table and Recent activity */}
      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-7">
          <h2 className="mb-4 text-base font-semibold text-neutral-900">
            Top Products
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200 text-left text-sm">
              <thead>
                <tr className="text-neutral-600">
                  <th scope="col" className="px-3 py-2">
                    SKU
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Product
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Price
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Sold
                  </th>
                  <th scope="col" className="px-3 py-2">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {topProducts.map((p, idx) => (
                  <tr
                    key={p.sku}
                    className={idx % 2 === 0 ? "bg-white" : "bg-neutral-50"}
                  >
                    <td className="px-3 py-2 font-mono text-neutral-700">
                      {p.sku}
                    </td>
                    <td className="px-3 py-2 text-neutral-900">{p.name}</td>
                    <td className="px-3 py-2 text-neutral-900">${p.price}</td>
                    <td className="px-3 py-2 text-neutral-900">{p.sold}</td>
                    <td className="px-3 py-2 text-neutral-900">{p.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-span-1 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 lg:col-span-5">
          <h2 className="mb-4 text-base font-semibold text-neutral-900">
            Recent Orders
          </h2>
          <ul className="divide-y divide-neutral-200">
            {recentOrders.map((o) => (
              <li key={o.id} className="flex items-center justify-between py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900">
                    {o.id}
                  </div>
                  <div className="truncate text-xs text-neutral-500">
                    {o.customer}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                      o.status === "Paid"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-100"
                        : o.status === "Pending"
                        ? "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-100"
                        : "bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200"
                    }`}
                  >
                    {o.status}
                  </span>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-neutral-900">
                      ${o.total.toFixed(2)}
                    </div>
                    <div className="text-xs text-neutral-500">{o.date}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
type ComposedTrendData = {
  day: string;
  revenue: number;
  orders: number;
};

function ComposedTrend({ data }: { data: ComposedTrendData[] }) {
  return (
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
      <XAxis
        dataKey="day"
        tick={{ fontSize: 12 }}
        tickLine={false}
        axisLine={{ stroke: "#e5e5e5" }}
      />
      <YAxis
        tick={{ fontSize: 12 }}
        tickLine={false}
        axisLine={{ stroke: "#e5e5e5" }}
      />
      <Tooltip />
      <Legend />
      <Line
        type="monotone"
        dataKey="revenue"
        name="Revenue"
        stroke="#0ea5a6"
        strokeWidth={2}
        dot={false}
      />
      <Line
        type="monotone"
        dataKey="orders"
        name="Orders"
        stroke="#a3a3a3"
        strokeWidth={2}
        dot={{ r: 2, fill: "#a3a3a3" }}
      />
    </LineChart>
  );
}

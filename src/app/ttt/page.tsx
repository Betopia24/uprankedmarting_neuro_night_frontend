"use client";

import { useEffect, useState } from "react";
import clientApi from "@/lib/clientApi";
import accessTokenMemory from "@/lib/accessTokenMemory";

type DashboardData = {
  stats: any;
};

export default function TTT() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log({ d: accessTokenMemory.get() });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await clientApi.get(
          "https://eotlqwh5ogf6tyn.m.pipedream.net//dashboard-data"
        ); // BFF route or API proxy
        setData(res.data); // expects { data, role } or similar structure
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Dashboard Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

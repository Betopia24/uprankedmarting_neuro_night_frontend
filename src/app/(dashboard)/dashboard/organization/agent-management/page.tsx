"use client";

import { useAuth } from "@/components/AuthProvider";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { Button } from "@/components/ui/button";
import { useEffect, useState, Suspense, lazy } from "react";
import { ViewType } from "@/types/agent";

const AgentsList = lazy(() => import("./_components/AgentsList"));

export default function AgentManagementPage() {
  const { token } = useAuth();
  const [selectedTab, setSelectedTab] = useState<ViewType>("unassigned");
  const [users, setUsers] = useState<any[]>([]);
  const [metadata, setMetadata] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [planLevel, setPlanLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription once
  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const subscription = await getSubscriptionType(token);
        let plan =
          subscription?.data?.planLevel || subscription?.data?.plan?.planLevel;

        if (!plan) {
          const subs = subscription?.data?.organization?.subscriptions || [];
          const activeSub = Array.isArray(subs)
            ? subs.find((s) => s.status === "ACTIVE")
            : null;
          plan = activeSub?.planLevel ?? null;
        }

        setPlanLevel(plan);
      } catch (err) {
        console.error("Error fetching subscription:", err);
        setPlanLevel(null);
      }
    })();
  }, [token]);

  // Fetch agents when tab changes
  useEffect(() => {
    if (!token) return;

    const fetchAgents = async () => {
      setLoading(true);
      setError(null);
      setUsers([]); // Reset immediately
      setMetadata({ page: 1, limit: 10, total: 0, totalPages: 0 });

      try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL;
        const query = new URLSearchParams();
        query.set("viewType", selectedTab);
        query.set("limit", "10");

        const res = await fetch(`${apiBase}/agents?${query.toString()}`, {
          headers: { Authorization: token },
        });

        if (!res.ok) throw new Error("Failed to fetch agents");
        const data = await res.json();

        setUsers(data.data?.users || []);
        setMetadata(
          data.data?.metadata || { page: 1, limit: 10, total: 0, totalPages: 0 }
        );
      } catch (err: any) {
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, [token, selectedTab]);

  if (!token)
    return <p className="text-center mt-10 text-red-600">No access token</p>;

  if (planLevel === "only_ai")
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-4xl font-bold text-red-600">Oops!</h1>
        <p className="text-gray-700 mt-2">
          Your current plan does not allow access for Agent Management.
        </p>
        <Button className="mt-4" variant="link">
          <a href="/dashboard/organization/explore-numbers">
            Upgrade your plan
          </a>
        </Button>
      </div>
    );

  return (
    <div className="space-y-4">
      <Suspense
        fallback={
          <p className="text-center mt-10 text-gray-500">
            Loading agent list...
          </p>
        }
      >
        {/* Key by selectedTab to force remount on tab change */}
        <AgentsList
          key={selectedTab}
          users={users}
          viewParam={selectedTab}
          onTabChange={setSelectedTab}
          metadata={metadata}
          loading={loading}
          error={error}
        />
      </Suspense>
    </div>
  );
}

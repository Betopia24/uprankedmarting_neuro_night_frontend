import { getServerAuth } from "@/lib/auth";
import AgentsList from "@/app/(dashboard)/dashboard/organization/agent-management/_components/AgentsList";
import { getSubscriptionType } from "@/app/api/subscription/subscription";
import { Button } from "@/components/ui/button";

// -----------------------------
// Types
// -----------------------------
export interface AgentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  image: string;
  Agent: Agent;
}

export interface Agent {
  AgentFeedbacks: Record<string, string>[];
  skills: string[];
  totalCalls: number;
  isAvailable: boolean;
  status: string;
  assignTo: string;
  assignments: Assignment[];
  organization: Organization;
  avgRating: number;
  totalFeedbacks: number;
}

export interface Assignment {
  id: string;
  status: string;
  organizationId: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
}

export interface Metadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export type ViewType = "unassigned" | "my-agents";

interface AgentsApiSuccess {
  data: {
    users: AgentUser[];
    metadata: Metadata;
  };
}

interface AgentsApiError {
  error: string;
}

interface AgentsResult {
  users: AgentUser[];
  metadata: Metadata;
  error: string | null;
}

type Props = {
  searchParams: Promise<{ view?: ViewType; limit?: string }>;
};

// -----------------------------
// Safe Fetcher
// -----------------------------
async function fetchAgents(
  view: ViewType,
  limit?: number
): Promise<AgentsResult> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) {
    return {
      users: [],
      metadata: { page: 1, limit: 0, total: 0, totalPages: 0 },
      error: "Missing access token",
    };
  }

  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) {
    return {
      users: [],
      metadata: { page: 1, limit: 0, total: 0, totalPages: 0 },
      error: "Missing API_BASE_URL",
    };
  }

  const query = new URLSearchParams();
  query.set("viewType", view);
  if (limit && limit > 0) query.set("limit", String(limit));

  let response: Response;
  try {
    response = await fetch(`${apiBase}/agents?${query.toString()}`, {
      headers: { Authorization: `${auth.accessToken}` },
      cache: "no-store",
    });
  } catch (err) {
    return {
      users: [],
      metadata: { page: 1, limit: 0, total: 0, totalPages: 0 },
      error: `Network error: ${(err as Error).message}`,
    };
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    return {
      users: [],
      metadata: { page: 1, limit: 0, total: 0, totalPages: 0 },
      error: `Failed to fetch agents. Status: ${response.status}. Body: ${text}`,
    };
  }

  let json: AgentsApiSuccess | AgentsApiError;
  try {
    json = (await response.json()) as AgentsApiSuccess | AgentsApiError;
  } catch {
    return {
      users: [],
      metadata: { page: 1, limit: 0, total: 0, totalPages: 0 },
      error: "Invalid JSON response from API",
    };
  }

  if ("error" in json) {
    return {
      users: [],
      metadata: { page: 1, limit: 0, total: 0, totalPages: 0 },
      error: json.error,
    };
  }

  return {
    users: Array.isArray(json.data.users) ? json.data.users : [],
    metadata: json.data.metadata ?? {
      page: 1,
      limit: limit ?? 10,
      total: 0,
      totalPages: 0,
    },
    error: null,
  };
}

export default async function AgentManagementPage({ searchParams }: Props) {
  const auth = await getServerAuth();
  if (!auth?.accessToken) {
    console.error("Missing access token from getServerAuth()");
    return <div className="text-red-500">Unauthorized: No access token</div>;
  }
  const params = await searchParams;
  const viewParam: ViewType = params.view ?? "unassigned";
  const limit = params.limit ? parseInt(params.limit, 10) : 10;

  let planLevel: string | undefined;
  try {
    const subscription = await getSubscriptionType(auth.accessToken);

    planLevel =
      subscription?.data?.planLevel ||
      subscription?.data?.plan?.planLevel;

    if (!planLevel) {
      const subs = subscription?.data?.organization?.subscriptions || [];
      const activeSub = Array.isArray(subs)
        ? subs.find((s: any) => s.status === "ACTIVE")
        : null;
      planLevel = activeSub?.planLevel;
    }
  } catch (err) {
    console.error("Error fetching subscription:", err);
  }

  if (planLevel === "only_ai") {
    return (
      <div
        style={{
          height: "calc(100vh - var(--_sidebar-header-height))",
        }}
        className="flex flex-col items-center justify-center  bg-gray-50 px-4 text-center -mt-20"
      >
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-red-600 mb-4">Oops!</h1>
          <p className="text-lg text-gray-700 mb-6">Your current plan does not allow uploading documents for Agent Management.</p>
          <Button variant="link" className="mt-4">
            <a href="/dashboard/organization/explore-numbers">
              Upgrade your plan
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const { users, metadata, error } = await fetchAgents(viewParam, limit);

  if (error) {
    throw new Error(error);
  }

  return (
    <AgentsList
      users={users as AgentUser[]}
      viewParam={viewParam}
      metadata={metadata}
    />
  );
}

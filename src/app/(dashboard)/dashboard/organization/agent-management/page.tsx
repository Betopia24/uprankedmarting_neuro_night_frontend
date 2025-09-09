import { getServerAuth } from "@/lib/auth";
import AgentsList from "@/app/(dashboard)/dashboard/organization/agent-management/_components/AgentsList";

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
  const params = await searchParams;
  const viewParam: ViewType = params.view ?? "unassigned";
  const limit = params.limit ? parseInt(params.limit, 10) : 10;

  const { users, metadata, error } = await fetchAgents(viewParam, limit);

  if (error) {
    throw new Error(error);
  }

  console.log(await fetchAgents(viewParam, limit));

  return;

  return <AgentsList users={users} viewParam={viewParam} metadata={metadata} />;
}

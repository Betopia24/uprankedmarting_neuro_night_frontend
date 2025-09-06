import { getServerAuth } from "@/lib/auth";
import AgentsList from "@/features/organization/agent-management/AgentsList";
import {
  AgentUser,
  Metadata,
} from "@/features/organization/agent-management/types";

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
  searchParams: Promise<{ limit?: string }>;
};

async function approvalRequest(limit?: number): Promise<AgentsResult> {
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
  if (limit && limit > 0) query.set("limit", String(limit));

  let response: Response;
  try {
    response = await fetch(`${apiBase}/agents/get-all-assignments-request`, {
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
  const limit = params.limit ? parseInt(params.limit, 10) : 10;

  const { users, metadata, error } = await approvalRequest(limit);

  console.log(users);

  if (error) {
    throw new Error(error);
  }

  return;

  // return <AgentsList users={users} metadata={metadata} />;
}

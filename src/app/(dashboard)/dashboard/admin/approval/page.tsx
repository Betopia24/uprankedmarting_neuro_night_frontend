import { getAccessToken } from "@/lib/auth";
import AgentsList from "./_components/AgentsList";
import { StatusType } from "@/types/agent";
import type { AgentUser, Metadata } from "@/types/agent"; // reuse your existing types

type Props = {
  searchParams: Promise<{ status?: StatusType; limit?: string }>;
};

const queryDict: Record<StatusType, string> = {
  approval: "PENDING",
  removal: "REMOVAL_REQUESTED",
};

interface BackendResponse {
  success: boolean;
  message: string;
  data: {
    meta: Metadata;
    data: AgentUser[];
  };
}

// -----------------------------
// Fetcher
// -----------------------------
async function fetchAgents(
  status: StatusType,
  limit?: number
): Promise<{ users: AgentUser[]; metadata: Metadata }> {
  const accessToken = await getAccessToken();

  const apiBase = process.env.API_BASE_URL;
  if (!apiBase) throw new Error("Missing API_BASE_URL");

  const dictStatus = queryDict[status];
  const query = new URLSearchParams();
  if (dictStatus) query.set("viewType", dictStatus);
  if (limit && limit > 0) query.set("limit", String(limit));

  const response = await fetch(
    `${apiBase}/agents/all-agent-assignment-request?${query.toString()}`,
    {
      headers: { Authorization: accessToken as string },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch agents. Status: ${response.status}. Body: ${text}`
    );
  }

  const json = (await response.json()) as BackendResponse;

  // Reshape backend to match your existing types
  return {
    users: json.data.data ?? [],
    metadata: json.data.meta ?? {
      page: 1,
      limit: limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
}

// -----------------------------
// Page Component
// -----------------------------
export default async function AgentManagementPage({ searchParams }: Props) {
  const params = await searchParams;
  const statusParam: StatusType = params.status ?? "approval";
  const limit = params.limit ? parseInt(params.limit, 10) : 10;

  const { users, metadata } = await fetchAgents(statusParam, limit);

  return (
    <AgentsList users={users} statusParam={statusParam} metadata={metadata} />
  );
}

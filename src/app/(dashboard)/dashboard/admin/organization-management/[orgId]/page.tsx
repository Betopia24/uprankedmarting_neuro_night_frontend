import type { AgentsApiResponse } from "@/types/admin-agent-management";
import { env } from "@/env";
import { getAccessToken } from "@/lib/auth";
import AgentCards from "./AgentCards";
import SearchField from "@/components/table/components/SearchField";

export interface AgentCardParams {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
  status?: string | string[];
  role?: string | string[];
  earning_range?: string;
  [key: string]: string | string[] | undefined | number;
}

interface AgentCard {
  searchParams: Promise<AgentCardParams>;
  params: Promise<{ orgId: string }>;
}

interface AgentCardData {
  id: string;
  name: string;
  employeeId: string;
  successCalls: number;
  droppedCalls: number;
  performance: string;
  title?: string;
  description?: string;
  isAssigned: boolean;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 2; // 6 cards per page

async function getAgents(
  queryParams: AgentCardParams
): Promise<AgentsApiResponse | null> {
  const accessToken = await getAccessToken();

  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    query = "",
  } = queryParams;

  const url = new URL(`${env.API_BASE_URL}/agents/agents-management-info`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (query) url.searchParams.set("searchTerm", query);

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: accessToken as string },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    return res.json();
  } catch (err) {
    env.NEXT_PUBLIC_APP_ENV === "development" &&
      console.error("Server fetch error:", err);
    return null;
  }
}

export default async function AllAgentInfo({
  searchParams,
  params,
}: AgentCard) {
  const queryParams = await searchParams;
  const { orgId } = await params;
  const response = await getAgents(queryParams);

  if (!response) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        Failed to load agents.
      </div>
    );
  }

  const { data: agents, meta } = response.data;

  const currentPage = Math.max(1, Math.min(meta.page, meta.totalPages));
  const totalPages = meta.totalPages;
  const basePath = `/dashboard/admin/organization-management/${orgId}`;

  // Map agent data to card format
  const agentCards: AgentCardData[] = agents.map((agent) => {
    const { employeeId, successCalls, droppedCalls } = agent.Agent;
    const totalCalls = successCalls + droppedCalls;

    return {
      id: agent.id,
      name: agent.name,
      employeeId: employeeId || "N/A",
      successCalls,
      droppedCalls,
      performance: ((successCalls / (totalCalls || 1)) * 100).toFixed(0) + "%",
      title: agent.Agent?.role || "Agent",
      description:
        agent.Agent?.bio || "Experienced agent with proven track record.",
      isAssigned: agent.Agent?.organizationId === orgId,
    };
  });

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and assign agents to this organization
          </p>
        </div>
        <SearchField
          basePath={basePath}
          defaultQuery={queryParams.query || ""}
        />
      </div>

      <AgentCards
        agents={agentCards}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        orgId={orgId}
      />
    </div>
  );
}

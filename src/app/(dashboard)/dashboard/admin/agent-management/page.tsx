import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import type { AgentsApiResponse } from "@/types/admin-agent-management";
import {
  adminAgentCreatePath,
  adminAgentDetailsPath,
  adminAgentManagementPath,
} from "@/paths";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import Link from "next/link";
import { toAmPm } from "@/lib/ampm";
import { Button } from "@/components";

const config = {
  basePath: adminAgentManagementPath(),
};

export interface TableSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
  status?: string | string[];
  role?: string | string[];
  earning_range?: string;
  [key: string]: string | string[] | undefined | number;
}

interface TableProps {
  searchParams: Promise<TableSearchParams>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

/** Fetch agents from backend with pagination + search */
async function getAgents(
  queryParams: TableSearchParams
): Promise<AgentsApiResponse | null> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) return null;

  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    sort = "",
    query = "",
  } = queryParams;

  const url = new URL(`${env.API_BASE_URL}/agents/agents-management-info`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (sort) url.searchParams.set("sort", sort);
  if (query) url.searchParams.set("searchTerm", query);

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: auth.accessToken },
      cache: "no-cache",
    });

    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("Server fetch error:", err);
    return null;
  }
}

export default async function CallManageAndLogsPage({
  searchParams,
}: TableProps) {
  const queryParams = await searchParams;
  const response = await getAgents(queryParams);

  // If response is null (auth fail or fetch error)
  if (!response) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        Failed to load agents.
      </div>
    );
  }

  const { data: agents, meta } = response.data;

  // Validate page value against backend meta
  const currentPage = Math.max(1, Math.min(meta.page, meta.totalPages));
  const totalPages = meta.totalPages;

  // extract sort
  const [sortField, sortDirection = ""] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");

  // Parse filters (if any extra)
  const currentFilters = parseFilters(queryParams);

  // Map agent data to table rows
  const tableData = agents.map((agent) => {
    const {
      employeeId,
      workStartTime,
      workEndTime,
      successCalls,
      droppedCalls,
    } = agent.Agent;
    const totalCalls = successCalls + droppedCalls;

    return {
      id: agent.id,
      "Agent Name": agent.name,
      "Employee ID": employeeId || "N/A",
      "Office Hour": toAmPm(workStartTime) + " - " + toAmPm(workEndTime),
      "Success Call": successCalls,
      "Dropped Call": droppedCalls,
      Performance: ((successCalls / totalCalls || 0) * 100).toFixed(0) + "%",
    };
  });

  // Always render headers (even if no rows)
  const tableHeader =
    tableData.length > 0
      ? Object.keys(tableData[0])
      : [
          "Agent Name",
          "Employee ID",
          "Office Hour",
          "Success Call",
          "Dropped Call",
          "Performance",
        ];

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField
          basePath={config.basePath}
          defaultQuery={queryParams.query || ""}
        />
        <Button size="sm" asChild>
          <Link href={adminAgentCreatePath()}>+ Create Agent</Link>
        </Button>
      </div>

      {/* Table container */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-50 text-gray-900 text-sm font-medium border-b border-gray-200">
            <tr>
              {tableHeader.map((field) => (
                <TableHeaderItem
                  key={field}
                  field={field}
                  currentSort={sortField}
                  sortDirection={sortDirection}
                  currentPage={currentPage}
                  limit={meta.limit}
                  searchQuery={queryParams.query || ""}
                  basePath={config.basePath}
                  currentFilters={currentFilters}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.length > 0 ? (
              tableData.map((item) => {
                const fields = Object.values(item);
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    {fields.map((field, index) => (
                      <td
                        key={index}
                        className="px-4 py-3 border border-gray-200"
                      >
                        <Link
                          href={adminAgentDetailsPath(item.id)}
                          className="hover:text-blue-600 font-medium"
                        >
                          {field}
                        </Link>
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={tableHeader.length}
                  className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                >
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={currentPage < totalPages}
        hasPrevPage={currentPage > 1}
        limit={meta.limit}
        sortField={sortField}
        sortDirection={sortDirection}
        basePath={config.basePath}
      />
    </div>
  );
}

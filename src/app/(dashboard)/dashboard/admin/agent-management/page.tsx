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
import { getAccessToken } from "@/lib/auth";
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

interface TableRow {
  id: string;
  "Agent Name": string;
  "Employee ID": string;
  "Success Call": number;
  "Dropped Call": number;
  Performance: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

/** Fetch agents from backend with pagination + search */
async function getAgents(
  queryParams: TableSearchParams
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

// Client-side sort function
function sortData<T>(
  data: T[],
  field: keyof T,
  direction: "asc" | "desc"
): T[] {
  if (!field) return data;
  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
}

// Client-side filter function
function filterData(data: TableRow[], query: string): TableRow[] {
  if (!query) return data;
  return data.filter(
    (item) =>
      item["Agent Name"].toLowerCase().includes(query.toLowerCase()) ||
      item["Employee ID"].toLowerCase().includes(query.toLowerCase())
  );
}

export default async function CallManageAndLogsPage({
  searchParams,
}: TableProps) {
  const queryParams = await searchParams;
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

  const currentFilters = parseFilters(queryParams);

  const [sortField, sortDirection = "asc"] = (queryParams.sort || "").split(
    ":"
  );

  // Map agent data to table rows
  const tableData: TableRow[] = agents.map((agent) => {
    const {
      employeeId,

      successCalls,
      droppedCalls,
    } = agent.Agent;
    const totalCalls = successCalls + droppedCalls;
    return {
      id: agent.id,
      "Agent Name": agent.name,
      "Employee ID": employeeId || "N/A",
      "Success Call": successCalls,
      "Dropped Call": droppedCalls,
      Performance: ((successCalls / totalCalls || 0) * 100).toFixed(0) + "%",
    };
  });

  // Apply client-side filtering and sorting
  const filteredData = filterData(tableData, queryParams.query || "");
  const sortedData = sortData(
    filteredData,
    sortField as keyof TableRow,
    sortDirection as "asc" | "desc"
  );

  const tableHeader =
    sortedData.length > 0
      ? Object.keys(sortedData[0])
      : [
          "Agent Name",
          "Employee ID",
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
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {Object.values(item).map((field, index) => (
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
              ))
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

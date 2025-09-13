import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import paginateData from "@/components/table/utils/paginateData";
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

async function getAgents(): Promise<AgentsApiResponse | null> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) return null;

  try {
    const res = await fetch(
      `${env.API_BASE_URL}/agents/agents-management-info`,
      {
        headers: { Authorization: auth.accessToken },
        cache: "no-cache",
      }
    );

    if (!res.ok) throw new Error(`Network error: ${res.status}`);

    const json: AgentsApiResponse = await res.json();

    if (!json.data?.data?.length) return null;

    return json;
  } catch (err) {
    console.error("Server fetch error:", err);
    return null;
  }
}

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

export default async function CallManageAndLogsPage({
  searchParams,
}: TableProps) {
  const response = await getAgents();

  if (!response || !response.data?.data?.length) {
    return (
      <div className="py-8 text-center text-gray-500">No agents available.</div>
    );
  }

  console.log(response?.data?.data);

  const data = response?.data?.data.map((agent) => {
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

  const queryParams = await searchParams;
  const page = Number(queryParams.page) || DEFAULT_PAGE;
  const limit = Number(queryParams.limit) || DEFAULT_LIMIT;

  const [sortField, sortDirection = ""] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");

  const searchQuery = queryParams.query || "";

  const tableHeader = Object.keys(data[0]);

  // Parse filters from URL
  const currentFilters = parseFilters(queryParams);

  // Calculate pagination info based on filtered data
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginatedData = paginateData(data, page, limit);

  const filteredData = paginatedData.filter(
    (d) =>
      d["Agent Name"].toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.id.includes(searchQuery)
  );

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-between">
        <SearchField basePath={config.basePath} defaultQuery={searchQuery} />
        <Button>
          <Link href={adminAgentCreatePath()}>Create Agent</Link>
        </Button>
      </div>

      <table className="table-auto border-collapse border border-gray-200 w-full text-gray-800">
        <thead>
          <tr className="bg-gray-100">
            {tableHeader.map((field) => (
              <TableHeaderItem
                key={field}
                field={field}
                currentSort={sortField}
                sortDirection={sortDirection}
                currentPage={page}
                limit={limit}
                searchQuery={searchQuery}
                basePath={config.basePath}
                currentFilters={currentFilters}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => {
            const fields = Object.values(item);
            return (
              <tr key={item.id}>
                {fields.map((field, index) => (
                  <td key={index} className="border border-gray-200 p-2">
                    <Link href={`${adminAgentDetailsPath(item.id)}`}>
                      {field}
                    </Link>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        hasNextPage={hasNextPage}
        hasPrevPage={hasPrevPage}
        limit={limit}
        sortField={sortField}
        sortDirection={sortDirection}
        basePath={config.basePath}
      />
    </div>
  );
}

import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { sortData } from "@/components/table/utils/sortData";
import paginateData from "@/components/table/utils/paginateData";
import type { AgentsApiResponse } from "@/types/admin-agent-management";
import { adminAgentManagementPath } from "@/paths";
import {
  applyFilters,
  filterData,
  parseFilters,
} from "@/components/table/utils/filters";
import Filter, { FilterField } from "@/components/table/components/Filter";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";

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
        cache: "no-store",
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
const PICKED_HEADER = [
  {
    name: "Agent Name",
  },
];

const filterFields: FilterField[] = [
  {
    key: "status",
    label: "Status",
    type: "multi-select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    key: "role",
    label: "Role",
    type: "select",
    options: [
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
    ],
  },
  // {
  //   key: "earning_range",
  //   label: "Earning Range",
  //   type: "select",
  //   options: [
  //     { label: "Under $3,000", value: "under_3000" },
  //     { label: "$3,000 - $5,000", value: "3000_5000" },
  //     { label: "Above $5,000", value: "above_5000" },
  //   ],
  // },
];

export default async function CallManageAndLogsPage({
  searchParams,
}: TableProps) {
  const response = await getAgents();

  if (!response || !response.data?.data?.length) {
    return (
      <div className="py-8 text-center text-gray-500">No agents available.</div>
    );
  }

  const data = response?.data?.data || [];

  const normalaized = data.map((agent) => {
    const { employeeId, workStartTime, workEndTime } = agent.Agent;
    return {
      id: agent.id,
      "Agent Name": agent.name,
      "Employee ID": agent.Agent.employeeId,
      "Office Hour": "",
      "Success Call": "",
      "Dropped Call": "",
      Performance: "",
    };
  });

  console.log(normalaized);

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

  // Apply filtering (but not sorting or pagination yet)
  let filteredData = [...data];

  // // Apply search filter
  // filteredData = filterData(filteredData, searchQuery);

  // // Apply field filters
  // filteredData = applyFilters(filteredData, currentFilters);

  // Calculate pagination info based on filtered data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginatedData = paginateData(data, page, limit);

  // const sortedPaginatedData = sortData(paginatedData, sortField, sortDirection);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 justify-between">
        <SearchField basePath={config.basePath} defaultQuery={searchQuery} />

        <Filter
          filterFields={filterFields}
          currentFilters={currentFilters}
          searchQuery={searchQuery}
          currentPage={page}
          limit={limit}
          sortField={sortField}
          sortDirection={sortDirection}
          basePath={config.basePath}
        />
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
        {/* <tbody>
          {sortedPaginatedData.map((item) => {
            const fields = Object.values(item);
            return (
              <tr key={item.id}>
                {fields.map((field, index) => (
                  <td key={index} className="border border-gray-200 p-2">
                    {field}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody> */}
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

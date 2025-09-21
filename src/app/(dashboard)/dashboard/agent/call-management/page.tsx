import React from "react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { agentCallManagementPath } from "@/paths";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatSecondsToHMS } from "@/utils/formatSecondsToHMS";

export interface TableSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
  [key: string]: string | string[] | number | undefined;
}

interface TableProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

interface AgentCall {
  id: string;
  to_number: string;
  callType: string;
  call_status: string;
  call_duration: number;
  call_time: string;
}

interface AgentCallApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: AgentCall[];
  };
}

interface TableRow {
  id: string;
  calledNumber: string;
  callType: string;
  callStatus: string;
  callTime: string; // formatted date and time
  callDuration: string; // formatted H:M:S

  // raw for sorting if needed
  _rawCallTime: string;
  _rawCallDuration: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

async function getAgentCalls(
  params: TableSearchParams
): Promise<AgentCallApiResponse | null> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) return null;

  const url = new URL(`${env.API_BASE_URL}/agents/agent-calls-management-info`);
  url.searchParams.set("page", String(params.page ?? DEFAULT_PAGE));
  url.searchParams.set("limit", String(params.limit ?? DEFAULT_LIMIT));
  if (params.sort) url.searchParams.set("sort", String(params.sort));
  if (params.query) url.searchParams.set("searchTerm", String(params.query));

  const res = await fetch(url.toString(), {
    headers: { Authorization: auth.accessToken },
    cache: "no-cache",
  });
  if (!res.ok) return null;

  const json: AgentCallApiResponse = await res.json();
  return json;
}

export default async function AgentCallManagementPage({
  searchParams,
}: TableProps) {
  const sp: Record<string, string | string[] | undefined> = searchParams
    ? await searchParams
    : {};

  const queryParams: TableSearchParams = {
    page: sp.page
      ? parseInt(Array.isArray(sp.page) ? sp.page[0] : sp.page, 10)
      : DEFAULT_PAGE,
    limit: sp.limit
      ? parseInt(Array.isArray(sp.limit) ? sp.limit[0] : sp.limit, 10)
      : DEFAULT_LIMIT,
    sort: sp.sort
      ? Array.isArray(sp.sort)
        ? sp.sort[0]
        : sp.sort
      : DEFAULT_SORT,
    query: sp.query ? (Array.isArray(sp.query) ? sp.query[0] : sp.query) : "",
  };

  const response = await getAgentCalls(queryParams);
  if (!response || !response.data)
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        Failed to load agent calls.
      </div>
    );

  const { data: calls, meta } = response.data;

  const tableData: TableRow[] = calls.map((call) => ({
    id: call.id,
    calledNumber: call.to_number,
    callType: call.callType.charAt(0).toUpperCase() + call.callType.slice(1),
    callStatus:
      call.call_status.charAt(0).toUpperCase() + call.call_status.slice(1),
    callTime: formatDateTime(call.call_time),
    callDuration: formatSecondsToHMS(call.call_duration),
    _rawCallTime: call.call_time,
    _rawCallDuration: call.call_duration,
  }));

  const tableHeader: (keyof TableRow)[] = [
    "calledNumber",
    "callType",
    "callStatus",
    "callTime",
    "callDuration",
  ];

  const currentFilters = parseFilters(queryParams);
  const basePath = agentCallManagementPath();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField
          basePath={basePath}
          defaultQuery={queryParams.query ?? ""}
        />
      </div>

      <div className="w-full overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-50 text-gray-900 text-sm font-medium border-b border-gray-200">
            <tr>
              {tableHeader.map((field) => (
                <TableHeaderItem
                  key={field}
                  field={field}
                  currentSort={queryParams.sort ?? ""}
                  sortDirection="asc"
                  currentPage={queryParams.page ?? 1}
                  limit={meta.limit}
                  searchQuery={queryParams.query ?? ""}
                  basePath={basePath}
                  currentFilters={currentFilters}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tableData.length > 0 ? (
              tableData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.calledNumber}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.callType}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.callStatus}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.callTime}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.callDuration}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                >
                  No agent calls found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        hasNextPage={meta.page < meta.totalPages}
        hasPrevPage={meta.page > 1}
        limit={meta.limit}
        sortField={queryParams.sort ?? ""}
        sortDirection="asc"
        basePath={basePath}
      />
    </div>
  );
}

import React from "react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { organizationCallLogsPath } from "@/paths";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import { formatDateTime } from "@/utils/formatDateTime";
import { formatSecondsToHMS } from "@/utils/formatSecondsToHMS";
import PlayCallRecord from "@/components/PlayCallRecord";

export interface TableSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
  [key: string]: string | string[] | number | undefined;
}

interface TableProps {
  searchParams?: Promise<{
    [key: string]: string | string[] | undefined;
  }>;
}

interface OrganizationAdmin {
  id: string;
  to_number: string;
  callType: string;
  call_time: string;
  call_duration: number;
  from_number: string;
  type: string;
  agent_name: string;
  recording_url: string;
  call_sid: string;
  conversation_id: string;
}

interface OrganizationApiResponse {
  success: boolean;
  message: string;
  data: {
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    data: OrganizationAdmin[];
  };
}

interface TableRow {
  id: string;
  calledNumber: string;
  callerNumber: string;
  callType: string;
  callTime: string; // formatted
  callDuration: string; // formatted H:M:S
  receivedBy: string;
  agentName: string;
  callRecord: string;
  // raw fields for sorting
  _rawCallTime: string;
  _rawCallDuration: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

async function getOrganizations(
  params: TableSearchParams
): Promise<OrganizationApiResponse | null> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) return null;

  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const query = typeof params.query === "string" ? params.query : "";

  const url = new URL(
    `${env.API_BASE_URL}/organizations/organization-call-logs`
  );
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (query) url.searchParams.set("searchTerm", query);
  if (params.sort) url.searchParams.set("sort", String(params.sort));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: auth.accessToken,
    },
    cache: "no-cache",
  });
  if (!res.ok) {
    console.error("Fetch error code:", res.status);
    return null;
  }
  const json = await res.json();
  return json;
}

function sortData(
  data: TableRow[],
  field: keyof TableRow,
  direction: "asc" | "desc"
): TableRow[] {
  if (!field) return data;

  return [...data].sort((a, b) => {
    let aV: string | number = a[field] as any;
    let bV: string | number = b[field] as any;

    // handle special cases
    if (field === "callTime") {
      aV = new Date(a._rawCallTime).getTime();
      bV = new Date(b._rawCallTime).getTime();
    } else if (field === "callDuration") {
      aV = a._rawCallDuration;
      bV = b._rawCallDuration;
    }

    if (typeof aV === "number" && typeof bV === "number") {
      return direction === "asc" ? aV - bV : bV - aV;
    }

    return direction === "asc"
      ? String(aV).localeCompare(String(bV))
      : String(bV).localeCompare(String(aV));
  });
}

function filterData(data: TableRow[], query: string): TableRow[] {
  if (!query) return data;
  const q = query.toLowerCase();

  return data.filter(
    (item) =>
      item.calledNumber.toLowerCase().includes(q) ||
      item.callType.toLowerCase().includes(q) ||
      item.receivedBy.toLowerCase().includes(q) ||
      item.agentName.toLowerCase().includes(q)
  );
}

export default async function OrganizationAdminPage({
  searchParams,
}: TableProps) {
  const sp = searchParams ? await searchParams : {};

  const queryParams: TableSearchParams = {
    page: sp.page
      ? Array.isArray(sp.page)
        ? parseInt(sp.page[0], 10)
        : parseInt(sp.page as string, 10)
      : DEFAULT_PAGE,
    limit: sp.limit
      ? Array.isArray(sp.limit)
        ? parseInt(sp.limit[0], 10)
        : parseInt(sp.limit as string, 10)
      : DEFAULT_LIMIT,
    sort: sp.sort
      ? Array.isArray(sp.sort)
        ? sp.sort[0]
        : sp.sort
      : DEFAULT_SORT,
    query: sp.query ? (Array.isArray(sp.query) ? sp.query[0] : sp.query) : "",
  };

  const response = await getOrganizations(queryParams);

  if (!response || !response.data) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        Failed to load organization admins.
      </div>
    );
  }

  const { data: organizations, meta } = response.data;

  console.log({ organizations });

  const tableData: TableRow[] = organizations.map((org) => ({
    id: org.id,
    calledNumber: org.to_number,
    callerNumber: org.from_number,
    callType: org.callType.slice(0, 1).toUpperCase() + org.callType.slice(1),
    callTime: formatDateTime(org.call_time),
    callDuration: formatSecondsToHMS(org.call_duration),
    receivedBy: org.type.toUpperCase(),
    agentName: org.agent_name || "AI",
    callRecord: org.conversation_id || org.call_sid,
    _rawCallTime: org.call_time,
    _rawCallDuration: org.call_duration,
  }));

  const [sortField, sortDirection] = (queryParams.sort || "").split(":") as [
    string,
    string?
  ];

  const filtered = filterData(tableData, queryParams.query || "");
  const sorted = sortField
    ? sortData(
        filtered,
        sortField as keyof TableRow,
        sortDirection === "desc" ? "desc" : "asc"
      )
    : filtered;

  const totalPages = meta.totalPages;
  const currentPage = Math.min(Math.max(1, meta.page), totalPages);

  const tableHeader: (keyof TableRow)[] = [
    "calledNumber",
    "callerNumber",
    "callType",
    "callTime",
    "callDuration",
    "receivedBy",
    "agentName",
    "callRecord",
  ];

  const currentFilters = parseFilters(queryParams);
  const basePath = organizationCallLogsPath();

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField
          basePath={basePath}
          defaultQuery={queryParams.query || ""}
        />
      </div>

      <div className="w-full overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
        <table className="min-w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-50 text-gray-900 text-sm font-medium border-b border-gray-200">
            <tr>
              {tableHeader.map((field) => (
                <TableHeaderItem
                  key={String(field)}
                  field={field}
                  currentSort={sortField}
                  sortDirection={sortDirection === "desc" ? "desc" : "asc"}
                  currentPage={currentPage}
                  limit={meta.limit}
                  searchQuery={queryParams.query || ""}
                  basePath={basePath}
                  currentFilters={currentFilters}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.length > 0 ? (
              sorted.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {tableHeader.map((key) => {
                    if (key === "callRecord") {
                      return (
                        <td
                          key={String(key)}
                          className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                        >
                          <PlayCallRecord sid={item.callRecord} />
                        </td>
                      );
                    }
                    return (
                      <td
                        key={String(key)}
                        className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                      >
                        {item[key]}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeader.length}
                  className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                >
                  No organization admins found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasNextPage={currentPage < totalPages}
        hasPrevPage={currentPage > 1}
        limit={meta.limit}
        sortField={sortField}
        sortDirection={sortDirection === "desc" ? "desc" : "asc"}
        basePath={basePath}
      />
    </div>
  );
}

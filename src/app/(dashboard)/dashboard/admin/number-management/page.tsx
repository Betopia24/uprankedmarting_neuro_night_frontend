import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { sortData } from "@/components/table/utils/sortData";
import paginateData from "@/components/table/utils/paginateData";

import { adminNumberManagementPath } from "@/paths";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";

const config = {
  basePath: adminNumberManagementPath(),
};

export interface TableData {
  id: string;
  sid: string;
  phoneNumber: string;
  friendlyName: string;
  capabilities: Capabilities;
  beta: boolean;
  countryCode: string;
  isPurchased: boolean;
  purchasedAt: string;
  createdAt: string;
  updatedAt: string;
  purchasedByOrganizationId: string;
}

export interface Capabilities {
  voice: boolean;
  sms: boolean;
  mms: boolean;
  fax: boolean;
}

export interface TableSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
  [key: string]: string | string[] | undefined | number;
}

interface TableProps {
  searchParams: Promise<TableSearchParams>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const DEFAULT_SORT = "";

export default async function CallManageAndLogsPage({
  searchParams,
}: TableProps) {
  const auth = await getServerAuth();

  // Fetch numbers
  const numbersFetchResponse = await fetch(
    `${env.API_BASE_URL}/active-numbers/get-available-numbers`,
    {
      headers: {
        Authorization: `${auth?.accessToken}`,
      },
    }
  );
  await numbersFetchResponse.json();
  if (!numbersFetchResponse.ok) throw new Error("Failed to fetch numbers");

  const activeNumbers = await fetch(`${env.API_BASE_URL}/active-numbers`, {
    headers: {
      Authorization: `${auth?.accessToken}`,
    },
  });

  const data = await activeNumbers.json();
  if (!activeNumbers.ok) throw new Error("Failed to fetch active numbers");

  const { data: tableData = [] }: { data: TableData[] } = data || {};

  const queryParams = await searchParams;
  const page = Number(queryParams.page) || DEFAULT_PAGE;
  const limit = Number(queryParams.limit) || DEFAULT_LIMIT;
  const [sortField, sortDirection = ""] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");
  const searchQuery = queryParams.query || "";

  const allowedKeys = [
    "id",
    "sid",
    "phoneNumber",
    "friendlyName",
    "capabilities",
    "countryCode",
    "isPurchased",
  ];

  const tableHeader =
    tableData.length > 0
      ? allowedKeys.filter((key) => Object.keys(tableData[0]).includes(key))
      : allowedKeys;

  // Filter by searchQuery if exists
  const filteredData = tableData.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.phoneNumber.includes(searchQuery) ||
      item.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit) || 1;
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginatedData = paginateData(filteredData, page, limit);
  const sortedPaginatedData = sortData(
    paginatedData as unknown as Record<string, string | number>[],
    sortField,
    sortDirection
  );

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField basePath={config.basePath} defaultQuery={searchQuery} />
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
                  currentPage={page}
                  limit={limit}
                  searchQuery={searchQuery}
                  basePath={config.basePath}
                />
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sortedPaginatedData.length > 0 ? (
              sortedPaginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {tableHeader.map((key) => {
                    const value = item[key as keyof typeof item];

                    if (
                      key === "capabilities" &&
                      value &&
                      typeof value === "object"
                    ) {
                      const caps = value as Capabilities;
                      return (
                        <td
                          key={key}
                          className="border border-gray-200 p-2 flex gap-2"
                        >
                          {Object.entries(caps).map(([capKey, enabled]) => (
                            <span
                              key={capKey}
                              className={`px-1 rounded text-white text-xs ${
                                enabled ? "bg-green-500" : "bg-gray-400"
                              }`}
                              title={capKey}
                            >
                              {capKey.toUpperCase()}
                            </span>
                          ))}
                        </td>
                      );
                    }

                    if (key === "isPurchased") {
                      return (
                        <td
                          key={key}
                          className="border border-gray-200 px-3 py-2"
                        >
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                              value ? "bg-green-500" : "bg-gray-400"
                            }`}
                          >
                            {value ? "Purchased" : "Available"}
                          </span>
                        </td>
                      );
                    }

                    return (
                      <td
                        key={key}
                        className="border border-gray-200 px-3 py-2"
                      >
                        {String(value)}
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
                  No numbers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

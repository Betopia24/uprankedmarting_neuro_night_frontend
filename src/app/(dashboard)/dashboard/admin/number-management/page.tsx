import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { sortData } from "@/components/table/utils/sortData";

import { adminNumberManagementPath } from "@/paths";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import Link from "next/link";

const config = {
  basePath: adminNumberManagementPath(),
};

export interface Capabilities {
  voice: boolean;
  sms: boolean;
  mms: boolean;
  fax: boolean;
}

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

export interface TableSearchParams {
  sort?: string;
  query?: string;
  page?: string;
  limit?: string;
}

interface TableProps {
  searchParams: Promise<TableSearchParams>;
}

const DEFAULT_SORT = "";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default async function NumberManagementPage({
  searchParams,
}: TableProps) {
  const auth = await getServerAuth();



  if (!auth?.accessToken) throw new Error("No auth token");

  const numbersFetchResponse = await fetch(
    `${env.API_BASE_URL}/active-numbers/get-available-numbers`,
    {
      headers: {
        Authorization: `${auth?.accessToken}`,
      },
    }
  );

  await numbersFetchResponse.json();
  if (!numbersFetchResponse.ok) throw new Error("Failed to fetch numbers");
  // Fetch numbers
  const response = await fetch(`${env.API_BASE_URL}/active-numbers`, {
    headers: { Authorization: auth.accessToken },
  });

  if (!response.ok) throw new Error("Failed to fetch numbers");

  const { data: tableData = [] }: { data: TableData[] } = await response.json();

  const queryParams = await searchParams;
  const searchQuery = queryParams.query || "";
  const [sortField, sortDirection = "asc"] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");

  // Pagination params
  const page = Number(queryParams.page) || DEFAULT_PAGE;
  const limit = Number(queryParams.limit) || DEFAULT_LIMIT;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Filter data
  const filteredData = tableData.filter((item) => {
    if (!searchQuery) return true;
    return (
      item.phoneNumber.includes(searchQuery) ||
      item.friendlyName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort filtered data
  const sortedData = sortData(
    filteredData as unknown as Record<string, string | number>[],
    sortField,
    sortDirection
  );

  // Paginated data
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(sortedData.length / limit);

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
    sortedData.length > 0
      ? allowedKeys.filter((key) => Object.keys(sortedData[0]).includes(key))
      : allowedKeys;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField basePath={config.basePath} defaultQuery={searchQuery} />
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
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
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
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
                              className={`px-1 rounded text-white text-xs ${enabled ? "bg-green-500" : "bg-gray-400"
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
                            className={`px-2 py-1 rounded text-xs font-semibold text-white ${value ? "bg-green-500" : "bg-gray-400"
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
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`${config.basePath}?query=${searchQuery}&sort=${sortField}:${sortDirection}&page=${p}&limit=${limit}`}
              className={`px-3 py-1 rounded border ${p === page
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

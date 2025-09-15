import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { sortData } from "@/components/table/utils/sortData";

import { adminNumberManagementPath } from "@/paths";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";

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
}

interface TableProps {
  searchParams: Promise<TableSearchParams>;
}

const DEFAULT_SORT = "";

export default async function NumberManagementPage({
  searchParams,
}: TableProps) {
  const auth = await getServerAuth();
  if (!auth?.accessToken) throw new Error("No auth token");

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

  // Filter data by search query if provided
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
                  currentPage={1}
                  limit={sortedData.length}
                  searchQuery={searchQuery}
                  basePath={config.basePath}
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
    </div>
  );
}

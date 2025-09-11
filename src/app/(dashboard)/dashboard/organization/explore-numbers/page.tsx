import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { sortData } from "@/components/table/utils/sortData";
import paginateData from "@/components/table/utils/paginateData";

import {
  organizationExploreNumbersPath,
  organizationBuyNumberPath,
} from "@/paths";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import Link from "next/link";

const config = {
  basePath: organizationExploreNumbersPath(),
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
  status?: string | string[];
  role?: string | string[];
  earning_range?: string;
  [key: string]: string | string[] | undefined | number;
}

interface TableProps {
  searchParams: Promise<TableSearchParams>;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const DEFAULT_SORT = "";

// Helper function to filter data based on search query
function filterData(data: TableData[], searchQuery: string): TableData[] {
  if (!searchQuery.trim()) {
    return data;
  }

  const query = searchQuery.toLowerCase().trim();

  return data.filter((item) => {
    // Search in string fields
    const searchableFields = [
      item.sid,
      item.phoneNumber,
      item.friendlyName,
      item.countryCode,
    ];

    // Check if any searchable field contains the query
    const matchesStringFields = searchableFields.some((field) =>
      field?.toLowerCase().includes(query)
    );

    // Search in capabilities
    const matchesCapabilities = Object.entries(item.capabilities).some(
      ([key, value]) => {
        return (
          key.toLowerCase().includes(query) ||
          (value && query.includes("true")) ||
          (!value && query.includes("false"))
        );
      }
    );

    // Search in boolean fields
    const matchesBooleanFields =
      (item.isPurchased && query.includes("purchased")) ||
      (item.beta && query.includes("beta"));

    return matchesStringFields || matchesCapabilities || matchesBooleanFields;
  });
}

export default async function CallManageAndLogsPage({
  searchParams,
}: TableProps) {
  const auth = await getServerAuth();
  const orgId = auth?.data?.ownedOrganization?.id;

  const activeNumbersRes = await fetch(`${env.API_BASE_URL}/active-numbers`, {
    headers: {
      Authorization: `${auth?.accessToken}`,
    },
  });

  if (!activeNumbersRes.ok) throw new Error("Failed to fetch active numbers");

  const activeNumbersJson = await activeNumbersRes.json();
  const rawTableData: TableData[] = Array.isArray(activeNumbersJson?.data)
    ? activeNumbersJson.data
    : [];

  const queryParams = await searchParams;
  const page = Number(queryParams.page) || DEFAULT_PAGE;
  const limit = Number(queryParams.limit) || DEFAULT_LIMIT;
  const [sortField, sortDirection = ""] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");
  const searchQuery = queryParams.query || "";

  // Apply search filter first
  const filteredData = filterData(rawTableData, searchQuery);

  const allowedKeys = [
    "sid",
    "phoneNumber",
    "friendlyName",
    "capabilities",
    "countryCode",
    "isPurchased",
  ];

  // ✅ Safe: check filteredData[0] exists
  const tableHeader =
    filteredData.length > 0
      ? allowedKeys.filter((key) => Object.keys(filteredData[0]).includes(key))
      : [];

  // Pagination info based on filtered data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginatedData = paginateData(filteredData, page, limit);
  const sortedPaginatedData = sortData(
    paginatedData as unknown as Record<string, string | number>[],
    sortField,
    sortDirection
  );

  return (
    <div className="space-y-4">
      {rawTableData.length > 0 && (
        <div className="flex gap-4 justify-between">
          <SearchField basePath={config.basePath} defaultQuery={searchQuery} />
        </div>
      )}

      {/* Show search results info */}
      {searchQuery && (
        <div className="text-sm text-gray-600">
          {totalItems > 0
            ? `Found ${totalItems} result${
                totalItems === 1 ? "" : "s"
              } for "${searchQuery}"`
            : `No results found for "${searchQuery}"`}
        </div>
      )}

      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">
          {searchQuery
            ? "No numbers match your search."
            : "No numbers available."}
        </p>
      ) : (
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
                />
              ))}
              <th className="border border-gray-300 text-left cursor-pointer">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedPaginatedData.map((item) => (
              <tr key={item.id}>
                {tableHeader.map((key) => {
                  const value = item[key as keyof typeof item];
                  if (
                    key === "capabilities" &&
                    typeof value === "object" &&
                    value !== null
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
                  return (
                    <td key={key} className="border border-gray-200 p-2">
                      {String(value)}
                    </td>
                  );
                })}
                <td>
                  <Link
                    href={`${organizationBuyNumberPath()}?ts=${
                      item.sid
                    }&ci=${orgId}&np=${item.phoneNumber}`}
                  >
                    Buy
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {totalItems > 0 && (
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
      )}
    </div>
  );
}

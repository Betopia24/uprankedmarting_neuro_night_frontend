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
  purchasedByOrganizationId: any;
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

export default async function CallManageAndLogsPage({
  searchParams,
}: TableProps) {
  const auth = await getServerAuth();
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

  const { data: tableData }: { data: TableData[] } = data || { data: [] };

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

  const tableHeader = allowedKeys.filter((key) =>
    Object.keys(tableData[0]).includes(key)
  );

  // Calculate pagination info based on filtered data
  const totalItems = tableData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginatedData = paginateData(tableData, page, limit);

  const sortedPaginatedData = sortData(
    paginatedData as unknown as Record<string, string | number>[],
    sortField,
    sortDirection
  );

  return (
    <div className="space-y-4">
      {/* <div className="flex gap-4 justify-between">
        <SearchField basePath={config.basePath} defaultQuery={searchQuery} />
      </div> */}

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
          </tr>
        </thead>
        <tbody>
          {sortedPaginatedData.map((item) => (
            <tr key={item.id}>
              {tableHeader.map((key) => {
                const value = item[key as keyof typeof item];

                // 🔹 Check if value is capabilities object
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

                // 🔹 Default for normal values
                return (
                  <td key={key} className="border border-gray-200 p-2">
                    {String(value)}
                  </td>
                );
              })}
            </tr>
          ))}
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

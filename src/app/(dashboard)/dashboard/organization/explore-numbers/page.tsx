"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // ✅ use this instead of props
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import paginateData from "@/components/table/utils/paginateData";
import { sortData as sortTable } from "@/components/table/utils/sortData";
import {
  organizationExploreNumbersPath,
  organizationBuyNumberPath,
} from "@/paths";
import { env } from "@/env";
import Link from "next/link";

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

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

function filterData(data: TableData[], searchQuery: string): TableData[] {
  if (!searchQuery.trim()) return data;
  const query = searchQuery.toLowerCase().trim();

  return data.filter((item) => {
    const searchableFields = [
      item.sid,
      item.phoneNumber,
      item.friendlyName,
      item.countryCode,
    ];

    const matchesStringFields = searchableFields.some((field) =>
      field?.toLowerCase().includes(query)
    );

    const matchesCapabilities = Object.entries(item.capabilities).some(
      ([key, value]) =>
        key.toLowerCase().includes(query) ||
        (value && query.includes("true")) ||
        (!value && query.includes("false"))
    );

    const matchesBooleanFields =
      (item.isPurchased && query.includes("purchased")) ||
      (item.beta && query.includes("beta"));

    return matchesStringFields || matchesCapabilities || matchesBooleanFields;
  });
}

export default function OrganizationNumbersPage() {
  const { user, token } = useAuth();
  const [rawTableData, setRawTableData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Read query params safely in client
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
  const [sortField, sortDirection = "asc"] = (
    searchParams.get("sort") || DEFAULT_SORT
  ).split(":");
  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    if (!token) return;

    async function fetchData() {
      try {
        const res = await fetch(`${env.NEXT_PUBLIC_API_URL}/active-numbers`, {
          headers: { Authorization: token || "" },
        });

        if (!res.ok) throw new Error("Failed to fetch active numbers");

        const json = await res.json();
        setRawTableData(Array.isArray(json?.data) ? json.data : []);
      } catch (e) {
        console.error("Error fetching numbers:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [token]);

  if (!token) return <p>No auth token</p>;
  if (loading) return <p>Loading...</p>;

  // filtering + pagination
  const filteredData = filterData(rawTableData, searchQuery);
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  const paginatedData = paginateData(filteredData, page, limit);

  const sortedPaginatedData = sortTable(
    paginatedData as unknown as Record<string, string | number>[],
    sortField,
    sortDirection
  );

  const allowedKeys = [
    "sid",
    "phoneNumber",
    "friendlyName",
    "capabilities",
    "countryCode",
    "isPurchased",
  ];

  const tableHeader =
    sortedPaginatedData.length > 0
      ? allowedKeys.filter((key) =>
          Object.keys(sortedPaginatedData[0]).includes(key)
        )
      : allowedKeys;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Organization: {user?.ownedOrganization?.name || "N/A"}
      </p>

      {rawTableData.length > 0 && (
        <div className="flex gap-4 justify-between">
          <SearchField
            basePath={organizationExploreNumbersPath()}
            defaultQuery={searchQuery}
          />
        </div>
      )}

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
        <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-200">
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
                    basePath={organizationExploreNumbersPath()}
                  />
                ))}
                <th className="border border-gray-300 text-left cursor-pointer">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedPaginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {tableHeader.map((key) => {
                    const value: unknown = (item as any)[key];

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
                                enabled ? "bg-green-500" : "bg-gray-500"
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
                              value ? "bg-gray-500" : "bg-emerald-400"
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

                  <td className="border border-gray-200 px-3 py-2">
                    {item.isPurchased ? (
                      <button
                        type="button"
                        disabled
                        className="px-3 py-1 rounded bg-gray-400 text-white cursor-not-allowed opacity-70"
                      >
                        Purchased
                      </button>
                    ) : (
                      <Link
                        href={`${organizationBuyNumberPath()}?ts=${
                          item.sid
                        }&ci=${user?.ownedOrganization?.id}&np=${
                          item.phoneNumber
                        }`}
                        passHref
                      >
                        <button
                          type="button"
                          className="px-3 w-full py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          Buy
                        </button>
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
          basePath={organizationExploreNumbersPath()}
        />
      )}
    </div>
  );
}

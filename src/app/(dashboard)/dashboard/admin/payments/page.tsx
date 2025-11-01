import React from "react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getAccessToken } from "@/lib/auth";
import { adminPaymentsPath } from "@/paths";

export interface TableSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
  [key: string]: string | string[] | number | undefined;
}

interface TableProps {
  searchParams?: {
    [key: string]: string | string[] | undefined;
  };
}

interface Subscription {
  id: string;
  organizationId: string;
  planId: string;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialStart: string;
  trialEnd: string;
  canceledAt: string | null;
  cancelAtPeriodEnd: boolean;
  planLevel: string;
  purchasedNumber: string;
  sid: string;
  numberOfAgents: number;
  totalMinuteLimit: number;
  createdAt: string;
  updatedAt: string;
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    interval: string;
    trialDays: number;
    stripePriceId: string;
    stripeProductId: string;
    isActive: boolean;
    description: string;
    features: string[];
    planLevel: string;
    defaultAgents: number;
    extraAgentPricing: Array<{
      agents: number;
      price: number;
    }>;
    totalMinuteLimit: number;
    isDeleted: boolean;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

interface SubscriptionsApiResponse {
  success: boolean;
  message: string;
  data: Subscription[];
}

interface TableRow {
  id: string;
  plan: string;
  amount: string;
  interval: string;
  status: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

async function getSubscriptions(
  params: TableSearchParams
): Promise<SubscriptionsApiResponse | null> {
  const accessToken = await getAccessToken();

  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const query = typeof params.query === "string" ? params.query : "";

  const url = new URL(`${env.API_BASE_URL}/subscriptions/billing-history`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (query) url.searchParams.set("searchTerm", query);
  if (params.sort) url.searchParams.set("sort", String(params.sort));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: accessToken as string,
    },
    cache: "no-cache",
  });
  if (!res.ok) return null;
  return res.json();
}

function sortData<T>(
  data: T[],
  field: keyof T,
  direction: "asc" | "desc"
): T[] {
  if (!field) return data;
  return [...data].sort((a, b) => {
    const aV = a[field];
    const bV = b[field];
    if (typeof aV === "number" && typeof bV === "number") {
      return direction === "asc" ? aV - bV : bV - aV;
    }
    const aS = String(aV ?? "");
    const bS = String(bV ?? "");
    return direction === "asc" ? aS.localeCompare(bS) : bS.localeCompare(aS);
  });
}

function filterData(data: TableRow[], query: string): TableRow[] {
  if (!query) return data;
  const q = query.toLowerCase();
  return data.filter(
    (item) =>
      item.plan.toLowerCase().includes(q) ||
      item.status.toLowerCase().includes(q)
  );
}

export default async function AdminSubscriptionsPage(props: {
  searchParams: Promise<TableProps["searchParams"]>;
}) {
  const sp = (await props.searchParams) ?? {};
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

  const response = await getSubscriptions(queryParams);

  if (!response || !response.data) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        No subscription found
      </div>
    );
  }

  const { data: subscriptions } = response;

  const limit = queryParams.limit ?? DEFAULT_LIMIT;
  const page = queryParams.page ?? DEFAULT_PAGE;

  const totalItems = subscriptions.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const tableData: TableRow[] = subscriptions.map((sub) => ({
    id: sub.id,
    plan: sub.plan?.name || "N/A",
    amount: `${sub.plan?.price || 0} ${(
      sub.plan?.currency || "usd"
    ).toUpperCase()}`,
    interval: sub.plan?.interval || "N/A",
    status: sub.status,
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

  const basePath = adminPaymentsPath();
  const currentFilters = parseFilters(queryParams);

  const columns: { key: keyof TableRow; label: string }[] = [
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    { key: "interval", label: "Interval" },
    { key: "status", label: "Status" },
  ];

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
              {columns.map((col) => (
                <TableHeaderItem
                  key={col.key}
                  field={col.key}
                  currentSort={sortField}
                  sortDirection={sortDirection === "desc" ? "desc" : "asc"}
                  currentPage={currentPage}
                  limit={limit}
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
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                    >
                      {item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                >
                  No subscriptions found.
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
        limit={limit}
        sortField={sortField}
        sortDirection={sortDirection === "desc" ? "desc" : "asc"}
        basePath={basePath}
      />
    </div>
  );
}

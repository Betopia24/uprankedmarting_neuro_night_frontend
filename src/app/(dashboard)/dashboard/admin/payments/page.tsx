// app/(admin)/subscriptions/page.tsx
import React from "react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import { formatDateTime } from "@/utils/formatDateTime";
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
  amount: number;
  paymentStatus: string;
  status: string;
  planLevel: string;
  purchasedNumber: string;
  numberOfAgents: number;
  startDate: string;
  endDate: string;
  organization: {
    name: string;
    organizationNumber: string;
    industry: string;
    websiteLink: string;
    ownedOrganization: {
      name: string;
      email: string;
      phone: string;
    };
  };
  plan: {
    planName: string;
    currency: string;
    interval: string;
    intervalCount: number;
  };
}

interface SubscriptionsApiResponse {
  success: boolean;
  message: string;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPage: number;
  };
  data: Subscription[];
}

interface TableRow {
  id: string;
  customer: string;
  plan: string;
  amount: string;
  interval: string;
  paymentStatus: string;
  status: string;
  number: string;
  agents: number;
  startDate: string;
  endDate: string;
  contactEmail: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

async function getSubscriptions(
  params: TableSearchParams
): Promise<SubscriptionsApiResponse | null> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) return null;

  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const query = typeof params.query === "string" ? params.query : "";

  const url = new URL(`${env.API_BASE_URL}/subscriptions`);
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
      item.customer.toLowerCase().includes(q) ||
      item.plan.toLowerCase().includes(q) ||
      item.paymentStatus.toLowerCase().includes(q) ||
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
        Failed to load subscriptions.
      </div>
    );
  }

  const { data: subscriptions, meta } = response;

  const tableData: TableRow[] = subscriptions.map((sub) => ({
    id: sub.id,
    customer: sub.organization.name,
    plan: sub.plan.planName,
    amount: `${sub.amount} ${sub.plan.currency.toUpperCase()}`,
    interval: `${sub.plan.intervalCount} ${sub.plan.interval}`,
    paymentStatus: sub.paymentStatus,
    status: sub.status,
    number: sub.purchasedNumber,
    agents: sub.numberOfAgents,
    startDate: formatDateTime(sub.startDate),
    endDate: formatDateTime(sub.endDate),
    contactEmail: sub.organization.ownedOrganization.email,
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

  const totalPages = meta.totalPage;
  const currentPage = Math.min(Math.max(1, meta.page), totalPages);
  const basePath = adminPaymentsPath(); // ✅ Admin subscriptions page path
  const currentFilters = parseFilters(queryParams);

  const columns: { key: keyof TableRow; label: string }[] = [
    { key: "customer", label: "Customer" },
    { key: "plan", label: "Plan" },
    { key: "amount", label: "Amount" },
    { key: "interval", label: "Interval" },
    { key: "paymentStatus", label: "Payment Status" },
    { key: "status", label: "Status" },
    { key: "number", label: "Purchased Number" },
    { key: "agents", label: "Agents" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "contactEmail", label: "Contact Email" },
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
        limit={meta.limit}
        sortField={sortField}
        sortDirection={sortDirection === "desc" ? "desc" : "asc"}
        basePath={basePath}
      />
    </div>
  );
}

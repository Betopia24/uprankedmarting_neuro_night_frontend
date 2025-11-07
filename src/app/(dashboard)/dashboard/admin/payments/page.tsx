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

interface BillingHistory {
  id: string;
  stripeInvoiceId: string;
  organizationId: string;
  subscriptionId: string | null;
  customerId: string;
  amountDue: number;
  amountPaid: number;
  amountRemaining: number;
  subtotal: number;
  total: number;
  currency: string;
  periodStart: string;
  periodEnd: string;
  invoiceCreatedAt: string;
  status: string;
  lineItems: Array<{
    description: string;
    amount: number;
    quantity: number;
    period: {
      start: string;
      end: string;
    };
  }>;
  hostedInvoiceUrl: string;
  invoicePdf: string;
  number: string;
  createdAt: string;
  updatedAt: string;
  organization: {
    id: string;
    name: string;
    stripeCustomerId: string;
  };
  subscription: any | null;
}

interface BillingHistoryApiResponse {
  success: boolean;
  message: string;
  data: BillingHistory[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface TableRow {
  id: string;
  invoiceNumber: string;
  organization: string;
  description: string;
  amount: string;
  status: string;
  period: string;
  invoiceDate: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

async function getBillingHistory(
  params: TableSearchParams
): Promise<BillingHistoryApiResponse | null> {
  const accessToken = await getAccessToken();

  const page = params.page ?? DEFAULT_PAGE;
  const limit = params.limit ?? DEFAULT_LIMIT;
  const query = typeof params.query === "string" ? params.query : "";

  const url = new URL(
    `${env.API_BASE_URL}/subscriptions/admin/billing-history`
  );
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (query) url.searchParams.set("searchTerm", query);

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

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Assuming amount is in cents
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatPeriod(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // If period is just one day (like in trial)
  if (startDate.toDateString() === endDate.toDateString()) {
    return formatDate(start);
  }

  return `${formatDate(start)} - ${formatDate(end)}`;
}

export default async function AdminBillingHistoryPage(props: {
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

  const response = await getBillingHistory(queryParams);

  if (!response || !response.data) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        No billing history found
      </div>
    );
  }

  const { data: billingHistory, meta } = response;

  const limit = queryParams.limit ?? DEFAULT_LIMIT;
  const page = queryParams.page ?? DEFAULT_PAGE;

  const totalPages = meta?.totalPage ?? 1;
  const currentPage = Math.min(Math.max(1, page), totalPages);

  // Map billing history to table rows
  const tableData: TableRow[] = billingHistory.map((invoice) => {
    const mainLineItem = invoice.lineItems[0];
    return {
      id: invoice.id,
      invoiceNumber: invoice.number,
      organization: invoice.organization.name,
      description: mainLineItem?.description || "Invoice",
      amount: formatCurrency(invoice.total, invoice.currency),
      status: invoice.status,
      period: formatPeriod(invoice.periodStart, invoice.periodEnd),
      invoiceDate: formatDate(invoice.invoiceCreatedAt),
    };
  });

  const [sortField, sortDirection] = (queryParams.sort || "").split(":") as [
    string,
    string?
  ];

  // Apply client-side sorting to current page data only
  const sortedData = sortField
    ? sortData(
        tableData,
        sortField as keyof TableRow,
        sortDirection === "desc" ? "desc" : "asc"
      )
    : tableData;

  const basePath = adminPaymentsPath();
  const currentFilters = parseFilters(queryParams);

  const columns: { key: keyof TableRow; label: string }[] = [
    { key: "invoiceNumber", label: "Invoice #" },
    { key: "organization", label: "Organization" },
    { key: "description", label: "Description" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
    { key: "period", label: "Period" },
    { key: "invoiceDate", label: "Invoice Date" },
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", label: "Paid" },
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      open: { color: "bg-blue-100 text-blue-800", label: "Open" },
      void: { color: "bg-red-100 text-red-800", label: "Void" },
      uncollectible: {
        color: "bg-orange-100 text-orange-800",
        label: "Uncollectible",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">
            Billing History
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all invoices and billing transactions across
            organizations.
          </p>
        </div>
      </div>

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
            {sortedData.length > 0 ? (
              sortedData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap font-medium">
                    {item.invoiceNumber}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.organization}
                  </td>
                  <td className="px-4 py-3 border border-gray-200">
                    {item.description}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap font-medium">
                    {item.amount}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {getStatusBadge(item.status)}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.period}
                  </td>
                  <td className="px-4 py-3 border border-gray-200 whitespace-nowrap">
                    {item.invoiceDate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                >
                  No billing history found.
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

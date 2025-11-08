import React from "react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { adminOrganizationManagementPath } from "@/paths";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";
import Link from "next/link";
import ManageUserStatus from "./_components/ManageUserStatus";

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
  planLevel: string;
  purchasedNumber: string;
}

interface Agent {
  name?: string;
  userId?: string;
  user?: {
    name: string;
  };
}

interface OwnedOrganization {
  industry: string;
  websiteLink: string;
  subscriptions: Subscription[];
  agents: Agent[];
  id: string;
}

interface OrganizationAdmin {
  id: string;
  name: string;
  phone: string;
  ownedOrganization: OwnedOrganization;
  status: string;
  assignAgent?: number;
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
  name: string;
  serviceType: string;
  packageType: string;
  assignAgent: number;
  contactInfo: string;
  website: string;
  userId: string;
  status: string;
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

  const url = new URL(`${env.API_BASE_URL}/organization-admins`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (query) url.searchParams.set("searchTerm", query);
  if (params.sort) url.searchParams.set("sort", String(params.sort));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: auth.accessToken,
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json;
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
      item?.name.toLowerCase().includes(q) ||
      item?.serviceType.toLowerCase().includes(q) ||
      item?.packageType.toLowerCase().includes(q)
  );
}

export default async function OrganizationAdminPage(props: {
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

  const response = await getOrganizations(queryParams);

  if (!response || !response.data) {
    return (
      <div className="py-16 text-center text-gray-500 bg-white shadow-sm rounded-lg">
        No Organizations Found
      </div>
    );
  }

  const { data: organizations, meta } = response.data;

  const tableData: TableRow[] = organizations.map((org) => {
    const subs = org.ownedOrganization.subscriptions ?? [];
    const packageTypes =
      subs.map((s) => `${s.planLevel} (${s.purchasedNumber})`).join(", ") ||
      "N/A";

    return {
      userId: org.id,
      id: org.ownedOrganization.id,
      name: org.name,
      serviceType: org.ownedOrganization.industry,
      packageType: packageTypes,
      assignAgent: org?.assignAgent || 0,
      contactInfo: org.phone,
      website: org.ownedOrganization.websiteLink,
      status: org.status,
    };
  });

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
  const basePath = adminOrganizationManagementPath();
  const currentFilters = parseFilters(queryParams);

  const columns: { key: keyof TableRow; label: string }[] = [
    { key: "name", label: "Customer Name" },
    { key: "serviceType", label: "Service Type" },
    { key: "packageType", label: "Package Type" },
    { key: "assignAgent", label: "Assign Agent" },
    { key: "contactInfo", label: "Contact Info" },
    { key: "website", label: "Website" },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Search Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField
          basePath={basePath}
          defaultQuery={queryParams.query || ""}
        />
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
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
                  <th
                    scope="col"
                    className="px-4 py-3 text-left text-sm font-medium text-gray-900 border border-gray-200 whitespace-nowrap"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sorted.length > 0 ? (
                  sorted.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className="px-4 py-3 text-sm text-gray-700 border border-gray-200 whitespace-nowrap"
                        >
                          <Link
                            href={`${basePath}/${item.id}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {item[col.key]}
                          </Link>
                        </td>
                      ))}
                      <ManageUserStatus
                        userId={item.userId}
                        status={item.status}
                      />
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                    >
                      No organization admins found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pagination */}
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

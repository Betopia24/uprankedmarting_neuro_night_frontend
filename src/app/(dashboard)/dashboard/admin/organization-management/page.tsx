import React from "react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { adminOrganizationManagementPath } from "@/paths";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getAccessToken } from "@/lib/auth";

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
}

interface OrganizationAdmin {
  id: string;
  name: string;
  phone: string;
  ownedOrganization: OwnedOrganization;
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
  assignAgent: string;
  contactInfo: string;
  website: string;
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

async function getOrganizations(
  params: TableSearchParams
): Promise<OrganizationApiResponse | null> {
  const accessToken = await getAccessToken();

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
      Authorization: accessToken as string,
    },
    next: { revalidate: 500 },
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
        Failed to load organization admins.
      </div>
    );
  }

  const { data: organizations, meta } = response.data;

  const tableData: TableRow[] = organizations.map((org) => {
    const subs = org.ownedOrganization.subscriptions ?? [];
    const packageTypes =
      subs.map((s) => `${s.planLevel} (${s.purchasedNumber})`).join(", ") ||
      "N/A";

    const agents = org.ownedOrganization.agents ?? [];
    const agentNames =
      agents
        .map((a) => a.user?.name || a.name || a.userId || "N/A")
        .join(", ") || "N/A";

    return {
      id: org.id,
      name: org.name,
      serviceType: org.ownedOrganization.industry,
      packageType: packageTypes,
      assignAgent: agentNames,
      contactInfo: org.phone,
      website: org.ownedOrganization.websiteLink,
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
                  {columns.map((col) => {
                    if (col.key === "assignAgent") {
                      const agentsArray =
                        item.assignAgent && item.assignAgent !== "N/A"
                          ? item.assignAgent.split(", ").filter(Boolean)
                          : [];
                      return (
                        <td
                          key={col.key}
                          className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                          title={agentsArray.join("\n")}
                        >
                          {agentsArray.length}
                        </td>
                      );
                    }
                    return (
                      <td
                        key={col.key}
                        className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                      >
                        {item[col.key]}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-10 text-center text-gray-500 border border-gray-200"
                >
                  No organization admins found.
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

import React from "react";
import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { adminOrganizationManagementPath } from "@/paths";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";

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
  startDate: string;
  endDate: string;
  amount: number;
  paymentStatus: string;
  status: string;
  planLevel: string;
  purchasedNumber: string;
  numberOfAgents: number;
}

interface Agent {
  id: string;
  userId: string;
  name?: string;
}

interface OwnedOrganization {
  id: string;
  name: string;
  industry: string;
  address: string;
  websiteLink: string;
  organizationNumber: string | null;
  subscriptions: Subscription[];
  agents: Agent[];
}

interface OrganizationAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  image?: string;
  bio?: string;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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
  email: string;
  phone: string;
  organizationName: string;
  organizationIndustry: string;
  organizationAddress: string;
  totalAgents: number;
  agentNames: string;
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
    cache: "no-cache",
  });
  if (!res.ok) {
    console.error("Fetch error code:", res.status);
    return null;
  }
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
      item.name.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q) ||
      item.organizationName.toLowerCase().includes(q)
  );
}

export default async function OrganizationAdminPage({
  searchParams,
}: TableProps) {
  // parse the searchParams prop
  const sp = searchParams ?? {};
  // convert to TableSearchParams
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

  const normalizedData = organizations.map((org) => ({
    id: org.id,
    name: org.name,
    serviceType: org.ownedOrganization.industry,
    packageType: org.ownedOrganization.subscriptions,
    assignAgent: org.ownedOrganization.agents,
    contactInfo: org.phone,
    website: org.ownedOrganization.websiteLink,
  }));

  console.log(normalizedData);

  const tableData: TableRow[] = organizations.map((org) => {
    const agents = org.ownedOrganization.agents ?? [];
    const agentNames = agents
      .map((a) => a.name ?? a.userId ?? "N/A")
      .join(", ");
    return {
      id: org.id,
      name: org.name,
      email: org.email,
      phone: org.phone,
      organizationName: org.ownedOrganization.name,
      organizationIndustry: org.ownedOrganization.industry,
      organizationAddress: org.ownedOrganization.address,
      totalAgents: agents.length,
      agentNames,
    };
  });

  // sort / filter
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

  const tableHeader =
    sorted.length > 0
      ? (Object.keys(sorted[0]) as (keyof TableRow)[]).filter((k) => k !== "id")
      : ([
          "name",
          "email",
          "phone",
          "organizationName",
          "organizationIndustry",
          "organizationAddress",
          "totalAgents",
          "agentNames",
        ] as (keyof TableRow)[]);

  const currentFilters = parseFilters(queryParams);

  const basePath = adminOrganizationManagementPath();

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
              {tableHeader.map((field) => (
                <TableHeaderItem
                  key={String(field)}
                  field={field}
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
                  {tableHeader.map((key) => (
                    <td
                      key={String(key)}
                      className="px-4 py-3 border border-gray-200 whitespace-nowrap"
                    >
                      {item[key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={tableHeader.length}
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

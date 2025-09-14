import Pagination from "@/components/table/components/Pagination";
import SearchField from "@/components/table/components/SearchField";
import TableHeaderItem from "@/components/table/components/TableHeaderItem";
import { adminOrganizationManagementPath } from "@/paths";
import { parseFilters } from "@/components/table/utils/filters";
import { env } from "@/env";
import { getServerAuth } from "@/lib/auth";

const config = {
  basePath: adminOrganizationManagementPath(),
};

export interface TableSearchParams {
  page?: number;
  limit?: number;
  sort?: string;
  query?: string;
  [key: string]: string | string[] | undefined | number;
}

interface TableProps {
  searchParams: Promise<TableSearchParams>;
}

// Backend API types
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
  image: string;
  bio: string;
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

// Table row type
interface TableRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  organizationName: string;
  organizationIndustry: string;
  organizationAddress: string;
  totalAgents: number;
  agentNames: string; // comma-separated
}

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const DEFAULT_SORT = "";

// Fetch organization admins
async function getOrganizations(
  queryParams: TableSearchParams
): Promise<OrganizationApiResponse | null> {
  const auth = await getServerAuth();
  if (!auth?.accessToken) return null;

  const {
    page = DEFAULT_PAGE,
    limit = DEFAULT_LIMIT,
    query = "",
  } = queryParams;
  const url = new URL(`${env.API_BASE_URL}/organization-admins`);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  if (query) url.searchParams.set("searchTerm", query);

  try {
    const res = await fetch(url.toString(), {
      headers: { Authorization: auth.accessToken },
      cache: "no-cache",
    });
    if (!res.ok) throw new Error(`Network error: ${res.status}`);
    return res.json();
  } catch (err) {
    console.error("Server fetch error:", err);
    return null;
  }
}

// Sort helper
function sortData<T>(
  data: T[],
  field: keyof T,
  direction: "asc" | "desc"
): T[] {
  if (!field) return data;
  return [...data].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];
    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }
    return direction === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });
}

// Filter helper
function filterData(data: TableRow[], query: string): TableRow[] {
  if (!query) return data;
  return data.filter(
    (item) =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.email.toLowerCase().includes(query.toLowerCase()) ||
      item.organizationName.toLowerCase().includes(query.toLowerCase())
  );
}

export default async function OrganizationAdminPage({
  searchParams,
}: TableProps) {
  const queryParams = await searchParams;
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
    const agents = org.ownedOrganization.agents || [];
    const agentNames = agents
      .map((a) => a.userId || a.name || "N/A")
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

  const currentPage = Math.max(1, Math.min(meta.page, meta.totalPages));
  const totalPages = meta.totalPages;

  const currentFilters = parseFilters(queryParams);
  const [sortField, sortDirection = "asc"] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");

  const filteredData = filterData(tableData, queryParams.query || "");
  const sortedData = sortData(
    filteredData,
    sortField as keyof TableRow,
    sortDirection as "asc" | "desc"
  );

  const tableHeader =
    sortedData.length > 0
      ? Object.keys(sortedData[0])
      : [
          "name",
          "email",
          "phone",
          "organizationName",
          "organizationIndustry",
          "organizationAddress",
          "totalAgents",
          "agentNames",
        ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SearchField
          basePath={config.basePath}
          defaultQuery={queryParams.query || ""}
        />
      </div>

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
                  currentPage={currentPage}
                  limit={meta.limit}
                  searchQuery={queryParams.query || ""}
                  basePath={config.basePath}
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
                  {tableHeader.map((key) => (
                    <td key={key} className="px-4 py-3 border border-gray-200">
                      {item[key as keyof TableRow]}
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
        sortDirection={sortDirection}
        basePath={config.basePath}
      />
    </div>
  );
}

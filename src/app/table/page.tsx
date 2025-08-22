import { cn } from "@/lib/utils";
import Link from "next/link";
import Pagination from "./_components/Pagination";
import SearchField from "./_components/SearchField";
import Filter, { FilterField } from "./_components/Filter";
import {
  LucideArrowUpDown,
  LucideArrowUpNarrowWide,
  LucideArrowDownNarrowWide,
} from "lucide-react";

// Dummy table data
export const tableData = [
  {
    id: 1,
    name: "John",
    email: "john@example.com",
    createdAt: new Date("2024-01-15").getDate(),
    earning: 2500,
    status: "active",
    role: "user",
  },
  {
    id: 2,
    name: "Jane",
    email: "jane@example.com",
    createdAt: new Date("2024-02-20").getDate(),
    earning: 5200,
    status: "inactive",
    role: "admin",
  },
  {
    id: 3,
    name: "Bob",
    email: "bob@example.com",
    createdAt: new Date("2024-01-10").getDate(),
    earning: 7800,
    status: "active",
    role: "user",
  },
  {
    id: 4,
    name: "Alice",
    email: "alice@example.com",
    createdAt: new Date("2024-03-05").getDate(),
    earning: 3400,
    status: "active",
    role: "admin",
  },
  {
    id: 5,
    name: "Charlie",
    email: "charlie@example.com",
    createdAt: new Date("2024-02-28").getDate(),
    earning: 1200,
    status: "inactive",
    role: "user",
  },
  {
    id: 6,
    name: "David",
    email: "david@example.com",
    createdAt: new Date("2024-03-15").getDate(),
    earning: 4600,
    status: "active",
    role: "user",
  },
  {
    id: 7,
    name: "Emma",
    email: "emma@example.com",
    createdAt: new Date("2024-01-25").getDate(),
    earning: 3800,
    status: "active",
    role: "admin",
  },
  {
    id: 8,
    name: "Frank",
    email: "frank@example.com",
    createdAt: new Date("2024-02-10").getDate(),
    earning: 5900,
    status: "inactive",
    role: "user",
  },
  {
    id: 9,
    name: "Grace",
    email: "grace@example.com",
    createdAt: new Date("2024-03-20").getDate(),
    earning: 2200,
    status: "active",
    role: "user",
  },
  {
    id: 10,
    name: "Henry",
    email: "henry@example.com",
    createdAt: new Date("2024-01-05").getDate(),
    earning: 6700,
    status: "inactive",
    role: "admin",
  },
  {
    id: 11,
    name: "Ivy",
    email: "ivy@example.com",
    createdAt: new Date("2024-02-15").getDate(),
    earning: 4100,
    status: "active",
    role: "user",
  },
  {
    id: 12,
    name: "Jack",
    email: "jack@example.com",
    createdAt: new Date("2024-03-10").getDate(),
    earning: 3300,
    status: "active",
    role: "user",
  },
  {
    id: 13,
    name: "Kelly",
    email: "kelly@example.com",
    createdAt: new Date("2024-01-12").getDate(),
    earning: 5600,
    status: "inactive",
    role: "admin",
  },
  {
    id: 14,
    name: "Liam",
    email: "liam@example.com",
    createdAt: new Date("2024-02-18").getDate(),
    earning: 4700,
    status: "active",
    role: "user",
  },
  {
    id: 15,
    name: "Mia",
    email: "mia@example.com",
    createdAt: new Date("2024-03-08").getDate(),
    earning: 3900,
    status: "inactive",
    role: "user",
  },
  {
    id: 16,
    name: "Noah",
    email: "noah@example.com",
    createdAt: new Date("2024-01-22").getDate(),
    earning: 6100,
    status: "active",
    role: "admin",
  },
  {
    id: 17,
    name: "Olivia",
    email: "olivia@example.com",
    createdAt: new Date("2024-02-25").getDate(),
    earning: 2800,
    status: "active",
    role: "user",
  },
  {
    id: 18,
    name: "Paul",
    email: "paul@example.com",
    createdAt: new Date("2024-03-12").getDate(),
    earning: 5300,
    status: "inactive",
    role: "admin",
  },
  {
    id: 19,
    name: "Quinn",
    email: "quinn@example.com",
    createdAt: new Date("2024-01-18").getDate(),
    earning: 3600,
    status: "active",
    role: "user",
  },
  {
    id: 20,
    name: "Rachel",
    email: "rachel@example.com",
    createdAt: new Date("2024-02-05").getDate(),
    earning: 4400,
    status: "active",
    role: "admin",
  },
];

const tableHeader = Object.keys(tableData[0]);

interface TableSearchParams {
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

// ---------- DEFAULTS ----------
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 5;
const DEFAULT_SORT = "";

// ---------- FILTER CONFIGURATION ----------
const filterFields: FilterField[] = [
  {
    key: "status",
    label: "Status",
    type: "multi-select",
    options: [
      { label: "Active", value: "active" },
      { label: "Inactive", value: "inactive" },
    ],
  },
  {
    key: "role",
    label: "Role",
    type: "multi-select",
    options: [
      { label: "User", value: "user" },
      { label: "Admin", value: "admin" },
    ],
  },
  // {
  //   key: "earning_range",
  //   label: "Earning Range",
  //   type: "select",
  //   options: [
  //     { label: "Under $3,000", value: "under_3000" },
  //     { label: "$3,000 - $5,000", value: "3000_5000" },
  //     { label: "Above $5,000", value: "above_5000" },
  //   ],
  // },
];

// ---------- HELPERS ----------
function sortData<T extends Record<string, unknown>>(
  data: T[],
  field: string,
  direction: string
): T[] {
  if (!field || !direction) return data;
  return [...data].sort((a, b) => {
    const aVal = a[field];
    const bVal = b[field];
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return direction === "asc" ? -1 : 1;
    if (bVal == null) return direction === "asc" ? 1 : -1;
    if (typeof aVal === "number" && typeof bVal === "number") {
      return direction === "asc" ? aVal - bVal : bVal - aVal;
    }
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return direction === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}

function paginateData<T>(data: T[], page: number, limit: number): T[] {
  const startIndex = (page - 1) * limit;
  return data.slice(startIndex, startIndex + limit);
}

function filterData<T extends Record<string, unknown>>(
  data: T[],
  query: string
) {
  if (!query) return data;
  const q = query.toLowerCase();
  return data.filter((item) =>
    Object.values(item).some((v) => String(v).toLowerCase().includes(q))
  );
}

function applyFilters<T extends Record<string, unknown>>(
  data: T[],
  filters: Record<string, string | string[]>
): T[] {
  return data.filter((item) => {
    // Status filter
    if (filters.status) {
      const statusValues = Array.isArray(filters.status)
        ? filters.status
        : [filters.status];
      if (
        statusValues.length > 0 &&
        !statusValues.includes(String(item.status))
      ) {
        return false;
      }
    }

    // Role filter
    if (filters.role) {
      const roleValues = Array.isArray(filters.role)
        ? filters.role
        : [filters.role];
      if (roleValues.length > 0 && !roleValues.includes(String(item.role))) {
        return false;
      }
    }

    // Earning range filter
    if (filters.earning_range && typeof item.earning === "number") {
      const earning = item.earning;
      switch (filters.earning_range) {
        case "under_3000":
          if (earning >= 3000) return false;
          break;
        case "3000_5000":
          if (earning < 3000 || earning > 5000) return false;
          break;
        case "above_5000":
          if (earning <= 5000) return false;
          break;
      }
    }

    return true;
  });
}

// Parse URL filters
function parseFilters(
  searchParams: TableSearchParams
): Record<string, string | string[]> {
  const filters: Record<string, string | string[]> = {};

  // Handle comma-separated multi-values
  Object.entries(searchParams).forEach(([key, value]) => {
    if (key === "page" || key === "limit" || key === "sort" || key === "query")
      return;

    if (typeof value === "string" && value.includes(",")) {
      filters[key] = value.split(",");
    } else if (value) {
      if (typeof value === "number") {
        filters[key] = value.toString();
      } else {
        filters[key] = value;
      }
    }
  });

  return filters;
}

// ---------- TABLE PAGE ----------
export default async function TablePage({ searchParams }: TableProps) {
  const queryParams = await searchParams;
  const page = Number(queryParams.page) || DEFAULT_PAGE;
  const limit = Number(queryParams.limit) || DEFAULT_LIMIT;
  const [sortField, sortDirection = ""] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");
  const searchQuery = queryParams.query || "";

  // Parse filters from URL
  const currentFilters = parseFilters(queryParams);

  // Apply filtering (but not sorting or pagination yet)
  let filteredData = [...tableData];

  // Apply search filter
  filteredData = filterData(filteredData, searchQuery);

  // Apply field filters
  filteredData = applyFilters(filteredData, currentFilters);

  // Calculate pagination info based on filtered data
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Now paginate the filtered data
  const paginatedData = paginateData(filteredData, page, limit);

  // Finally, sort ONLY the paginated data
  const sortedPaginatedData = sortData(paginatedData, sortField, sortDirection);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <SearchField defaultQuery={searchQuery} />
        <div className="text-sm text-gray-600">
          Showing {sortedPaginatedData.length} of {totalItems} results
        </div>
      </div>

      {/* Filter Component */}
      <Filter
        filterFields={filterFields}
        currentFilters={currentFilters}
        searchQuery={searchQuery}
        currentPage={page}
        limit={limit}
        sortField={sortField}
        sortDirection={sortDirection}
      />

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
                currentFilters={currentFilters}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPaginatedData.map((item) => (
            <tr key={item.id} className="even:bg-gray-50">
              <td className="border px-4 py-2">{item.id}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">{item.email}</td>
              <td className="border px-4 py-2">{item.createdAt}</td>
              <td className="border px-4 py-2">
                ${item.earning.toLocaleString()}
              </td>
              <td className="border px-4 py-2">
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    item.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  )}
                >
                  {item.status}
                </span>
              </td>
              <td className="border px-4 py-2">
                <span
                  className={cn(
                    "px-2 py-1 text-xs rounded-full",
                    item.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  )}
                >
                  {item.role}
                </span>
              </td>
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
      />
    </div>
  );
}

// ---------- TABLE HEADER ITEM ----------
interface TableHeaderItemProps {
  field: string;
  currentSort: string;
  sortDirection: string;
  currentPage: number;
  limit: number;
  searchQuery: string;
  currentFilters: Record<string, string | string[]>;
}

function TableHeaderItem({
  field,
  currentSort,
  sortDirection,
  currentPage,
  limit,
  searchQuery,
  currentFilters,
}: TableHeaderItemProps) {
  const isActive = currentSort === field;
  const nextDirection =
    !isActive || !sortDirection ? "asc" : sortDirection === "asc" ? "desc" : "";

  const urlParams = new URLSearchParams();
  urlParams.set("page", currentPage.toString());
  urlParams.set("limit", limit.toString());
  if (searchQuery) urlParams.set("query", searchQuery);
  if (nextDirection) urlParams.set("sort", `${field}:${nextDirection}`);

  // Preserve current filters
  Object.entries(currentFilters).forEach(([key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      urlParams.set(key, value.join(","));
    } else if (typeof value === "string" && value) {
      urlParams.set(key, value);
    }
  });

  const getIcon = () => {
    if (!isActive || !sortDirection) return <LucideArrowUpDown size={12} />;
    if (sortDirection === "asc") return <LucideArrowUpNarrowWide size={12} />;
    return <LucideArrowDownNarrowWide size={12} />;
  };

  return (
    <th className="border border-gray-300 text-left cursor-pointer">
      <Link
        href={`/table?${urlParams.toString()}`}
        className={cn(
          "flex items-center p-2 rounded",
          isActive ? "bg-gray-200" : "hover:bg-gray-100"
        )}
      >
        <span className="inline-flex gap-1 items-center font-semibold relative">
          {field}
          <span className="absolute right-0 translate-x-full">{getIcon()}</span>
        </span>
      </Link>
    </th>
  );
}

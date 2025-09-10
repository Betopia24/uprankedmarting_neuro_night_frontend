import Pagination from "./components/Pagination";
import SearchField from "./components/SearchField";
import Filter, { FilterField } from "./components/Filter";
import TableHeaderItem from "./components/TableHeaderItem";
import { sortData } from "./utils/sortData";
import paginateData from "./utils/paginateData";
import { applyFilters, filterData, parseFilters } from "./utils/filters";

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

const config = {
  basePath: "/table",
};

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
    type: "select",
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

export default async function TablePage({ searchParams }: TableProps) {
  const data = tableData || [];
  const queryParams = await searchParams;
  const page = Number(queryParams.page) || DEFAULT_PAGE;
  const limit = Number(queryParams.limit) || DEFAULT_LIMIT;
  const [sortField, sortDirection = ""] = (
    queryParams.sort || DEFAULT_SORT
  ).split(":");
  const searchQuery = queryParams.query || "";

  const tableHeader = Object.keys(tableData[0]);

  // Parse filters from URL
  const currentFilters = parseFilters(queryParams);

  // Apply filtering (but not sorting or pagination yet)
  let filteredData = [...data];

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
      <SearchField basePath={config.basePath} defaultQuery={searchQuery} />

      {/* Filter Component */}
      <Filter
        filterFields={filterFields}
        currentFilters={currentFilters}
        searchQuery={searchQuery}
        currentPage={page}
        limit={limit}
        sortField={sortField}
        sortDirection={sortDirection}
        basePath={config.basePath}
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
                basePath={config.basePath}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPaginatedData.map((item) => {
            const fields = Object.values(item);
            return fields.map((_, index) => (
              <tr key={index}>
                {fields.map((field, index) => (
                  <td key={index} className="border border-gray-200 p-2">
                    {field}
                  </td>
                ))}
              </tr>
            ));
          })}
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

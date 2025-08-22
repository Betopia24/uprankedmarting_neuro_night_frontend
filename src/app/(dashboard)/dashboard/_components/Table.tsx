// app/calls/page.tsx
import Link from "next/link";
import { FilterBar } from "./FilterBar";

type TableRow = Record<string, any>;

const tableData: TableRow[] = [
  {
    "Caller Number": "01253647891",
    "Call Type": "Inbound",
    "Call Time": "10:30 PM",
    "Call Duration": "00:10:30",
    Receive: "10:30 PM",
    "Agent Name": "John Doe",
    Date: "2025-08-07",
    "Call Record": "record-1.mp3",
    "Call Summary": "Client inquiry",
  },
  {
    "Caller Number": "01987654321",
    "Call Type": "Outbound",
    "Call Time": "11:00 AM",
    "Call Duration": "00:05:12",
    Receive: "11:00 AM",
    "Agent Name": "Jane Smith",
    Date: "2025-08-06",
    "Call Record": "record-2.mp3",
    "Call Summary": "Follow-up call",
  },
  // More rows here...
];

type SearchParams = Record<string, string | string[] | undefined>;

function sortData(
  data: TableRow[],
  sortKey: string,
  direction: "asc" | "desc"
) {
  if (!sortKey) return data;
  return [...data].sort((a, b) => {
    const aVal = (a[sortKey] ?? "").toString();
    const bVal = (b[sortKey] ?? "").toString();
    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

function filterData(
  data: TableRow[],
  filters: Record<string, string>,
  headers: string[]
) {
  return data.filter((row) =>
    headers.every((key) => {
      const filterVal = filters[key]?.toLowerCase() || "";
      if (!filterVal) return true;
      return row[key]?.toString().toLowerCase().includes(filterVal);
    })
  );
}

function buildQueryString(
  filters: Record<string, string>,
  sortKey: string,
  direction: string,
  currentPage: number,
  overrides: Partial<Record<string, string>>
) {
  const params = new URLSearchParams();

  for (const key in filters) {
    if (filters[key]) {
      params.set(key, filters[key]);
    }
  }

  params.set("sort", overrides.sort ?? sortKey);
  params.set("direction", overrides.direction ?? direction);
  params.set("page", overrides.page ?? currentPage.toString());

  return "?" + params.toString();
}

type PaginationButtonProps = {
  children: React.ReactNode;
  href: string;
  disabled?: boolean;
  active?: boolean;
};

function PaginationButton({
  children,
  href,
  disabled = false,
  active = false,
}: PaginationButtonProps) {
  if (disabled) {
    return (
      <button
        disabled
        className="px-3 py-1 rounded border border-gray-300 bg-gray-200 text-gray-500 cursor-not-allowed"
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      href={href}
      className={`px-3 py-1 rounded border border-gray-300 ${
        active ? "bg-blue-600 text-white" : "hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
}

export default function CallsPage({
  searchParams,
}: {
  searchParams?: SearchParams;
}) {
  const data = tableData;
  if (!data.length) return <p>No data available</p>;

  const headers = Object.keys(data[0]);

  const pageParam =
    typeof searchParams?.page === "string" ? searchParams.page : "1";
  const sortKey =
    typeof searchParams?.sort === "string" ? searchParams.sort : "";
  const direction =
    typeof searchParams?.direction === "string" &&
    ["asc", "desc"].includes(searchParams.direction)
      ? (searchParams.direction as "asc" | "desc")
      : "asc";

  const filters = headers.reduce<Record<string, string>>((acc, key) => {
    const val = searchParams?.[key];
    acc[key] = typeof val === "string" ? val : "";
    return acc;
  }, {});

  const currentPage = Math.max(1, parseInt(pageParam, 10) || 1);
  const rowsPerPage = 5;

  const filtered = filterData(data, filters, headers);
  const sorted = sortData(filtered, sortKey, direction);

  const totalPages = Math.ceil(sorted.length / rowsPerPage);
  const paginated = sorted.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="overflow-x-auto p-4">
      <FilterBar
        initialFilters={filters}
        filterConfig={[
          { key: "Caller Number", label: "Caller Number", type: "text" },
          {
            key: "Call Type",
            label: "Call Type",
            type: "select",
            options: [
              { value: "Inbound", label: "Inbound" },
              { value: "Outbound", label: "Outbound" },
            ],
          },
          { key: "Call Time", label: "Call Time", type: "text" },
          { key: "Call Duration", label: "Call Duration", type: "text" },
          { key: "Receive", label: "Receive", type: "text" },
          { key: "Agent Name", label: "Agent Name", type: "text" },
          { key: "Date", label: "Date", type: "text" },
          { key: "Call Record", label: "Call Record", type: "text" },
          { key: "Call Summary", label: "Call Summary", type: "text" },
        ]}
      />
      <table className="mt-4 min-w-full border border-gray-300 border-collapse">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            {headers.map((header) => {
              const isSorted = sortKey === header;
              const nextDirection =
                isSorted && direction === "asc" ? "desc" : "asc";
              const sortIcon = isSorted
                ? direction === "asc"
                  ? "⬆️"
                  : "⬇️"
                : "↕️";

              return (
                <th
                  key={header}
                  className="border border-gray-300 px-4 py-2 text-left"
                >
                  <Link
                    href={buildQueryString(
                      filters,
                      sortKey,
                      direction,
                      currentPage,
                      {
                        sort: header,
                        direction: nextDirection,
                        page: "1",
                      }
                    )}
                    className="flex items-center gap-1 select-none"
                  >
                    <span>{header}</span> <span>{sortIcon}</span>
                  </Link>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="text-center p-4 text-gray-500 italic"
              >
                No matching data
              </td>
            </tr>
          ) : (
            paginated.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {headers.map((key) => (
                  <td
                    key={key}
                    className="border border-gray-300 px-4 py-2 whitespace-nowrap"
                    title={row[key]}
                  >
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="mt-4 flex justify-center gap-2">
        <PaginationButton
          disabled={currentPage <= 1}
          href={buildQueryString(
            filters,
            sortKey,
            direction,
            currentPage,
            { page: (currentPage - 1).toString() }
          )}
        >
          Previous
        </PaginationButton>

        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <PaginationButton
              key={pageNum}
              href={buildQueryString(
                filters,
                sortKey,
                direction,
                currentPage,
                { page: pageNum.toString() }
              )}
              active={pageNum === currentPage}
            >
              {pageNum}
            </PaginationButton>
          );
        })}

        <PaginationButton
          disabled={currentPage >= totalPages}
          href={buildQueryString(
            filters,
            sortKey,
            direction,
            currentPage,
            { page: (currentPage + 1).toString() }
          )}
        >
          Next
        </PaginationButton>
      </div>
    </div>
  );
}

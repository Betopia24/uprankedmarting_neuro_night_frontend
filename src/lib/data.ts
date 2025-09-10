
const PAGE_SIZE = 5;
type Row = Record<string, string>;

const tableData: Row[] = [
  {
    "Caller Number": "01253647891",
    "Call Type": "Inbound",
    Date: "2025-08-01",
    "Call Summary": "Inquiry",
  },
  {
    "Caller Number": "01987654321",
    "Call Type": "Outbound",
    Date: "2025-08-02",
    "Call Summary": "Follow-up",
  },
  {
    "Caller Number": "03579246813",
    "Call Type": "Inbound",
    Date: "2025-08-03",
    "Call Summary": "Support",
  },
  {
    "Caller Number": "04444444444",
    "Call Type": "Outbound",
    Date: "2025-08-04",
    "Call Summary": "Sales Call",
  },
  {
    "Caller Number": "05555555555",
    "Call Type": "Inbound",
    Date: "2025-08-05",
    "Call Summary": "Complaint",
  },
  {
    "Caller Number": "06666666666",
    "Call Type": "Outbound",
    Date: "2025-08-06",
    "Call Summary": "Survey",
  },
  {
    "Caller Number": "07777777777",
    "Call Type": "Inbound",
    Date: "2025-08-07",
    "Call Summary": "Technical Issue",
  },
  {
    "Caller Number": "08888888888",
    "Call Type": "Outbound",
    Date: "2025-08-08",
    "Call Summary": "Reminder",
  },
  {
    "Caller Number": "09999999999",
    "Call Type": "Inbound",
    Date: "2025-08-09",
    "Call Summary": "General Question",
  },
  {
    "Caller Number": "01111111111",
    "Call Type": "Outbound",
    Date: "2025-08-10",
    "Call Summary": "Marketing",
  },
];

export async function getData({
  search,
  filter,
  page,
  sort,
  order,
}: {
  search?: string;
  filter?: string;
  page?: string;
  sort?: string;
  order?: string;
}) {
  const currentPage = parseInt(page ?? "1", 10);
  const searchStr = (search ?? "").toLowerCase();

  let filtered = tableData;

  if (searchStr) {
    filtered = filtered.filter((row) =>
      Object.values(row).some((v) => v.toLowerCase().includes(searchStr))
    );
  }

  if (filter) {
    filtered = filtered.filter((row) => row["Call Type"] === filter);
  }

  if (sort) {
    filtered.sort((a, b) => {
      const aVal = a[sort] ?? "";
      const bVal = b[sort] ?? "";
      if (order === "asc") {
        return aVal.toString().localeCompare(bVal.toString());
      } else {
        return bVal.toString().localeCompare(aVal.toString());
      }
    });
  }

  const total = filtered.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );
  const headers = Object.keys(tableData[0] || {});

  return {
    data: paginated,
    total,
    pageCount,
    headers,
  };
}

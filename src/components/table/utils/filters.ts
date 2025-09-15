import { TableSearchParams } from "..";

export function filterData<T extends Record<string, unknown>>(
  data: T[],
  query: string
) {
  if (!query) return data;
  const q = query.toLowerCase();
  return data.filter((item) =>
    Object.values(item).some((v) => String(v).toLowerCase().includes(q))
  );
}

export function applyFilters<T extends Record<string, unknown>>(
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
export function parseFilters(
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

import { cn } from "@/lib/utils";
import {
  LucideArrowDownNarrowWide,
  LucideArrowUpDown,
  LucideArrowUpNarrowWide,
} from "lucide-react";
import Link from "next/link";

// ---------- TABLE HEADER ITEM ----------
interface TableHeaderItemProps {
  field: string;
  currentSort: string;
  sortDirection: string;
  currentPage: number;
  limit: number;
  searchQuery: string;
  currentFilters?: Record<string, string | string[]>;
  basePath: string;
}

export default function TableHeaderItem({
  field,
  currentSort,
  sortDirection,
  currentPage,
  limit,
  searchQuery,
  currentFilters,
  basePath,
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
  Object.entries(currentFilters || {}).forEach(([key, value]) => {
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
        href={`${basePath}?${urlParams.toString()}`}
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

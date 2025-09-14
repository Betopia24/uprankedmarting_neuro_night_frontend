"use client";

import { cn } from "@/lib/utils";
import { LucideChevronDown, LucideLoader } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

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

function camelCaseToTitle(str: string) {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .trim();
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [localSortDirection, setLocalSortDirection] = useState<string | null>(
    currentSort === field ? sortDirection : null
  );
  const [isSorting, setIsSorting] = useState(false);

  useEffect(() => {
    setLocalSortDirection(currentSort === field ? sortDirection : null);
    setIsSorting(false); // stop loader when server updates
  }, [currentSort, sortDirection, field]);

  const isActive = currentSort === field || localSortDirection !== null;
  const nextDirection = !localSortDirection
    ? "asc"
    : localSortDirection === "asc"
    ? "desc"
    : "asc";

  const handleSort = () => {
    setLocalSortDirection(nextDirection);
    setIsSorting(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    params.set("limit", limit.toString());
    if (searchQuery) params.set("query", searchQuery);
    params.set("sort", `${field}:${nextDirection}`);

    Object.entries(currentFilters || {}).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (typeof value === "string" && value) {
        params.set(key, value);
      }
    });

    router.replace(`${basePath}?${params.toString()}`);
  };

  return (
    <th className="border border-gray-300 text-left cursor-pointer whitespace-nowrap">
      <div
        onClick={handleSort}
        className={cn(
          "flex items-center p-2 select-none transition-colors duration-200 rounded hover:bg-gray-50",
          isActive ? "bg-gray-100 font-semibold" : ""
        )}
      >
        <span className="inline-flex items-center gap-1 relative">
          {camelCaseToTitle(field)}
          {isSorting ? (
            <LucideLoader className="w-4 h-4 ml-1 animate-spin text-gray-500" />
          ) : (
            <LucideChevronDown
              size={14}
              className={cn(
                "transition-transform duration-200",
                isActive ? "text-blue-600" : "text-gray-400 opacity-0",
                localSortDirection === "desc" ? "rotate-180" : "rotate-0"
              )}
            />
          )}
        </span>
      </div>
    </th>
  );
}

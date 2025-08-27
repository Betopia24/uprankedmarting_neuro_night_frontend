// app/_components/Pagination.tsx
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { LucideChevronLeft, LucideChevronRight } from "lucide-react";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
  sortField?: string;
  sortDirection?: string;
  basePath?: string; // default = "/table"
}

export default function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  sortField,
  sortDirection,
  limit,
  basePath = "/table",
}: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (sortField && sortDirection) {
      params.set("sort", `${sortField}:${sortDirection}`);
    }
    return `${basePath}?${params.toString()}`;
  };

  const getPageNumbers = (): number[] => {
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let end = Math.min(totalPages, start + maxPagesToShow - 1);
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center space-x-2">
        {/* Previous */}
        <Link
          href={buildUrl(currentPage - 1)}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700",
            !hasPrevPage && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          <LucideChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Link>

        {/* Pages */}
        <div className="flex items-center space-x-1">
          {pageNumbers.map((pageNum) => (
            <Link
              key={pageNum}
              href={buildUrl(pageNum)}
              className={cn(
                "px-3 py-2 text-sm font-medium border rounded-lg",
                currentPage === pageNum
                  ? "bg-gray-50 border-blue-500 text-blue-600"
                  : "bg-white border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              )}
            >
              {pageNum}
            </Link>
          ))}
        </div>

        {/* Next */}
        <Link
          href={buildUrl(currentPage + 1)}
          className={cn(
            "flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700",
            !hasNextPage && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          Next
          <LucideChevronRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="text-sm text-gray-500">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
}

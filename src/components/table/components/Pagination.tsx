"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
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
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const buildUrl = (page: number) => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (sortField && sortDirection) {
      params.set("sort", `${sortField}:${sortDirection}`);
    }
    return `${basePath}?${params.toString()}`;
  };

  const navigate = (page: number) => {
    const url = buildUrl(page);
    startTransition(() => {
      router.push(url, { scroll: false });
    });
  };

  const getPageNumbers = (): number[] => {
    const maxPagesToShow = 5;
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    let start = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const end = Math.min(totalPages, start + maxPagesToShow - 1);
    if (end - start < maxPagesToShow - 1) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-3">
      <div className="text-sm text-gray-600">
        Page <span className="font-medium">{currentPage}</span> of{" "}
        <span className="font-medium">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Previous */}
        <button
          disabled={!hasPrevPage || isPending}
          onClick={() => navigate(currentPage - 1)}
          className={cn(
            "flex cursor-pointer items-center px-3 py-2 text-sm font-medium rounded-full border transition-all",
            !hasPrevPage || isPending
              ? "opacity-50 bg-gray-100 text-gray-400"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800"
          )}
        >
          <LucideChevronLeft className="w-4 h-4 mr-1" />
          Prev
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNum) => (
          <button
            key={pageNum}
            disabled={isPending}
            onClick={() => navigate(pageNum)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-full border transition-all cursor-pointer",
              currentPage === pageNum
                ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800",
              isPending && "opacity-50"
            )}
          >
            {pageNum}
          </button>
        ))}

        {/* Next */}
        <button
          disabled={!hasNextPage || isPending}
          onClick={() => navigate(currentPage + 1)}
          className={cn(
            "flex cursor-pointer items-center px-3 py-2 text-sm font-medium rounded-full border transition-all",
            !hasNextPage || isPending
              ? "opacity-50 cursor-not-allowed bg-gray-100 text-gray-400"
              : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 hover:text-gray-800"
          )}
        >
          Next
          <LucideChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}

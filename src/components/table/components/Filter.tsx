"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LucideX,
  LucideFilter,
  LucideChevronDown,
  LucideCheck,
} from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterField {
  key: string;
  label: string;
  type: "select" | "multi-select";
  options: FilterOption[];
}

export interface FilterProps {
  filterFields: FilterField[];
  currentFilters: Record<string, string | string[]>;
  searchQuery?: string;
  currentPage?: number;
  limit?: number;
  sortField?: string;
  sortDirection?: string;
  basePath: string;
}

export default function Filter({
  filterFields,
  currentFilters,
  searchQuery = "",
  // currentPage = 1,
  limit = 5,
  sortField = "",
  sortDirection = "",
  basePath,
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const buildUrl = (newFilters: Record<string, string | string[]>) => {
    const params = new URLSearchParams();

    // Reset to page 1 when filters change
    params.set("page", "1");
    params.set("limit", limit.toString());

    if (searchQuery) params.set("query", searchQuery);
    if (sortField && sortDirection)
      params.set("sort", `${sortField}:${sortDirection}`);

    // Add filter parameters
    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        params.set(key, value.join(","));
      } else if (typeof value === "string" && value) {
        params.set(key, value);
      }
    });

    return `${basePath}?${params.toString()}`;
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    params.set("limit", limit.toString());
    if (searchQuery) params.set("query", searchQuery);
    if (sortField && sortDirection)
      params.set("sort", `${sortField}:${sortDirection}`);
    return `${basePath}?${params.toString()}`;
  };

  const hasActiveFilters = Object.values(currentFilters).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  const getTotalActiveFilters = () => {
    return Object.values(currentFilters).reduce(
      (acc, val) => acc + (Array.isArray(val) ? val.length : val ? 1 : 0),
      0
    );
  };

  // const getSelectedCount = (field: FilterField) => {
  //   const currentValue = currentFilters[field.key];
  //   if (!currentValue) return 0;
  //   return Array.isArray(currentValue) ? currentValue.length : 1;
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Filter Dropdown Button */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={toggleDropdown}
          className={cn(
            "flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm",
            "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            "transition-colors",
            isOpen && "ring-2 ring-blue-500 border-blue-500",
            hasActiveFilters && "border-blue-300 bg-blue-50"
          )}
        >
          <LucideFilter className="w-4 h-4 text-gray-600" />
          <span
            className={cn(
              "font-medium",
              hasActiveFilters ? "text-blue-700" : "text-gray-700"
            )}
          >
            Filters
          </span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {getTotalActiveFilters()}
            </span>
          )}
          <LucideChevronDown
            className={cn(
              "w-4 h-4 text-gray-400 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 right-0 mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
            <div className="p-4">
              {/* Clear All Button */}
              {hasActiveFilters && (
                <div className="mb-4 pb-3 border-b border-gray-200">
                  <Link
                    href={clearAllFilters()}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    <LucideX className="w-3 h-3" />
                    Clear All Filters
                  </Link>
                </div>
              )}

              {/* Filter Sections */}
              <div className="space-y-4">
                {filterFields.map((field, fieldIndex) => (
                  <div key={field.key}>
                    <h4 className="font-medium text-gray-800 mb-2 text-sm">
                      {field.label}
                    </h4>
                    <div className="space-y-1">
                      {field.type === "select" && (
                        <>
                          {field.options.map((option) => {
                            const isSelected =
                              currentFilters[field.key] === option.value;
                            const newFilters = {
                              ...currentFilters,
                              [field.key]: isSelected ? "" : option.value,
                            };

                            return (
                              <Link
                                key={option.value}
                                href={buildUrl(newFilters)}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors",
                                  isSelected
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 mr-2 rounded-full border flex items-center justify-center",
                                    isSelected
                                      ? "bg-blue-500 border-blue-500"
                                      : "border-gray-300"
                                  )}
                                >
                                  {isSelected && (
                                    <div className="w-2 h-2 bg-white rounded-full" />
                                  )}
                                </div>
                                {option.label}
                              </Link>
                            );
                          })}
                        </>
                      )}

                      {field.type === "multi-select" && (
                        <>
                          {field.options.map((option) => {
                            const currentValues = Array.isArray(
                              currentFilters[field.key]
                            )
                              ? (currentFilters[field.key] as string[])
                              : currentFilters[field.key]
                              ? [currentFilters[field.key] as string]
                              : [];

                            const isSelected = currentValues.includes(
                              option.value
                            );

                            const newValues = isSelected
                              ? currentValues.filter((v) => v !== option.value)
                              : [...currentValues, option.value];

                            const newFilters = {
                              ...currentFilters,
                              [field.key]: newValues,
                            };

                            return (
                              <Link
                                key={option.value}
                                href={buildUrl(newFilters)}
                                className={cn(
                                  "flex items-center px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors",
                                  isSelected
                                    ? "bg-green-50 text-green-700"
                                    : "text-gray-700"
                                )}
                              >
                                <div
                                  className={cn(
                                    "w-4 h-4 mr-2 rounded border flex items-center justify-center",
                                    isSelected
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300"
                                  )}
                                >
                                  {isSelected && (
                                    <LucideCheck className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                {option.label}
                              </Link>
                            );
                          })}
                        </>
                      )}
                    </div>
                    {fieldIndex < filterFields.length - 1 && (
                      <div className="mt-3 border-b border-gray-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Active Filters Summary (outside dropdown) */}
      {/* {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {Object.entries(currentFilters)
            .map(([key, value]) => {
              if (!value || (Array.isArray(value) && value.length === 0))
                return null;

              const field = filterFields.find((f) => f.key === key);
              if (!field) return null;

              const displayValues = Array.isArray(value) ? value : [value];

              return displayValues.map((val) => {
                const option = field.options.find((opt) => opt.value === val);
                if (!option) return null;

                const newFilters = {
                  ...currentFilters,
                  [key]: Array.isArray(currentFilters[key])
                    ? (currentFilters[key] as string[]).filter((v) => v !== val)
                    : "",
                };

                return (
                  <Link
                    key={`${key}-${val}`}
                    href={buildUrl(newFilters)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200 transition-colors"
                  >
                    {field.label}: {option.label}
                    <LucideX className="w-3 h-3" />
                  </Link>
                );
              });
            })
            .filter(Boolean)}
        </div>
      )} */}
    </>
  );
}

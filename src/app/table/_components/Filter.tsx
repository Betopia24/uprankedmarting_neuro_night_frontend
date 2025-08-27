// app/_components/Filter.tsx
import Link from "next/link";
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

  const getSelectedCount = (field: FilterField) => {
    const currentValue = currentFilters[field.key];
    if (!currentValue) return 0;
    return Array.isArray(currentValue) ? currentValue.length : 1;
  };

  const getDisplayText = (field: FilterField) => {
    const count = getSelectedCount(field);
    if (count === 0) return `Select ${field.label}`;
    if (field.type === "select") {
      const option = field.options.find(
        (opt) => opt.value === currentFilters[field.key]
      );
      return option?.label || `Select ${field.label}`;
    }
    return count === 1 ? `1 ${field.label}` : `${count} ${field.label}s`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <LucideFilter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Filters</h3>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {Object.values(currentFilters).reduce(
                (acc, val) =>
                  acc + (Array.isArray(val) ? val.length : val ? 1 : 0),
                0
              )}
            </span>
          )}
        </div>
        {hasActiveFilters && (
          <Link
            href={clearAllFilters()}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:underline self-start sm:self-center"
          >
            <LucideX className="w-3 h-3" />
            Clear All
          </Link>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filterFields.map((field) => (
          <FilterDropdown
            key={field.key}
            field={field}
            currentFilters={currentFilters}
            buildUrl={buildUrl}
            displayText={getDisplayText(field)}
            selectedCount={getSelectedCount(field)}
          />
        ))}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-3 border-t border-gray-200">
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
                      ? (currentFilters[key] as string[]).filter(
                          (v) => v !== val
                        )
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
        </div>
      )}
    </div>
  );
}

// Dropdown Component
interface FilterDropdownProps {
  field: FilterField;
  currentFilters: Record<string, string | string[]>;
  buildUrl: (newFilters: Record<string, string | string[]>) => string;
  displayText: string;
  selectedCount: number;
}

function FilterDropdown({
  field,
  currentFilters,
  buildUrl,
  displayText,
  selectedCount,
}: FilterDropdownProps) {
  return (
    <div className="relative group">
      {/* Trigger Button */}
      <button
        className={cn(
          "w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm text-sm",
          "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
          "flex items-center justify-between transition-colors",
          selectedCount > 0 && "border-blue-300 bg-blue-50"
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedCount > 0 ? "text-blue-700 font-medium" : "text-gray-700"
          )}
        >
          {displayText}
        </span>
        <LucideChevronDown className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-transform group-hover:rotate-180" />
      </button>

      {/* Dropdown Menu */}
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 max-h-60 overflow-y-auto">
        <div className="py-1">
          {field.type === "select" && (
            <>
              {/* Clear option for single select */}
              {currentFilters[field.key] && (
                <Link
                  href={buildUrl({
                    ...currentFilters,
                    [field.key]: "",
                  })}
                  className="flex items-center px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  <LucideX className="w-4 h-4 mr-2" />
                  Clear selection
                </Link>
              )}
              {field.options.map((option) => {
                const isSelected = currentFilters[field.key] === option.value;
                const newFilters = {
                  ...currentFilters,
                  [field.key]: isSelected ? "" : option.value,
                };

                return (
                  <Link
                    key={option.value}
                    href={buildUrl(newFilters)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm hover:bg-gray-100 transition-colors",
                      isSelected ? "bg-blue-50 text-blue-700" : "text-gray-700"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 mr-2 rounded border flex items-center justify-center",
                        isSelected
                          ? "bg-blue-500 border-blue-500"
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

          {field.type === "multi-select" && (
            <>
              {field.options.map((option) => {
                const currentValues = Array.isArray(currentFilters[field.key])
                  ? (currentFilters[field.key] as string[])
                  : currentFilters[field.key]
                  ? [currentFilters[field.key] as string]
                  : [];

                const isSelected = currentValues.includes(option.value);

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
                      "flex items-center px-3 py-2 text-sm hover:bg-gray-100 transition-colors",
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
      </div>

      {/* Mobile Touch Overlay */}
      <div className="fixed inset-0 z-40 bg-transparent pointer-events-none group-hover:pointer-events-auto lg:hidden" />
    </div>
  );
}

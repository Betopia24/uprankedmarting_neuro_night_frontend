"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type FilterOption = {
  value: string;
  label: string;
};

export type FilterConfig = {
  key: string;
  label: string;
  type: "text" | "select";
  options?: FilterOption[];
};

type FilterBarProps = {
  initialFilters: Record<string, string>;
  filterConfig: FilterConfig[];
};

export function FilterBar({ initialFilters, filterConfig }: FilterBarProps) {
  const router = useRouter();
  const [filters, setFilters] = useState(initialFilters);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    for (const key in filters) {
      if (filters[key]) {
        params.set(key, filters[key]);
      }
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-center gap-3 rounded-lg bg-gray-50 p-4"
    >
      {filterConfig.map((config) => (
        <div key={config.key} className="flex flex-col">
          <label
            htmlFor={config.key}
            className="text-sm font-medium text-gray-600"
          >
            {config.label}
          </label>
          {config.type === "select" ? (
            <select
              id={config.key}
              value={filters[config.key] || ""}
              onChange={(e) => handleFilterChange(config.key, e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:w-auto"
            >
              <option value="">All</option>
              {config.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={config.key}
              type="text"
              placeholder={`Filter by ${config.label}...`}
              value={filters[config.key] || ""}
              onChange={(e) => handleFilterChange(config.key, e.target.value)}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:w-auto"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        className="mt-4 h-fit self-end rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Apply Filters
      </button>
    </form>
  );
}

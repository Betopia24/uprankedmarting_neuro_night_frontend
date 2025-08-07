"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FilterBarProps = {
  initialFilters: Record<string, string>;
  headers: string[];
};

export function FilterBar({ initialFilters, headers }: FilterBarProps) {
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
      {headers.map((header) => (
        <div key={header} className="flex flex-col">
          <label htmlFor={header} className="text-sm font-medium text-gray-600">
            {header}
          </label>
          <input
            id={header}
            type="text"
            placeholder={`Filter by ${header}...`}
            value={filters[header] || ""}
            onChange={(e) => handleFilterChange(header, e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:w-auto"
          />
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
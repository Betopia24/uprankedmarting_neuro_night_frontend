"use client";

import { useSearchParams, useRouter } from "next/navigation";

type FilterOption = {
  value: string;
  label: string;
};

type FilterProps = {
  filterOptions: FilterOption[];
};

export function Filter({ filterOptions }: FilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentFilter = searchParams.get("filter") ?? "";

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("filter", value);
    } else {
      params.delete("filter");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentFilter}
      onChange={handleFilterChange}
      className="border p-2 rounded-md"
    >
      <option value="">All</option>
      {filterOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
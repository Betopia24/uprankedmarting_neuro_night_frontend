'use client';

import { useRouter } from 'next/navigation';
import { useState } from "react";

type FilterBarProps = {
  initialSearch: string;
  initialFilter: string;
};

export function FilterBar({ initialSearch, initialFilter }: FilterBarProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [filter, setFilter] = useState(initialFilter);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (filter) params.set("filter", filter);
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 flex-wrap items-center">
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="px-3 py-2 border rounded w-full sm:max-w-sm text-sm"
      />
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="px-3 py-2 border rounded text-sm"
      >
        <option value="">All Call Types</option>
        <option value="Inbound">Inbound</option>
        <option value="Outbound">Outbound</option>
      </select>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
      >
        Apply
      </button>
    </form>
  );
}

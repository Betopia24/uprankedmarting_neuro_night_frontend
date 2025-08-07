'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export function Filter() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentFilter = searchParams.get('filter') ?? '';

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('filter', value);
    } else {
      params.delete('filter');
    }
    params.delete('page'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  return (
    <select
      value={currentFilter}
      onChange={handleFilterChange}
      className="border p-2 rounded-md"
    >
      <option value="">All</option>
      <option value="Inbound">Inbound</option>
      <option value="Outbound">Outbound</option>
    </select>
  );
}
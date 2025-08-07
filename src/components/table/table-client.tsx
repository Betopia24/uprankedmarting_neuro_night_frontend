'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export function TableClient({ data, headers, total, pageCount, currentPage }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', search);
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const handleSort = (key) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOrder = params.get('order') || 'asc';
    const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
    params.set('sort', key);
    params.set('order', newOrder);
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="border p-2 rounded-md"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Search
        </button>
      </form>

      <div className="overflow-auto border rounded-md">
        <table className="w-full min-w-[800px] text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {headers.map((key) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-2 cursor-pointer whitespace-nowrap"
                >
                  {key}
                  {searchParams.get('sort') === key && (
                    <span>{searchParams.get('order') === 'asc' ? ' ↑' : ' ↓'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                {headers.map((key) => (
                  <td key={key} className="px-4 py-2 whitespace-nowrap">
                    {row[key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          Showing {(currentPage - 1) * 5 + 1} - {Math.min(currentPage * 5, total)} of {total}
        </div>
        <div className="flex gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 border rounded-md ${
                p === currentPage ? 'bg-blue-500 text-white' : ''
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

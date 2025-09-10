
'use client';

import { useSearchParams, useRouter } from 'next/navigation';

export function SortableHeader({ h }: { h: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sort = searchParams.get('sort');
  const order = searchParams.get('order');

  const handleSort = () => {
    const newOrder = sort === h && order === 'asc' ? 'desc' : 'asc';
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', h);
    params.set('order', newOrder);
    router.push(`?${params.toString()}`);
  };

  return (
    <th onClick={handleSort} className="px-4 py-2 text-left border-b cursor-pointer">
      {h}
      {sort === h && <span>{order === 'asc' ? ' ↑' : ' ↓'}</span>}
    </th>
  );
}

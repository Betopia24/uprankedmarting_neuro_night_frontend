'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';

export function Pagination({ pageCount }: { pageCount: number }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get('page') ?? '1', 10);

  const buildLink = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (p > 1) {
      params.set('page', p.toString());
    } else {
      params.delete('page');
    }
    return `?${params.toString()}`;
  };

  if (pageCount <= 1) return null;

  return (
    <div className="flex gap-2 justify-center items-center">
      <button
        onClick={() => router.push(buildLink(currentPage - 1))}
        disabled={currentPage === 1}
        className={clsx(
          'px-3 py-1 border rounded text-sm',
          currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
        )}
      >
        Previous
      </button>

      {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => router.push(buildLink(p))}
          className={clsx(
            'px-3 py-1 border rounded text-sm',
            p === currentPage
              ? 'bg-blue-600 text-white'
              : 'hover:bg-gray-100'
          )}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => router.push(buildLink(currentPage + 1))}
        disabled={currentPage === pageCount}
        className={clsx(
          'px-3 py-1 border rounded text-sm',
          currentPage === pageCount
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-gray-100'
        )}
      >
        Next
      </button>
    </div>
  );
}
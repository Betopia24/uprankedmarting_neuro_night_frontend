import { tableData } from '@/components/table/data';
import { TableClient } from '@/components/table/table-client';

const PAGE_SIZE = 5;

export default async function NewTablePage({ searchParams }) {
  const search = (searchParams?.search ?? '').toLowerCase();
  const page = parseInt(searchParams?.page ?? '1', 10);
  const sort = searchParams?.sort ?? '';
  const order = searchParams?.order ?? 'asc';

  let filtered = tableData;

  if (search) {
    filtered = filtered.filter((row) =>
      Object.values(row).some((v) => v.toString().toLowerCase().includes(search))
    );
  }

  if (sort) {
    filtered.sort((a, b) => {
      const aVal = a[sort] ?? '';
      const bVal = b[sort] ?? '';
      if (order === 'asc') {
        return aVal.toString().localeCompare(bVal.toString());
      } else {
        return bVal.toString().localeCompare(aVal.toString());
      }
    });
  }

  const total = filtered.length;
  const pageCount = Math.ceil(total / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const headers = Object.keys(tableData[0] || {});

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <TableClient
        data={paginated}
        headers={headers}
        total={total}
        pageCount={pageCount}
        currentPage={page}
      />
    </div>
  );
}

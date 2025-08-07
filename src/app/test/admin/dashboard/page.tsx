import { Suspense } from "react";
import { DataTable } from "./_components/Table";
import { Pagination } from "./_components/Pagination";
import { Search } from "./_components/Search";
import { Filter } from "./_components/Filter";
import { getData } from "@/lib/data";

export default async function Page({ searchParams }) {
  const { pageCount } = await getData(searchParams);

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <Search />
        <Filter
          filterOptions={[
            { value: "Inbound", label: "Inbound" },
            { value: "Outbound", label: "Outbound" },
            { value: "Inquiry", label: "Inquiry" },
          ]}
        />
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <DataTable searchParams={searchParams} />
      </Suspense>

      <Pagination pageCount={pageCount} />
    </div>
  );
}

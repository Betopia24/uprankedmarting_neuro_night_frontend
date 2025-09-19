"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
export const dynamic = "force-dynamic";

const YearFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentYear = new Date().getFullYear();

  // Generate years list: current year → last 5 years
  const years = useMemo(
    () => Array.from({ length: 6 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const selectedYear = searchParams.get("year") || String(currentYear);

  const pathname = usePathname();
  const handleChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("year", year);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="mx-12 flex items-center gap-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Filter by Year
      </label>
      <select
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={selectedYear}
        onChange={(e) => handleChange(e.target.value)}
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default YearFilter;

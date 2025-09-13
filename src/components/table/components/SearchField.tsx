"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchFieldProps {
  defaultQuery?: string;
  debounceTime?: number;
  basePath: string;
}

export default function SearchField({
  defaultQuery = "",
  debounceTime = 500,
  basePath,
}: SearchFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Extract stable string from searchParams
  const searchParamsString = useMemo(
    () => searchParams.toString(),
    [searchParams]
  );

  const [query, setQuery] = useState(defaultQuery);

  // Sync input with URL on mount & when URL changes
  useEffect(() => {
    const initialQuery =
      new URLSearchParams(searchParamsString).get("query") || defaultQuery;
    setQuery(initialQuery);
  }, [searchParamsString, defaultQuery]);

  // Push URL updates when query changes
  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParamsString);

      if (query.trim()) {
        params.set("query", query);
      } else {
        params.delete("query");
      }

      // Reset pagination on new search
      params.delete("page");

      router.push(`${basePath}?${params.toString()}`);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, debounceTime, router, basePath, searchParamsString]);

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
      className="border rounded px-3 py-1 text-sm w-60"
    />
  );
}

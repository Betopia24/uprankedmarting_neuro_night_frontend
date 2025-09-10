"use client";

import { useState, useEffect } from "react";
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
  const [query, setQuery] = useState(defaultQuery);

  // Sync input with URL on mount
  useEffect(() => {
    const initialQuery = searchParams.get("query") || defaultQuery;
    setQuery(initialQuery);
  }, [searchParams, defaultQuery]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams();

      if (query.trim()) {
        params.set("query", query);
      }
      // Do NOT copy any pagination params; this resets pagination

      router.push(`${basePath}?${params.toString()}`);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query, debounceTime, router]);

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

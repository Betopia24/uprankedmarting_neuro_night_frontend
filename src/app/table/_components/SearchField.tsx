"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface SearchFieldProps {
  defaultQuery?: string;
  debounceTime?: number;
}

export default function SearchField({
  defaultQuery = "",
  debounceTime = 500,
}: SearchFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) params.set("query", query);
      else params.delete("query");
      router.push(`/table?${params.toString()}`);
    }, debounceTime);

    return () => clearTimeout(handler);
  }, [query]);

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

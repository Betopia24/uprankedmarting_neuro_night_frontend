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
  debounceTime = 200,
  basePath,
}: SearchFieldProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [value, setValue] = useState(defaultQuery);

  // Debounced update
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("query", value);
        params.set("page", "1");
      } else {
        params.delete("query");
      }

      router.push(`${basePath}?${params.toString()}`);
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [value, debounceTime, router, basePath, searchParams]);

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search..."
      className="border rounded px-3 py-1 text-sm w-60"
    />
  );
}

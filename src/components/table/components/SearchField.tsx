"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LucideSearch, LucideLoader } from "lucide-react";
import { cn } from "@/lib/utils";

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value) {
        params.set("query", value);
        params.set("page", "1");
      } else {
        params.delete("query");
      }

      // Push new URL
      router.push(`${basePath}?${params.toString()}`);

      // Stop loading after debounce
      setIsLoading(false);
    }, debounceTime);

    return () => clearTimeout(timeout);
  }, [value, debounceTime, router, basePath, searchParams]);

  return (
    <div className="relative w-64">
      <LucideSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />

      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search by name..."
        className={cn(
          "w-full pl-10 pr-10 py-2 rounded-lg border border-gray-300 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
        )}
      />

      {/* Loading indicator */}
      {isLoading && (
        <LucideLoader className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
      )}
    </div>
  );
}

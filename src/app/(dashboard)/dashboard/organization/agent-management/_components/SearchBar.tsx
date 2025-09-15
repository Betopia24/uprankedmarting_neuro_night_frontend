"use client";

import { LucideSearch } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  search: string;
  setSearch: (search: string) => void;
  delay?: number; // debounce delay in ms (default 300)
}

export default function SearchBar({
  search,
  setSearch,
  delay = 300,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(search);

  useEffect(() => {
    // Update local state if parent changes search externally
    setInputValue(search);
  }, [search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue !== search) {
        setSearch(inputValue);
      }
    }, delay);

    return () => clearTimeout(handler); // cleanup on re-type
  }, [inputValue, search, setSearch, delay]);

  return (
    <div className="inline-flex items-center border border-gray-300 focus-within:border-blue-500 rounded overflow-hidden focus-within:text-blue-500">
      <div className="bg-gray-200 self-stretch aspect-square w-12 flex items-center justify-center">
        <LucideSearch className="size-4 text-current" />
      </div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        type="text"
        placeholder="Search agents"
        className="w-full rounded-md px-3 py-2 focus-within:outline-0 text-gray-950"
      />
    </div>
  );
}

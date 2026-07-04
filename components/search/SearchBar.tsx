"use client";

import { Search, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchResult {
  title: string;
  type: string;
  href: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );

        if (res.ok) {
          setResults(await res.json());
        }
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search projects & docs..."
        className="
          w-full
          rounded-xl
          border
          border-green-500/20
          bg-black/40
          py-2.5
          pl-11
          pr-10
          text-sm
          outline-none
          backdrop-blur-xl
          transition
          focus:border-green-500
          focus:ring-2
          focus:ring-green-500/20
        "
      />

      {loading && (
        <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-green-400" />
      )}

      {results.length > 0 && (
        <div
          className="
            absolute
            left-0
            right-0
            top-14
            z-50
            overflow-hidden
            rounded-2xl
            border
            border-green-500/20
            bg-zinc-950/95
            shadow-2xl
            backdrop-blur-2xl
          "
        >
          {results.map((result, index) => (
            <a
              key={`${result.href}-${result.type}-${index}`}
              href={result.href}
              className="
                block
                border-b
                border-green-500/10
                px-5
                py-3
                transition
                hover:bg-green-500/10
              "
            >
              <div className="font-medium">
                {result.title}
              </div>

              <div className="text-xs text-green-400">
                {result.type}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
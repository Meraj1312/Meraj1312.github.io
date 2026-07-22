"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { GITHUB_USER } from "@/lib/github";
import SearchBar from "@/components/search/SearchBar";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export function CyberNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-violet-500/15 bg-black/70 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-6">

        {/* Logo */}

        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 ring-1 ring-violet-500/30 shadow-[0_0_18px_rgba(139,92,246,.25)]">
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-lg font-bold text-transparent">
              M
            </span>
          </div>

          <div>
            <p className="font-semibold">
              Mohammad Meraj
            </p>

            <p className="text-xs text-zinc-500">
              Offensice Security Researcher
            </p>
          </div>
        </Link>

        {/* Navigation */}

        <nav className="hidden lg:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-zinc-400 transition hover:text-violet-300"
          >
            Home
          </Link>

          <Link
            href="/knowledge"
            className="text-sm text-zinc-400 transition hover:text-violet-300"
          >
            Knowledge
          </Link>

          <Link
            href="/repos/Write-Ups"
            className="text-sm text-zinc-400 transition hover:text-violet-300"
          >
            Write-ups
          </Link>
        </nav>

        {/* Search */}

        <div className="hidden md:flex flex-1 justify-center px-6">
          <SearchBar />
        </div>

        {/* GitHub */}

        <a
          href={`https://github.com/${GITHUB_USER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-sm transition hover:border-green-500 hover:bg-green-500/10"
        >
          <GithubIcon className="h-4 w-4" />
          GitHub
        </a>

        {/* Mobile */}

        <button className="ml-auto rounded-lg border border-violet-500/25 bg-violet-500/10 p-2 md:hidden">
          <Menu className="h-5 w-5" />
        </button>

      </div>
    </header>
  );
}
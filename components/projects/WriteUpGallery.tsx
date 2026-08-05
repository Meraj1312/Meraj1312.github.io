"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { RepoItem } from "@/lib/github";
import { getWriteupMeta } from "@/lib/writeups";

interface Props {
  repo: string;
  items: RepoItem[];
}

export default function WriteUpGallery({
  repo,
  items,
}: Props) {
  const [selectedOS, setSelectedOS] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState("All");

  const writeups = useMemo(() => {
    return items
      .filter(
        (item) =>
          item.type === "file" &&
          item.name.toLowerCase().endsWith(".md")
      )
      .filter((item) => {
        const slug = item.name.replace(".md", "").toLowerCase();
        const meta = getWriteupMeta(slug);

        const osMatch =
          selectedOS === "All" || meta.os === selectedOS;

        const difficultyMatch =
          selectedDifficulty === "All" ||
          meta.difficulty === selectedDifficulty;

        return osMatch && difficultyMatch;
      });
  }, [items, selectedOS, selectedDifficulty]);

  return (
    <section>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white">
          Write-Up Collection
        </h2>

        <p className="mt-2 text-zinc-400">
          HackTheBox, Proving Grounds, Active Directory,
          Windows, Linux, Web Application and research
          write-ups.
        </p>
      </div>

      {/* Filters */}

      <div className="mb-10 space-y-5">
        <div className="flex flex-wrap gap-3">
          {["All", "Windows", "Linux", "FreeBSD", "Solaris"].map((os) => (
            <button
              key={os}
              onClick={() => setSelectedOS(os)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedOS === os
                  ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,.45)]"
                  : "border border-violet-500/20 bg-black/40 text-zinc-300 hover:border-violet-500/50 hover:text-white"
              }`}
            >
              {os}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          {["All", "Easy", "Medium", "Hard", "Insane"].map((difficulty) => (
            <button
              key={difficulty}
              onClick={() => setSelectedDifficulty(difficulty)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedDifficulty === difficulty
                  ? "bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,.45)]"
                  : "border border-green-500/20 bg-black/40 text-zinc-300 hover:border-green-500/50 hover:text-white"
              }`}
            >
              {difficulty}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {writeups.map((item) => {
          const slug = item.name.replace(".md", "").toLowerCase();
          const meta = getWriteupMeta(slug);

          return (
            <Link
              key={item.path}
              href={`/repos/${repo}/${item.path}`}
              className="
                group
                overflow-hidden
                rounded-3xl
                border
                border-violet-500/15
                bg-black/40
                backdrop-blur-xl
                transition-all
                duration-300
                hover:-translate-y-2
                hover:border-violet-500/40
                hover:shadow-[0_0_40px_rgba(139,92,246,.25)]
              "
            >
              {/* Cover Image */}

              <div className="relative h-56 overflow-hidden bg-black">
                <img
                  src={`/images/writeups/${slug}.png`}
                  alt={slug}
                  className="
                    h-full
                    w-full
                    object-contain
                    object-center
                    p-4
                  "
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="rounded-full border border-violet-500/30 bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
                    {meta.os}
                  </span>

                  <span className="rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                    {meta.difficulty}
                  </span>
                </div>
              </div>

              {/* Content */}

              <div className="p-6">
                <h3 className="text-2xl font-bold text-white">
                  {slug.replace(/\b\w/g, (c) => c.toUpperCase())}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  Click to read the full penetration testing
                  write-up.
                </p>

                <div className="mt-6 flex items-center gap-2 font-semibold text-violet-300">
                  Read Write-up

                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
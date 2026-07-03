import Link from "next/link";
import {
  ArrowUpRight,
  Circle,
  GitFork,
  Star,
  Clock3,
} from "lucide-react";

import { type Repo, langColor, timeAgo } from "@/lib/github";

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Link
      href={`/repos/${repo.name}`}
      className="
        group
        relative
        isolate
        overflow-hidden
        rounded-3xl

        border
        border-white/10

        bg-white/[0.04]
        backdrop-blur-2xl

        p-6

        transition-all
        duration-500

        hover:-translate-y-2
        hover:scale-[1.02]

        hover:border-green-400/40

        hover:shadow-[0_0_30px_rgba(34,197,94,.18),0_0_80px_rgba(34,197,94,.08)]
      "
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/10 opacity-0 transition duration-500 group-hover:opacity-100" />

      {/* Top Glow */}
      <div
        className="
          absolute
          top-0
          right-0
          h-40
          w-40
          rounded-full
          bg-green-500/10
          blur-2xl
          opacity-0
          transition
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Bottom Glow */}
      <div
        className="
          absolute
          bottom-0
          left-0
          h-40
          w-40
          rounded-full
          bg-green-400/8
          blur-2xl
          opacity-0
          transition
          duration-500
          group-hover:opacity-100
        "
      />
      {/* Shine */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        <div
          className="
            absolute
            -left-full
            top-0
            h-full
            w-1/2
            rotate-12
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
            transition-all
            duration-1000
            group-hover:left-[140%]
          "
        />
      </div>

      <div className="relative z-10">

        {/* Header */}

        <div className="flex items-start justify-between">

          <div>

            <h2 className="text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-green-400">
              {repo.name}
            </h2>

            <p className="mt-3 min-h-[52px] text-sm leading-6 text-muted-foreground">
              {repo.description ??
                "Security project synchronized from GitHub."}
            </p>

          </div>

          <ArrowUpRight
            className="
              h-5
              w-5
              text-muted-foreground
              transition-all
              duration-300
              group-hover:-translate-y-1
              group-hover:translate-x-1
              group-hover:text-green-400
            "
          />

        </div>

        {/* Topics */}

        {repo.topics?.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {repo.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.04]
                  px-3
                  py-1
                  text-xs
                  text-green-300
                  transition-all
                  duration-300
                  group-hover:border-green-400/30
                  group-hover:bg-green-500/10
                "
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}

        <div className="mt-8 flex flex-wrap items-center gap-5 border-t border-white/10 pt-5 text-sm">

          {repo.language && (
            <div className="flex items-center gap-2">

              <Circle
                className="h-3 w-3 fill-current"
                style={{
                  color: langColor(repo.language),
                }}
              />

              <span>{repo.language}</span>

            </div>
          )}

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-4 w-4" />
            {repo.stargazers_count}
          </div>

          <div className="flex items-center gap-1.5 text-muted-foreground">
            <GitFork className="h-4 w-4" />
            {repo.forks_count}
          </div>

          <div className="ml-auto flex items-center gap-1.5 text-muted-foreground">
            <Clock3 className="h-4 w-4" />
            {timeAgo(repo.pushed_at)}
          </div>

        </div>

      </div>
    </Link>
  );
}
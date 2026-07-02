import Link from "next/link"
import { Star, GitFork, ArrowUpRight, Circle } from "lucide-react"
import { type Repo, langColor, timeAgo } from "@/lib/github"

export function RepoCard({ repo }: { repo: Repo }) {
  return (
    <Link
      href={`/repos/${repo.name}`}
      className="group relative flex flex-col rounded-md border border-border bg-card/60 p-5 transition-all hover:border-primary/60 hover:bg-card hover:box-glow"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-bold text-foreground transition-colors group-hover:text-primary">
          <span className="text-primary/60">~/</span>
          {repo.name}
        </h2>
        <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>

      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
        {repo.description ?? "No description provided."}
      </p>

      {repo.topics?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {repo.topics.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-sm border border-border px-1.5 py-0.5 text-[11px] text-accent"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <Circle
              className="h-2.5 w-2.5"
              style={{ color: langColor(repo.language), fill: langColor(repo.language) }}
            />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5" />
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <GitFork className="h-3.5 w-3.5" />
          {repo.forks_count}
        </span>
        <span className="ml-auto">updated {timeAgo(repo.pushed_at)}</span>
      </div>
    </Link>
  )
}

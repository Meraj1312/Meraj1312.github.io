import { notFound } from "next/navigation"
import Link from "next/link"
import type { Metadata } from "next"
import {
  Star,
  GitFork,
  Eye,
  CircleAlert,
  ExternalLink,
  ArrowLeft,
  GitCommit,
  Scale,
  Clock,
} from "lucide-react"
import {
  getRepo,
  getReadme,
  getLanguages,
  getRecentCommits,
  REPO_NAMES,
  timeAgo,
} from "@/lib/github"
import { CyberNav } from "@/components/cyber-nav"
import { Markdown } from "@/components/markdown"
import { LanguageBar } from "@/components/language-bar"

export const revalidate = 1800

export function generateStaticParams() {
  return REPO_NAMES.map((name) => ({ name }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const repo = await getRepo(name)
  if (!repo) return { title: "Repo not found" }
  return {
    title: `${repo.name} · Meraj1312`,
    description: repo.description ?? undefined,
  }
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Star
  label: string
  value: number | string
}) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-2">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-sm font-bold text-foreground">{value}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}

export default async function RepoPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const repo = await getRepo(name)
  if (!repo) notFound()

  const [readme, languages, commits] = await Promise.all([
    getReadme(name),
    getLanguages(name),
    getRecentCommits(name, repo.default_branch),
  ])

  return (
    <div className="scanlines min-h-screen">
      <CyberNav />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          cd ..
        </Link>

        <div className="cyber-grid rounded-md border border-border bg-card/40 p-6 box-glow">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">
                <span className="text-primary/60">~/</span>
                <span className="text-glow text-primary">{repo.name}</span>
              </h1>
              {repo.description && (
                <p className="mt-2 max-w-2xl text-pretty text-muted-foreground">
                  {repo.description}
                </p>
              )}
            </div>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-sm border border-primary/50 bg-primary/10 px-3 py-2 text-sm text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ExternalLink className="h-4 w-4" />
              View on GitHub
            </a>
          </div>

          {repo.topics?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {repo.topics.map((t) => (
                <span
                  key={t}
                  className="rounded-sm border border-border px-2 py-0.5 text-xs text-accent"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <Stat icon={Star} label="stars" value={repo.stargazers_count} />
            <Stat icon={GitFork} label="forks" value={repo.forks_count} />
            <Stat icon={Eye} label="watching" value={repo.watchers_count} />
            <Stat icon={CircleAlert} label="issues" value={repo.open_issues_count} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              pushed {timeAgo(repo.pushed_at)}
            </span>
            {repo.license && (
              <span className="flex items-center gap-1.5">
                <Scale className="h-3.5 w-3.5" />
                {repo.license.name}
              </span>
            )}
            <span>default branch: {repo.default_branch}</span>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_260px]">
          <div className="order-2 lg:order-1">
            <div className="mb-3 flex items-center gap-2 text-sm text-primary">
              <span className="text-muted-foreground">$</span> cat README.md
            </div>
            <div className="rounded-md border border-border bg-card/40 p-6">
              {readme ? (
                <Markdown content={readme} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  No README found for this repository.
                </p>
              )}
            </div>
          </div>

          <aside className="order-1 space-y-6 lg:order-2">
            {Object.keys(languages).length > 0 && (
              <div className="rounded-md border border-border bg-card/40 p-4">
                <h3 className="mb-3 text-sm font-bold text-primary">Languages</h3>
                <LanguageBar languages={languages} />
              </div>
            )}

            {commits.length > 0 && (
              <div className="rounded-md border border-border bg-card/40 p-4">
                <h3 className="mb-3 flex items-center gap-1.5 text-sm font-bold text-primary">
                  <GitCommit className="h-4 w-4" />
                  Recent commits
                </h3>
                <ul className="space-y-3">
                  {commits.map((c) => (
                    <li key={c.sha} className="text-xs">
                      <a
                        href={c.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-foreground transition-colors hover:text-primary"
                      >
                        <span className="line-clamp-2">
                          {c.commit.message.split("\n")[0]}
                        </span>
                        <span className="mt-0.5 block text-muted-foreground">
                          {c.sha.slice(0, 7)}
                          {c.commit.author?.date &&
                            ` · ${timeAgo(c.commit.author.date)}`}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </main>
    </div>
  )
}

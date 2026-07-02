import { getAllRepos } from "@/lib/github"
import { CyberNav } from "@/components/cyber-nav"
import { Hero } from "@/components/hero"
import { RepoCard } from "@/components/repo-card"

export const revalidate = 1800

export default async function HomePage() {
  const repos = await getAllRepos()
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0)

  return (
    <div className="scanlines min-h-screen">
      <CyberNav />
      <main>
        <Hero repoCount={repos.length} totalStars={totalStars} />

        <section className="mx-auto max-w-6xl px-4 py-12">
          <div className="mb-6 flex items-center gap-3">
            <h2 className="text-lg font-bold text-primary">
              <span className="text-muted-foreground">const</span> repositories{" "}
              <span className="text-muted-foreground">=</span> [
            </h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          {repos.length === 0 ? (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-6 text-center text-sm text-muted-foreground">
              <p className="text-destructive">! Unable to reach GitHub API.</p>
              <p className="mt-1">
                This is usually a rate limit. Add a GITHUB_TOKEN environment
                variable and refresh.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => (
                <RepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          )}

          <p className="mt-6 text-lg font-bold text-primary">]</p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted-foreground">
          <span className="text-primary">$</span> echo &quot;built with next.js ·
          synced with github · {new Date().getFullYear()}&quot;
        </div>
      </footer>
    </div>
  )
}

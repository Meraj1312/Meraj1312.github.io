import { Hero } from "@/components/hero";
import { CyberNav } from "@/components/cyber-nav";
import { RepoCard } from "@/components/repo-card";
import { getProjects } from "@/lib/github";

export const revalidate = 1800;

export default async function HomePage() {
  const repos = await getProjects();

  const totalStars = repos.reduce(
    (sum, repo) => sum + repo.stargazers_count,
    0
  );

  return (
    <div className="relative min-h-screen">
      <CyberNav />

      <main>
        <Hero
          repoCount={repos.length}
          totalStars={totalStars}
        />

        <section
          id="repositories"
          className="mx-auto max-w-7xl px-6 py-24"
        >
          <div className="mb-14">
            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              Projects
            </span>

            <h2 className="mt-5 text-5xl font-black">
              Featured Projects
            </h2>

            <p className="mt-5 max-w-2xl leading-8 text-zinc-400">
              Offensive security tools, research projects, exploit labs and
              security engineering work. Every project is synchronized directly
              from GitHub and updates automatically whenever new commits are
              pushed.
            </p>
          </div>

          {repos.length === 0 ? (
            <div className="rounded-3xl border border-green-500/10 bg-black/30 p-12 text-center backdrop-blur-xl">
              <h3 className="text-2xl font-bold">
                Unable to load projects
              </h3>

              <p className="mt-3 text-zinc-400">
                GitHub API rate limit reached or the repositories are
                temporarily unavailable.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
              {repos.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-green-500/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8">
          <div>
            <p className="font-semibold">
              Mohammad Meraj Khan
            </p>

            <p className="mt-1 text-sm text-zinc-500">
              Offensive Security • Penetration Testing • Security Research
            </p>
          </div>

          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}
import { RepoCard } from "@/components/repo-card";
import { getProjects } from "@/lib/github";

export async function ProjectGrid() {
  const repos = await getProjects();

  if (repos.length === 0) {
    return (
      <div className="rounded-3xl border border-green-500/10 bg-black/30 p-12 text-center backdrop-blur-xl">
        <h3 className="text-2xl font-bold">
          Unable to load projects
        </h3>

        <p className="mt-3 text-zinc-400">
          GitHub API rate limit reached or the repositories are temporarily
          unavailable.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-2">
      {repos.map((repo) => (
        <RepoCard
          key={repo.id}
          repo={repo}
        />
      ))}
    </div>
  );
}
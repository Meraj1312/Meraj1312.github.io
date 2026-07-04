import { notFound } from "next/navigation";
import {
  getRepo,
  getRepoContents,
} from "@/lib/github";
import RepoExplorer from "@/components/projects/RepoExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Props {
  params: Promise<{
    repo: string;
  }>;
}

export default async function RepoPage({
  params,
}: Props) {
  const { repo } = await params;

  const repository = await getRepo(repo);

  if (!repository) notFound();

  const items = await getRepoContents(repo);

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <Breadcrumbs section="Projects" repo={repo} />

      <div className="mb-10">

        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Project
        </span>

        <h1 className="mt-5 text-5xl font-black">
          {repository.name}
        </h1>

        <p className="mt-5 max-w-3xl text-zinc-400">
          {repository.description}
        </p>

      </div>

      <RepoExplorer
        repo={repo}
        items={items}
        currentPath=""
      />

    </main>
  );
}
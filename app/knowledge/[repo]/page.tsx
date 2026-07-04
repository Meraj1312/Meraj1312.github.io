import { notFound } from "next/navigation";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import RepoExplorer from "@/components/docs/RepoExplorer";
import { KNOWLEDGE_REPOS } from "@/lib/github";

interface Props {
  params: Promise<{
    repo: string;
  }>;
}

export default async function RepoPage({
  params,
}: Props) {
  const { repo } = await params;

  if (!KNOWLEDGE_REPOS.includes(repo as any)) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <Breadcrumbs repo={repo} />

      <div className="mb-10">
        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Repository
        </span>

        <h1 className="mt-5 text-5xl font-black text-white">
          {repo.replaceAll("-", " ")}
        </h1>

        <div className="mt-4">
          <Link
            href={`/knowledge/${repo}`}
            className="inline-flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-4 py-2 text-sm text-green-400 transition hover:border-green-500/40 hover:bg-green-500/20"
          >
            📁 {repo}
          </Link>
        </div>

        <p className="mt-6 max-w-3xl leading-8 text-zinc-400">
          Browse every Markdown document available in this repository.
        </p>
      </div>

      <RepoExplorer repo={repo} />
    </main>
  );
}
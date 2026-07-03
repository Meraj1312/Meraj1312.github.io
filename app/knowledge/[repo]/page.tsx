import { notFound } from "next/navigation";
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
    <main className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-14">
        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Repository
        </span>

        <h1 className="mt-5 text-5xl font-black">
          {repo.replaceAll("-", " ")}
        </h1>

        <p className="mt-5 max-w-3xl leading-8 text-zinc-400">
          Every Markdown document in this repository is listed automatically.
        </p>
      </div>

      <RepoExplorer repo={repo} />
    </main>
  );
}
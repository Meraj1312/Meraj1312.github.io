import DocCard from "./DocCard";
import { getMarkdownFiles } from "@/lib/github-docs";

interface Props {
  repo: string;
}

export default async function RepoExplorer({ repo }: Props) {
  const files = await getMarkdownFiles(repo);

  if (files.length === 0) {
    return (
      <div className="rounded-2xl border border-red-500/20 p-8">
        <h2 className="text-2xl font-bold">
          No Markdown files found
        </h2>

        <p className="mt-3 text-zinc-400">
          This repository doesn't contain any Markdown files.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {files.map((file) => (
        <DocCard
          key={file.path}
          repo={repo}
          filename={file.name}
        />
      ))}
    </div>
  );
}
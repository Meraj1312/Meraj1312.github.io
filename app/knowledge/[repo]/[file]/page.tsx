import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import { getMarkdownContent } from "@/lib/github-docs";
import { KNOWLEDGE_REPOS } from "@/lib/github";
import Sidebar from "@/components/docs/Sidebar";

interface Props {
  params: Promise<{
    repo: string;
    file: string;
  }>;
}

export default async function DocPage({
  params,
}: Props) {
  const { repo, file } = await params;

  if (!KNOWLEDGE_REPOS.includes(repo as any)) {
    notFound();
  }

  const filename =
    decodeURIComponent(file).toLowerCase() === "readme"
      ? "README.md"
      : `${decodeURIComponent(file)}.md`;

  const markdown = await getMarkdownContent(
    repo,
    filename
  );

  if (!markdown) {
    notFound();
  }

return (
  <main className="mx-auto max-w-7xl px-6 py-20">
    <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
      <Sidebar
        repo={repo}
        currentFile={filename.replace(".md", "")}
      />

      <article>
        <div className="mb-10">
          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            Documentation
          </span>

          <h1 className="mt-5 text-5xl font-black">
            {filename.replace(".md", "")}
          </h1>

          <p className="mt-3 text-zinc-400">
            Repository: {repo}
          </p>
        </div>

        <Markdown content={markdown} />
      </article>
    </div>
  </main>
);
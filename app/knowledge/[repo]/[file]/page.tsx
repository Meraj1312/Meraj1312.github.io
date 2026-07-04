import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sidebar from "@/components/docs/Sidebar";
import { getMarkdownContent } from "@/lib/github-docs";
import { KNOWLEDGE_REPOS } from "@/lib/github";

interface Props {
  params: Promise<{
    repo: string;
    file: string;
  }>;
}

export default async function DocPage({ params }: Props) {
  const { repo, file } = await params;

  if (!KNOWLEDGE_REPOS.includes(repo as any)) {
    notFound();
  }

  const filename =
    decodeURIComponent(file).toLowerCase() === "readme"
      ? "README.md"
      : `${decodeURIComponent(file)}.md`;

  const markdown = await getMarkdownContent(repo, filename);

  if (!markdown) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <Breadcrumbs
        repo={repo}
        file={filename.replace(".md", "")}
      />

      <div className="grid gap-12 lg:grid-cols-[280px_1fr]">
        <Sidebar
          repo={repo}
          currentFile={filename.replace(".md", "")}
        />

        <article className="min-w-0">
          <div className="mb-10">
            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              Documentation
            </span>

            <h1 className="mt-5 text-5xl font-black text-white">
              {filename.replace(".md", "")}
            </h1>

            <p className="mt-3 text-zinc-400">
              Repository: {repo}
            </p>
          </div>

          <div
            className="
              rounded-3xl
              border
              border-green-500/10
              bg-black/30
              p-8
              backdrop-blur-xl
              shadow-[0_0_40px_rgba(34,197,94,.08)]
            "
          >
            <Markdown content={markdown} />
          </div>
        </article>
      </div>
    </main>
  );
}
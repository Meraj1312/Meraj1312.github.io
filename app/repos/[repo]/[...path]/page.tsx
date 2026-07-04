import { notFound } from "next/navigation";
import Markdown from "@/components/markdown";
import CodeBlock from "@/components/CodeBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
import RepoExplorer from "@/components/projects/RepoExplorer";

import {
  getFileContent,
  getRepoContents,
} from "@/lib/github";

interface Props {
  params: Promise<{
    repo: string;
    path: string[];
  }>;
}

export default async function FilePage({
  params,
}: Props) {
  const { repo, path } = await params;

  const fullPath = path.join("/");

  const content = await getFileContent(
    repo,
    fullPath
  );

  if (!content) {
    notFound();
  }

  const extension =
    fullPath.split(".").pop()?.toLowerCase() ?? "";

  // Parent directory
  const parent =
    path.length > 1
      ? path.slice(0, -1).join("/")
      : "";

  const items = await getRepoContents(
    repo,
    parent
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">

      <Breadcrumbs
        section="Projects"
        repo={repo}
        file={fullPath}
      />

      <div className="grid gap-12 lg:grid-cols-[300px_1fr]">

        <RepoExplorer
          repo={repo}
          items={items}
          currentPath={fullPath}
        />

        <article>

          <div className="mb-10">

            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              {extension.toUpperCase()} File
            </span>

            <h1 className="mt-5 text-4xl font-black">
              {path[path.length - 1]}
            </h1>

            <p className="mt-3 text-zinc-400">
              {fullPath}
            </p>

          </div>

          <div
            className="
              rounded-3xl
              border
              border-green-500/10
              bg-black/30
              p-10
              backdrop-blur-xl
            "
          >
            {extension === "md" ? (
              <Markdown content={content} />
            ) : (
              <CodeBlock
                language={extension || "text"}
                code={content}
              />
            )}
          </div>

        </article>

      </div>

    </main>
  );
}
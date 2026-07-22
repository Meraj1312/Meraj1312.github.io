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

      <div className="flex justify-center">
        <div className="grid w-full max-w-[1700px] gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">

          <aside className="sticky top-24 h-fit">
            <RepoExplorer
              repo={repo}
              items={items}
              currentPath={fullPath}
            />
          </aside>

          <article className="mx-auto w-full max-w-5xl min-w-0">

            <div className="mb-10">

              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                {extension.toUpperCase()} File
              </span>

              <h1 className="mt-5 text-5xl font-black">
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
                border-violet-500/10
                bg-black/30
                p-10
                backdrop-blur-xl
                shadow-[0_0_60px_rgba(139,92,246,.10)]
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
      </div>

    </main>
  );
}
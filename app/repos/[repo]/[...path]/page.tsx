
import { notFound } from "next/navigation";
import { readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";

import Markdown from "@/components/markdown";
import CodeBlock from "@/components/CodeBlock";
import Breadcrumbs from "@/components/Breadcrumbs";
import RepoExplorer from "@/components/projects/RepoExplorer";
import MarkdownToc from "@/components/projects/MarkdownToc";

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

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export default async function FilePage({ params }: Props) {
  const { repo, path } = await params;

  const decodedRepo = decodeSegment(repo);
  const decodedPath = path.map(decodeSegment);

  const fullPath = decodedPath.join("/");
  const fileName = decodedPath[decodedPath.length - 1] ?? "";

  const displayTitle = fileName.replace(/\.md$/i, "");

  const isICSRepo = decodedRepo === "ICS-Challenges";

  let content: string | null = null;

  if (isICSRepo) {
    const contentRoot = resolve(
      process.cwd(),
      "content",
      "ics-challenges"
    );

    const filePath = resolve(contentRoot, ...decodedPath);

    // Prevent paths from escaping the ICS content directory.
    if (
      filePath !== contentRoot &&
      !filePath.startsWith(`${contentRoot}${sep}`)
    ) {
      notFound();
    }

    try {
      content = await readFile(filePath, "utf-8");
    } catch {
      notFound();
    }
  } else {
    content = await getFileContent(decodedRepo, fullPath);
  }

  if (!content) {
    notFound();
  }

  const extension =
    fileName.split(".").pop()?.toLowerCase() ?? "";

  const parent =
    decodedPath.length > 1
      ? decodedPath.slice(0, -1).join("/")
      : "";

  const items = isICSRepo
    ? []
    : await getRepoContents(decodedRepo, parent);

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <Breadcrumbs
        section="Projects"
        repo={decodedRepo}
        file={fullPath}
      />

      <div className="flex justify-center">
        <div className="grid w-full max-w-[1700px] gap-10 lg:grid-cols-[260px_minmax(0,1fr)]">

          <aside className="sticky top-24 h-fit">
            {extension === "md" ? (
              <MarkdownToc content={content} />
            ) : (
              <RepoExplorer
                repo={decodedRepo}
                items={items}
                currentPath={fullPath}
              />
            )}
          </aside>

          <article className="mx-auto w-full max-w-5xl min-w-0">

            <div className="mb-10">
              <span className="rounded-full border border-violet-500/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
                {extension.toUpperCase()} File
              </span>

              <h1 className="mt-5 text-5xl font-black">
                {displayTitle}
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

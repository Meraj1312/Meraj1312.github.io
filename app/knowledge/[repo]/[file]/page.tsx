import { notFound } from "next/navigation";
import { KNOWLEDGE_REPOS } from "@/lib/github";
import { Markdown } from "@/components/markdown";

interface Props {
  params: Promise<{
    repo: string;
    file: string;
  }>;
}

async function getMarkdown(repo: string, file: string) {
  const filename =
    file.toLowerCase() === "readme"
      ? "README.md"
      : `${decodeURIComponent(file)}.md`;

  const res = await fetch(
    `https://raw.githubusercontent.com/Meraj1312/${repo}/main/${filename}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return null;
  }

  return await res.text();
}

export async function generateStaticParams() {
  return KNOWLEDGE_REPOS.map((repo) => ({
    repo,
    file: "README",
  }));
}

export default async function MarkdownPage({
  params,
}: Props) {
  const { repo, file } = await params;

  if (!KNOWLEDGE_REPOS.includes(repo as any)) {
    notFound();
  }

  const markdown = await getMarkdown(repo, file);

  if (!markdown) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-10">
        <h1 className="text-5xl font-black">
          {decodeURIComponent(file)}
        </h1>

        <p className="mt-3 text-zinc-400">
          {repo.replaceAll("-", " ")}
        </p>
      </div>

      <Markdown content={markdown} />
    </main>
  );
}
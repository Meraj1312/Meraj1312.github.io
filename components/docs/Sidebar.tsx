import Link from "next/link";
import { getMarkdownFiles } from "@/lib/github-docs";

interface Props {
  repo: string;
  currentFile: string;
}

export default async function Sidebar({
  repo,
  currentFile,
}: Props) {
  const files = await getMarkdownFiles(repo);

  return (
    <aside className="sticky top-24 h-fit rounded-2xl border border-green-500/10 bg-black/30 p-6">
      <h2 className="mb-6 text-lg font-bold">
        {repo.replaceAll("-", " ")}
      </h2>

      <nav className="space-y-2">
        {files.map((file) => {
          const slug = file.name.replace(/\.md$/i, "");

          const active =
            slug.toLowerCase() === currentFile.toLowerCase();

          return (
            <Link
              key={file.path}
              href={`/knowledge/${repo}/${encodeURIComponent(slug)}`}
              className={`
                block
                rounded-lg
                px-3
                py-2
                transition
                ${
                  active
                    ? "bg-green-500/20 text-green-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }
              `}
            >
              {slug}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
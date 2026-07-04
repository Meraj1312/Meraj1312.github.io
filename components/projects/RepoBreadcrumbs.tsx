import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Props {
  repo: string;
  path?: string;
}

export default function RepoBreadcrumbs({
  repo,
  path = "",
}: Props) {
  const parts = path
    ? path.split("/").filter(Boolean)
    : [];

  return (
    <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
      <Link
        href="/"
        className="flex items-center gap-2 text-zinc-400 transition hover:text-green-400"
      >
        <Home className="h-4 w-4" />
      </Link>

      <ChevronRight className="h-4 w-4 text-zinc-600" />

      <Link
        href="/#repositories"
        className="text-zinc-400 transition hover:text-green-400"
      >
        Projects
      </Link>

      <ChevronRight className="h-4 w-4 text-zinc-600" />

      <Link
        href={`/repos/${repo}`}
        className="font-medium text-green-400"
      >
        {repo}
      </Link>

      {parts.map((part, index) => {
        const currentPath = parts
          .slice(0, index + 1)
          .join("/");

        return (
          <div
            key={currentPath}
            className="flex items-center gap-2"
          >
            <ChevronRight className="h-4 w-4 text-zinc-600" />

            <Link
              href={`/repos/${repo}?path=${encodeURIComponent(
                currentPath
              )}`}
              className="text-zinc-400 transition hover:text-green-400"
            >
              {part}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
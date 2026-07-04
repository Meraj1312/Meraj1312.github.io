import Link from "next/link";
import FileIcon from "./FileIcon";
import { RepoItem } from "@/lib/github";
import { ChevronRight } from "lucide-react";

interface Props {
  repo: string;
  items: RepoItem[];
  currentPath?: string;
}

export default function RepoExplorer({
  repo,
  items,
  currentPath = "",
}: Props) {
  return (
    <aside
      className="
        overflow-hidden
        rounded-3xl
        border
        border-green-500/10
        bg-black/30
        backdrop-blur-xl
      "
    >
      <div className="border-b border-green-500/10 px-5 py-4">
        <h2 className="font-semibold text-green-400">
          Project Explorer
        </h2>

        <p className="mt-1 text-xs text-zinc-500">
          {repo}
        </p>
      </div>

      <div className="max-h-[70vh] overflow-y-auto">

        {items.map((item) => {
          const href =
            item.type === "dir"
              ? `/repos/${repo}?path=${encodeURIComponent(item.path)}`
              : `/repos/${repo}/${item.path}`;

          const active = currentPath === item.path;

          return (
            <Link
              key={item.path}
              href={href}
              className={`
                flex
                items-center
                gap-3
                border-b
                border-green-500/10
                px-5
                py-3
                transition-all
                duration-200

                ${
                  active
                    ? "bg-green-500/10 text-green-300"
                    : "hover:bg-green-500/5 text-zinc-300"
                }
              `}
            >
              <FileIcon
                name={item.name}
                type={item.type}
              />

              <span className="flex-1 truncate">
                {item.name}
              </span>

              {item.type === "dir" && (
                <ChevronRight className="h-4 w-4 opacity-40" />
              )}
            </Link>
          );
        })}

      </div>
    </aside>
  );
}
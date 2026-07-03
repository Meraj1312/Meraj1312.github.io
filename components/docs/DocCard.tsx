import Link from "next/link";

interface Props {
  repo: string;
  filename: string;
}

export default function DocCard({
  repo,
  filename,
}: Props) {
  const slug = filename.replace(/\.md$/i, "");

  return (
    <Link
      href={`/knowledge/${repo}/${encodeURIComponent(slug)}`}
      className="
      rounded-2xl
      border
      border-green-500/10
      bg-black/30
      p-6
      transition
      hover:border-green-500/30
      hover:-translate-y-1
    "
    >
      <h3 className="text-xl font-bold">
        {slug}
      </h3>

      <p className="mt-3 text-zinc-400">
        Markdown document
      </p>
    </Link>
  );
}
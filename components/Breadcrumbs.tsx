import Link from "next/link";

interface Props {
  section?: "Knowledge" | "Projects";
  repo: string;
  file?: string;
}

export default function Breadcrumbs({
  section = "Knowledge",
  repo,
  file,
}: Props) {
  const base =
    section === "Projects"
      ? "/repos"
      : "/knowledge";

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm">

      <Link
        href="/"
        className="font-medium text-zinc-400 transition hover:text-green-400"
      >
        Home
      </Link>

      <span className="text-zinc-600">&gt;</span>

      <Link
        href={base}
        className="font-medium text-zinc-400 transition hover:text-green-400"
      >
        {section}
      </Link>

      <span className="text-zinc-600">&gt;</span>

      <Link
        href={`${base}/${repo}`}
        className="font-medium text-zinc-400 transition hover:text-green-400"
      >
        {repo}
      </Link>

      {file && (
        <>
          <span className="text-zinc-600">&gt;</span>

          <span className="font-medium text-green-400 break-all">
            {file}
          </span>
        </>
      )}

    </nav>
  );
}
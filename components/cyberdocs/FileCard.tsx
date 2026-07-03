import Link from "next/link"

interface Props {
  repo: string
  file: string
}

export default function FileCard({ repo, file }: Props) {
  const title = file.replace(".md", "")

  return (
    <Link
      href={`/knowledge/${repo}/${encodeURIComponent(title)}`}
      className="
        group
        rounded-2xl
        border
        border-green-500/10
        bg-black/30
        p-6
        transition-all
        hover:border-green-500/30
        hover:-translate-y-1
      "
    >
      <h3 className="text-xl font-bold group-hover:text-green-400">
        {title}
      </h3>

      <p className="mt-2 text-zinc-400">
        Markdown documentation
      </p>
    </Link>
  )
}
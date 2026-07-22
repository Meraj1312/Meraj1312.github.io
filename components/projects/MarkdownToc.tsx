interface Props {
  content: string;
}

type Heading = {
  level: number;
  text: string;
  id: string;
};

function stripMarkdown(text: string): string {
  return text
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
    .replace(/\*([^*]+)\*/g, "$1") // italic
    .replace(/_([^_]+)_/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1") // images
    .replace(/<[^>]*>/g, "") // html
    .trim();
}

function slugify(text: string) {
  return stripMarkdown(text)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—]/g, "-")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function MarkdownToc({ content }: Props) {
  const headings: Heading[] = [];

  let insideCode = false;

  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      insideCode = !insideCode;
      continue;
    }

    if (insideCode) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);

    if (!match) continue;

    const level = match[1].length;
    const text = stripMarkdown(match[2]);

    headings.push({
      level,
      text,
      id: slugify(text),
    });
  }

  return (
    <aside className="overflow-hidden rounded-3xl border border-violet-500/10 bg-black/30 backdrop-blur-xl">
      <div className="border-b border-violet-500/10 px-5 py-4">
        <h2 className="font-semibold text-violet-300">
          On this page
        </h2>
      </div>

      <nav className="max-h-[70vh] overflow-y-auto p-3 space-y-1">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`
              block rounded-lg py-2 text-sm transition
              ${
                heading.level === 1
                  ? "px-3 font-bold text-violet-300 hover:bg-violet-500/10"
                  : heading.level === 2
                  ? "pl-4 pr-3 text-zinc-300 hover:bg-violet-500/10 hover:text-violet-300"
                  : heading.level === 3
                  ? "pl-8 pr-3 text-zinc-400 hover:bg-violet-500/10 hover:text-violet-300"
                  : heading.level === 4
                  ? "pl-12 pr-3 text-zinc-500 hover:bg-violet-500/10 hover:text-violet-300"
                  : heading.level === 5
                  ? "pl-16 pr-3 text-zinc-500 hover:bg-violet-500/10 hover:text-violet-300"
                  : "pl-20 pr-3 text-zinc-600 hover:bg-violet-500/10 hover:text-violet-300"
              }
            `}
          >
            {heading.text}
          </a>
        ))}

        {headings.length === 0 && (
          <p className="px-3 py-2 text-sm text-zinc-500">
            No headings found.
          </p>
        )}
      </nav>
    </aside>
  );
}
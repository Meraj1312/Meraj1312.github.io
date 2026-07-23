import Link from "next/link";
import { RepoItem } from "@/lib/github";
import { ArrowRight } from "lucide-react";

interface Props {
  repo: string;
  items: RepoItem[];
}

export default function WriteUpGallery({
  repo,
  items,
}: Props) {
  const writeups = items.filter(
    (item) =>
      item.type === "file" &&
      item.name.toLowerCase().endsWith(".md")
  );

  return (
    <section>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white">
          Write-Up Collection
        </h2>

        <p className="mt-2 text-zinc-400">
          HackTheBox, Proving Grounds, Active Directory,
          Windows, Linux, Web Application and research
          write-ups.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {writeups.map((item) => (
          <Link
            key={item.path}
            href={`/repos/${repo}/${item.path}`}
            className="
              group
              relative
              overflow-hidden
              rounded-3xl
              border
              border-violet-500/15
              bg-black/40
              backdrop-blur-xl
              transition-all
              duration-300
              hover:-translate-y-2
              hover:border-violet-500/40
              hover:shadow-[0_0_40px_rgba(139,92,246,.25)]
            "
          >
            {/* Cover Image */}
            <div className="relative h-56 overflow-hidden">
            <img
            src={`/images/writeups/${item.name.replace(".md", ".png")}`}
            alt={item.name}
            className="
                absolute
                inset-0
                h-full
                w-full
                object-contain
                object-center
                p-4
                bg-black
            "
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

            <div className="absolute bottom-4 left-4">
                <span className="rounded-full border border-violet-500/30 bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
                WRITE-UP
                </span>
            </div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-white">
                {item.name.replace(".md", "")}
              </h3>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Click to read the full penetration testing
                write-up.
              </p>

              <div className="mt-6 flex items-center gap-2 font-semibold text-violet-300">
                Read Write-up

                <ArrowRight
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-2
                  "
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
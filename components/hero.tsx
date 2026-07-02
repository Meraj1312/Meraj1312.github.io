"use client"

import { useEffect, useState } from "react"
import { GITHUB_USER } from "@/lib/github"

const LINES = [
  "$ whoami",
  `> ${GITHUB_USER} :: penetration tester / security researcher`,
  "$ cat ./focus.txt",
  "> offensive security · SIEM · CVE research · red team tooling",
  "$ ls ./repos --live-sync=github",
]

export function Hero({ repoCount, totalStars }: { repoCount: number; totalStars: number }) {
  const [shown, setShown] = useState<string[]>([])

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(LINES.slice(0, i))
      if (i >= LINES.length) clearInterval(id)
    }, 380)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="cyber-grid absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 px-3 py-1 text-xs text-primary">
          <span className="h-2 w-2 rounded-full bg-primary cursor-blink" />
          SYSTEM ONLINE · SYNCED WITH GITHUB
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-bold leading-tight text-foreground md:text-6xl">
          <span className="text-glow text-primary">Breaking</span> systems,{" "}
          <span className="text-accent">documenting</span> the how.
        </h1>
        <p className="mt-4 max-w-2xl text-pretty text-muted-foreground md:text-lg">
          A live archive of my security research, exploit labs, and tooling. This
          site mirrors my GitHub in real time — new commits and repos show up
          automatically.
        </p>

        <div className="mt-8 box-glow rounded-md border border-border bg-card/70 p-4 font-mono text-sm">
          <div className="mb-3 flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-destructive" />
            <span className="h-3 w-3 rounded-full bg-chart-3" />
            <span className="h-3 w-3 rounded-full bg-primary" />
            <span className="ml-2 text-xs text-muted-foreground">bash — 80x24</span>
          </div>
          <div className="space-y-1">
            {shown.map((line, i) => (
              <div
                key={i}
                className={
                  line.startsWith("$")
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              >
                {line}
              </div>
            ))}
            <span className="text-primary">
              {"$ "}
              <span className="cursor-blink">_</span>
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-6 text-sm">
          <div>
            <div className="text-2xl font-bold text-primary text-glow">{repoCount}</div>
            <div className="text-muted-foreground">repositories</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-primary text-glow">{totalStars}</div>
            <div className="text-muted-foreground">total stars</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-accent">live</div>
            <div className="text-muted-foreground">github sync</div>
          </div>
        </div>
      </div>
    </section>
  )
}

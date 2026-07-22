"use client";

import { GlitchText } from "@/components/glitch-text";
import { Terminal } from "@/components/terminal";
import { ArrowRight, BookOpen } from "lucide-react";
import { GITHUB_USER } from "@/lib/github";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.1 11.1 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .3.2.66.79.55A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
    </svg>
  );
}

export function Hero({
  repoCount,
  totalStars,
}: {
  repoCount: number;
  totalStars: number;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:py-28">

        <div className="grid items-center gap-16 lg:grid-cols-2">

          {/* LEFT */}

          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              AVAILABLE FOR SECURITY WORK
            </div>

            <h1 className="text-6xl font-black leading-none tracking-tight lg:text-8xl">
              <GlitchText className="cyber-glow-white">
                Mohammad
              </GlitchText>

              <br />

              <GlitchText
                gradient
                className="cyber-glow-violet"
              >
                Meraj
              </GlitchText>
            </h1>

            <p className="mt-8 text-2xl font-semibold text-zinc-300">
              Offensive Security Researcher
            </p>

            <p className="mt-6 max-w-xl leading-8 text-zinc-400">
              Building offensive security tools, documenting penetration testing
              methodologies, researching vulnerabilities, and publishing practical
              knowledge for Windows, Linux, Active Directory, and Web Application
              Security.
            </p>

            {/* Skills */}

            <div className="mt-10 flex flex-wrap gap-3">
              {[
                "Windows",
                "Linux",
                "Active Directory",
                "Web Security",
                "Python",
                "Exploit Development",
                "CPTS",
              ].map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300 transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/10 hover:text-violet-200"                >
                  {badge}
                </span>
              ))}
            </div>

            {/* Buttons */}

            <div className="mt-10 flex flex-wrap gap-4">

              <a
                href="#repositories"
                className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-7 py-3 font-semibold text-black transition hover:scale-105"
              >
                Explore Projects
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href="/knowledge"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-semibold text-white transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/10"
              >
                <BookOpen className="h-4 w-4" />
                Knowledge Base
              </a>

              <a
                href={`https://github.com/${GITHUB_USER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 py-3 font-semibold text-white transition-all duration-300 hover:border-violet-500/40 hover:bg-violet-500/10"              >
                <GithubIcon className="h-4 w-4" />
                GitHub
              </a>

            </div>

          </div>

          {/* RIGHT */}

          <div>
            <Terminal />
          </div>

        </div>

        {/* Stats */}

        <div className="mt-20 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-black/30 p-7 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,.18)]">
            <div className="text-5xl font-black text-green-500">
              {repoCount}
            </div>
            <div className="mt-2 text-zinc-400">
              Open Source Projects
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-7 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,.18)]">
            <div className="text-5xl font-black text-green-500">
              {totalStars}
            </div>
            <div className="mt-2 text-zinc-400">
              GitHub Stars
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/30 p-7 backdrop-blur-xl transition-all duration-300 hover:border-violet-500/30 hover:shadow-[0_0_40px_rgba(139,92,246,.18)]">
            <div className="text-5xl font-black text-green-500">
              24/7
            </div>
            <div className="mt-2 text-zinc-400">
              Learning & Research
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
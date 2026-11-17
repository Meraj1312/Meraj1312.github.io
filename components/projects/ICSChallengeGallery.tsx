"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Cpu,
  Globe,
  Monitor,
  Search,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

interface Challenge {
  name: string;
  path: string;
}

interface Props {
  repo: string;
  challenges: Challenge[];
}

const categoryByChallenge: Record<string, string> = {
  "Breach": "Windows / Active Directory",
  "Dressrosa Reactor": "ICS / Hardware",
  "Factory": "ICS / Hardware",
  "Flow Override": "ICS / Hardware",
  "Intrusion": "ICS / Hardware",
  "Knock Knock?": "Forensics",
  "Slippy": "Web",
  "Sneak peek": "ICS / Hardware",
  "State of Emergency": "ICS / Hardware",
  "Steel Mountain": "ICS / Hardware",
  "Watch Tower": "ICS / Hardware",
  "Watersnake": "Web",
};

const imageByChallenge: Record<string, string> = {
  "Breach": "breach.png",
  "Dressrosa Reactor": "dressrosa-reactor.png",
  "Factory": "factory.png",
  "Flow Override": "flow-override.png",
  "Intrusion": "intrusion.png",
  "State of Emergency": "state-of-emergency.png",
  "Steel Mountain": "steel-mountain.png",
  "Knock Knock?": "knock-knock.png",
  "Slippy": "slippy.png",
  "Sneak peek": "sneak-peek.png",
  "Watch Tower": "watch-tower.png",
  "Watersnake": "watersnake.png",
};

const categories = [
  "All",
  "ICS / Hardware",
  "Web",
  "Windows / Active Directory",
  "Forensics",
];

export default function ICSChallengeGallery({
  repo,
  challenges,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredChallenges = useMemo(() => {
    return challenges.filter((challenge) => {
      const category =
        categoryByChallenge[challenge.name] ?? "Other";

      return (
        selectedCategory === "All" ||
        category === selectedCategory
      );
    });
  }, [challenges, selectedCategory]);

  return (
    <section>
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-white">
          ICS Challenge Collection
        </h2>

        <p className="mt-2 text-zinc-400">
          Hands-on challenges covering Industrial Control
          Systems, Operational Technology, industrial
          protocols and related security topics.
        </p>
      </div>

      {/* Category filters */}

      <div className="mb-10 flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              selectedCategory === category
                ? "bg-violet-600 text-white shadow-[0_0_20px_rgba(139,92,246,.45)]"
                : "border border-violet-500/20 bg-black/40 text-zinc-300 hover:border-violet-500/50 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Challenge cards */}

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredChallenges.map((challenge, index) => {
            const category =
              categoryByChallenge[challenge.name] ?? "Other";

            const image = imageByChallenge[challenge.name];

            const Icon =
              category === "Web"
                ? Globe
                : category === "Forensics"
                  ? Search
                  : category === "Windows / Active Directory"
                    ? Monitor
                    : Cpu;

            const encodedPath = challenge.path
              .split("/")
              .map(encodeURIComponent)
              .join("/");

            return (
              <motion.div
                key={challenge.path}
                layout={!reduceMotion}
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: -8 }
                }
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -6, scale: 1.01 }
                }
                whileTap={
                  reduceMotion
                    ? undefined
                    : { scale: 0.99 }
                }
                transition={{
                  duration: reduceMotion ? 0 : 0.28,
                  ease: "easeOut",
                }}
                className="h-full"
              >
                <Link
                  href={`/repos/${repo}/${encodedPath}`}
                  className="
                    group block h-full
                    overflow-hidden
                    rounded-3xl
                    border
                    border-violet-500/15
                    bg-black/40
                    backdrop-blur-xl
                    transition-all
                    duration-300
                    hover:border-violet-500/40
                    hover:shadow-[0_0_40px_rgba(139,92,246,.25)]
                  "
                >
                  {/* Cover image */}

                  <div className="relative h-56 overflow-hidden bg-black">
                    {image ? (
                      <img
                        src={`/images/ics/${image}`}
                        alt={challenge.name}
                        className="
                          h-full
                          w-full
                          object-contain
                          object-center
                          p-4
                          transition-transform
                          duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-950/80 via-black to-green-950/40">
                        <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-6">
                          <Icon className="h-14 w-14 text-violet-300" />
                        </div>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

                    <div className="absolute bottom-4 left-4">
                      <span className="rounded-full border border-violet-500/30 bg-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-200">
                        {category}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}

                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white">
                      {challenge.name}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                      Explore the challenge, investigation
                      process, technical findings and lessons
                      learned.
                    </p>

                    <div className="mt-6 flex items-center gap-2 font-semibold text-violet-300">
                      Read Challenge

                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredChallenges.length === 0 && (
        <p className="py-12 text-center text-zinc-500">
          No challenges found in this category.
        </p>
      )}
    </section>
  );
}

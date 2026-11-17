
import { notFound } from "next/navigation";
import {
  getRepo,
  getRepoContents,
} from "@/lib/github";

import RepoExplorer from "@/components/projects/RepoExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";
import WriteUpGallery from "@/components/projects/WriteUpGallery";
import ICSChallengeGallery from "@/components/projects/ICSChallengeGallery";
import ICSVideoBackground from "@/components/projects/ICSVideoBackground";

interface Props {
  params: Promise<{
    repo: string;
  }>;
}

const icsChallenges = [
  { name: "Breach", path: "Breach/Breach.md" },
  { name: "Dressrosa Reactor", path: "Dressrosa Reactor/Dressrosa Reactor.md" },
  { name: "Factory", path: "Factory/Factory.md" },
  { name: "Flow Override", path: "Flow Override/Flow Override.md" },
  { name: "Intrusion", path: "Intrusion/Intrusion.md" },
  { name: "Knock Knock?", path: "Knock Knock?/Knock Knock?.md" },
  { name: "Slippy", path: "Slippy/Slippy.md" },
  { name: "Sneak peek", path: "Sneak peek/Sneak peek.md" },
  { name: "State of Emergency", path: "State of Emergency/State of Emergency.md" },
  { name: "Steel Mountain", path: "Steel Mountain/Steel Mountain.md" },
  { name: "Watch Tower", path: "Watch Tower/Watch Tower.md" },
  { name: "Watersnake", path: "Watersnake/Watersnake.md" },
];

function PageBackground({
  videoSrc = "/videos/write-up-background.mp4",
}: {
  videoSrc?: string;
}) {
  return (
    <>
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className={`h-full w-full object-cover scale-110 ${
            videoSrc.includes("ICS-background") ? "opacity-50" : "opacity-35"
          }`}
        >
          <source
            src={videoSrc}
            type="video/mp4"
          />
        </video>
      </div>

      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-black via-black/55 to-violet-950/30 backdrop-blur-[3px]" />
    </>
  );
}

export default async function RepoPage({ params }: Props) {
  const { repo } = await params;

  // ICS gallery uses a local challenge list.
  // It does not need GitHub API access to display the cards.
  if (repo === "ICS-Challenges") {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <ICSVideoBackground />

        <main className="relative z-10 mx-auto max-w-7xl px-6 py-20">
          <Breadcrumbs section="Projects" repo={repo} />

          <div className="mb-10">
            <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
              ICS / OT Security
            </span>

            <h1 className="mt-5 text-5xl font-black">
              ICS-Challenges
            </h1>

            <p className="mt-5 max-w-3xl text-zinc-400">
              Hands-on Industrial Control Systems and Operational
              Technology security challenges, investigations and
              technical write-ups.
            </p>
          </div>

          <ICSChallengeGallery
            repo={repo}
            challenges={icsChallenges}
          />
        </main>
      </div>
    );
  }

  // Existing GitHub-backed repository pages remain unchanged.
  const repository = await getRepo(repo);

  if (!repository) notFound();

  const items = await getRepoContents(repo);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <PageBackground />

      <main className="relative z-10 mx-auto max-w-7xl px-6 py-20">
        <Breadcrumbs section="Projects" repo={repo} />

        <div className="mb-10">
          <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
            Project
          </span>

          <h1 className="mt-5 text-5xl font-black">
            {repository.name}
          </h1>

          <p className="mt-5 max-w-3xl text-zinc-400">
            {repository.description}
          </p>
        </div>

        {repo === "Write-Ups" ? (
          <WriteUpGallery
            repo={repo}
            items={items}
          />
        ) : (
          <RepoExplorer
            repo={repo}
            items={items}
            currentPath=""
          />
        )}
      </main>
    </div>
  );
}

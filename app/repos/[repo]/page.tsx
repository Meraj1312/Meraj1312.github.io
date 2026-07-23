import { notFound } from "next/navigation";
import {
  getRepo,
  getRepoContents,
} from "@/lib/github";

import RepoExplorer from "@/components/projects/RepoExplorer";
import Breadcrumbs from "@/components/Breadcrumbs";
import WriteUpGallery from "@/components/projects/WriteUpGallery";
interface Props {
  params: Promise<{
    repo: string;
  }>;
}

export default async function RepoPage({
  params,
}: Props) {
  const { repo } = await params;

  const repository = await getRepo(repo);

  if (!repository) notFound();

  const items = await getRepoContents(repo);

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Background Video */}
      <div className="fixed inset-0 -z-20 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="
            h-full
            w-full
            object-cover
            scale-110
            opacity-35
          "
        >
          <source
            src="/videos/write-up-background.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Dark Overlay */}
      <div
        className="
          fixed
          inset-0
          -z-10
          bg-gradient-to-br
          from-black
          via-black/55
          to-violet-950/30
          backdrop-blur-[3px]
        "
      />

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
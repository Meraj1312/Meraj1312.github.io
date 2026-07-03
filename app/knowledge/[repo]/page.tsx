import { KNOWLEDGE_REPOS } from "@/lib/github"
import RepoExplorer from "@/components/cyberdocs/RepoExplorer"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return KNOWLEDGE_REPOS.map((repo) => ({
    repo,
  }))
}

interface Props {
  params: Promise<{
    repo: string
  }>
}

export default async function RepoPage({
  params,
}: Props) {
  const { repo } = await params

  if (!KNOWLEDGE_REPOS.includes(repo as any)) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-20">
      <div className="mb-12">
        <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs text-green-400">
          Knowledge Base
        </span>

        <h1 className="mt-4 text-5xl font-black">
          {repo.replaceAll("-", " ")}
        </h1>

        <p className="mt-4 max-w-3xl text-zinc-400">
          Every markdown document inside this GitHub repository is
          automatically listed below.
        </p>
      </div>

      <RepoExplorer repo={repo} />
    </main>
  )
}
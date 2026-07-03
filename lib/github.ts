export const GITHUB_USER = "Meraj1312"

/* ===========================================================
   WEBSITE CONTENT
=========================================================== */

// Projects shown on the homepage
export const PROJECT_REPOS = [
  "alertstack-siem",
  "cve-2018-7600-drupalgeddon2-lab",
  "payloadforge",
  "net-anom",
] as const

// Knowledge Base
export const KNOWLEDGE_REPOS = [
  "Windows",
  "Linux",
  "Active-Directory",
  "Web-Application",
] as const

// Write-ups repository
export const WRITEUP_REPOS = [
  "Write-Ups",
] as const

export interface Repo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  homepage: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  watchers_count: number
  open_issues_count: number
  topics: string[]
  license: { name: string } | null
  default_branch: string
  created_at: string
  updated_at: string
  pushed_at: string
  size: number
}

const GITHUB_API = "https://api.github.com"

// Revalidate every 30 minutes
const REVALIDATE_SECONDS = 60 * 30

function headers(): HeadersInit {
  const h: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  }

  if (process.env.GITHUB_TOKEN) {
    h.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  return h
}

async function ghFetch(path: string, accept?: string): Promise<Response> {
  const h = headers()

  if (accept) {
    (h as Record<string, string>).Accept = accept
  }

  return fetch(`${GITHUB_API}${path}`, {
    headers: h,
    next: {
      revalidate: REVALIDATE_SECONDS,
    },
  })
}

export async function getRepo(name: string): Promise<Repo | null> {
  const res = await ghFetch(`/repos/${GITHUB_USER}/${name}`)

  if (!res.ok) {
    console.log("[GitHub] getRepo failed:", name, res.status)
    return null
  }

  return (await res.json()) as Repo
}

/* ===========================================================
   PROJECTS
=========================================================== */

export async function getProjects(): Promise<Repo[]> {
  const results = await Promise.all(
    PROJECT_REPOS.map((name) => getRepo(name))
  )

  return results.filter((repo): repo is Repo => repo !== null)
}

/* ===========================================================
   KNOWLEDGE
=========================================================== */

export async function getKnowledgeRepos(): Promise<Repo[]> {
  const results = await Promise.all(
    KNOWLEDGE_REPOS.map((name) => getRepo(name))
  )

  return results.filter((repo): repo is Repo => repo !== null)
}

/* ===========================================================
   WRITE-UPS
=========================================================== */

export async function getWriteups(): Promise<Repo | null> {
  return getRepo(WRITEUP_REPOS[0])
}

/* ===========================================================
   EXTRA HELPERS
=========================================================== */

export async function getReadme(name: string): Promise<string | null> {
  const res = await ghFetch(
    `/repos/${GITHUB_USER}/${name}/readme`,
    "application/vnd.github.raw+json"
  )

  if (!res.ok) {
    console.log("[GitHub] getReadme failed:", name)
    return null
  }

  return await res.text()
}

export async function getLanguages(
  name: string
): Promise<Record<string, number>> {
  const res = await ghFetch(`/repos/${GITHUB_USER}/${name}/languages`)

  if (!res.ok) {
    return {}
  }

  return (await res.json()) as Record<string, number>
}

export interface Commit {
  sha: string
  html_url: string
  commit: {
    message: string
    author: {
      name: string
      date: string
    } | null
  }
}

export async function getRecentCommits(
  name: string,
  branch: string
): Promise<Commit[]> {
  const res = await ghFetch(
    `/repos/${GITHUB_USER}/${name}/commits?sha=${branch}&per_page=5`
  )

  if (!res.ok) {
    return []
  }

  return (await res.json()) as Commit[]
}

/* ===========================================================
   HELPERS
=========================================================== */

export const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  Shell: "#89e051",
  PowerShell: "#012456",
  C: "#555555",
  "C++": "#f34b7d",
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Go: "#00ADD8",
  Ruby: "#701516",
  Java: "#b07219",
  Dockerfile: "#384d54",
  Makefile: "#427819",
  Batchfile: "#C1F12E",
  PHP: "#4F5D95",
  Rust: "#dea584",
  Assembly: "#6E4C13",
}

export function langColor(lang: string | null): string {
  if (!lang) return "#8b8b8b"
  return LANGUAGE_COLORS[lang] ?? "#8b8b8b"
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()

  const seconds = Math.floor((now - then) / 1000)

  const units: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [30, "day"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ]

  let value = seconds
  let unit = "second"
  let divisor = 1

  for (const [step, label] of units) {
    if (value < step) {
      unit = label
      break
    }

    divisor *= step
    value = Math.floor(seconds / divisor)
    unit = label
  }

  return `${value} ${unit}${value === 1 ? "" : "s"} ago`
}
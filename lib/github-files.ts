export interface GithubFile {
  name: string
  path: string
  type: "file" | "dir"
  download_url: string | null
}

export async function getRepoFiles(repo: string): Promise<GithubFile[]> {
  const res = await fetch(
    `https://api.github.com/repos/Meraj1312/${repo}/contents`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  )

  if (!res.ok) {
    throw new Error("Unable to load repository contents")
  }

  const data = (await res.json()) as GithubFile[]

  return data
    .filter(
      (file) =>
        file.type === "file" &&
        file.name.toLowerCase().endsWith(".md")
    )
    .sort((a, b) => {
      if (a.name === "README.md") return -1
      if (b.name === "README.md") return 1
      return a.name.localeCompare(b.name)
    })
}
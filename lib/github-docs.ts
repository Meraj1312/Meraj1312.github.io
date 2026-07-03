const USER = "Meraj1312";

export interface DocFile {
  name: string;
  path: string;
  download_url: string;
}

export async function getMarkdownFiles(repo: string): Promise<DocFile[]> {
  const res = await fetch(
    `https://api.github.com/repos/${USER}/${repo}/contents`,
    {
      headers: {
        Accept: "application/vnd.github+json",
      },
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Unable to load ${repo}`);
  }

  const files = await res.json();

  return files
    .filter(
      (f: any) =>
        f.type === "file" &&
        f.name.toLowerCase().endsWith(".md")
    )
    .sort((a: any, b: any) => {
      if (a.name === "README.md") return -1;
      if (b.name === "README.md") return 1;

      return a.name.localeCompare(b.name);
    });
}

export async function getMarkdownContent(
  repo: string,
  filename: string
) {
  const res = await fetch(
    `https://raw.githubusercontent.com/${USER}/${repo}/main/${filename}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  if (!res.ok) {
    return null;
  }

  return await res.text();
}
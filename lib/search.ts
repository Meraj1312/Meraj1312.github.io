import {
  getKnowledgeRepos,
  getProjects,
  getRepoContents,
} from "./github";

export interface SearchItem {
  title: string;
  repo: string;
  path: string;
  href: string;

  section: "Knowledge" | "Project";

  type: "repo" | "dir" | "file";
}

let cache: SearchItem[] | null = null;

async function crawl(
  repo: string,
  base: string,
  section: "Knowledge" | "Project",
  items: SearchItem[]
) {
  const files = await getRepoContents(repo, base);

  for (const file of files) {
    items.push({
      title: file.name,
      repo,
      path: file.path,
      section,
      type: file.type,

      href:
        section === "Knowledge"
          ? file.type === "dir"
            ? `/knowledge/${repo}`
            : `/knowledge/${repo}/${file.name.replace(".md", "")}`
          : file.type === "dir"
          ? `/repos/${repo}?path=${encodeURIComponent(file.path)}`
          : `/repos/${repo}/${file.path}`,
    });

    if (file.type === "dir") {
      await crawl(
        repo,
        file.path,
        section,
        items
      );
    }
  }
}

export async function buildSearchIndex() {
  if (cache) return cache;

  const index: SearchItem[] = [];

  const [projects, knowledge] =
    await Promise.all([
      getProjects(),
      getKnowledgeRepos(),
    ]);

  for (const repo of projects) {
    index.push({
      title: repo.name,
      repo: repo.name,
      path: "",
      href: `/repos/${repo.name}`,
      section: "Project",
      type: "repo",
    });

    await crawl(
      repo.name,
      "",
      "Project",
      index
    );
  }

  for (const repo of knowledge) {
    index.push({
      title: repo.name,
      repo: repo.name,
      path: "",
      href: `/knowledge/${repo.name}`,
      section: "Knowledge",
      type: "repo",
    });

    await crawl(
      repo.name,
      "",
      "Knowledge",
      index
    );
  }

  cache = index;

  return cache;
}
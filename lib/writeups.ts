export type WriteupMeta = {
  slug: string;
  os: "Windows" | "Linux" | "FreeBSD" | "Solaris";
  difficulty: "Easy" | "Medium" | "Hard" | "Insane";
};

export const WRITEUP_META: WriteupMeta[] = [
    {
        slug: "armageddon",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "blackfield",
        os: "Windows",
        difficulty: "Hard",
    },
    {
        slug: "brainfuck",
        os: "Linux",
        difficulty: "Insane",
    },
    {
        slug: "darkzero",
        os: "Windows",
        difficulty: "Hard",
    },
    {
        slug: "devel",
        os: "Windows",
        difficulty: "Easy",
    },
    {
        slug: "intelligence",
        os: "Windows",
        difficulty: "Medium",
    },
    {
        slug: "jarvis",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "jerry",
        os: "Windows",
        difficulty: "Easy",
    },
    {
        slug: "magic",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "monitored",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "nineveh",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "object",
        os: "Windows",
        difficulty: "Hard",
    },
    {
        slug: "pit",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "poison",
        os: "FreeBSD",
        difficulty: "Medium",
    },
    {
        slug: "sea",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "sunday",
        os: "Solaris",
        difficulty: "Easy",
    },
    {
        slug: "vulncicada",
        os: "Windows",
        difficulty: "Medium",
    },
    ];



export function getWriteupMeta(slug: string): WriteupMeta {
  return (
    WRITEUP_META.find(
      (w) => w.slug.toLowerCase() === slug.toLowerCase()
    ) ?? {
      slug,
      os: "Linux",
      difficulty: "Easy",
    }
  );
}
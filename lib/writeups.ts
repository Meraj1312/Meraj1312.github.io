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
        slug: "horizontall",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "legacy",
        os: "Windows",
        difficulty: "Easy",
    },
    {
        slug: "silo",
        os: "Windows",
        difficulty: "Medium",
    },
    {
        slug: "love",
        os: "Windows",
        difficulty: "Easy",
    },
    {
        slug: "conceal",
        os: "Windows",
        difficulty: "Hard",
    },
    {
        slug: "forlic",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "orion",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "doctor",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "delivery",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "blackfield",
        os: "Windows",
        difficulty: "Hard",
    },
    {
        slug: "bastard",
        os: "Windows",
        difficulty: "Medium",
    },
    {
        slug: "chatterbox",
        os: "Windows",
        difficulty: "Medium",
    },
    {
        slug: "mango",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "ophiuchi",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "abducted",
        os: "Linux",
        difficulty: "Medium",
    },
    {
        slug: "brainfuck",
        os: "Linux",
        difficulty: "Insane",
    },
    {
        slug: "apt",
        os: "Windows",
        difficulty: "Insane",
    },
    {
        slug: "anubis",
        os: "Windows",
        difficulty: "Insane",
    },
    {
        slug: "blocky",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "friendzone",
        os: "Linux",
        difficulty: "Easy",
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
        slug: "bank",
        os: "Linux",
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
    {
        slug: "beep",
        os: "Linux",
        difficulty: "Easy",
    },
    {
        slug: "bounty",
        os: "Windows",
        difficulty: "Easy",
    },
    {
        slug: "secnotes",
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

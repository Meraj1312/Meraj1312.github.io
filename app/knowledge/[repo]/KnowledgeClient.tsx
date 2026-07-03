"use client";

import { useEffect, useState } from "react";
import { Markdown } from "@/components/markdown";

interface Props {
  repo: string;
}

export default function KnowledgeClient({ repo }: Props) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReadme() {
      try {
        const res = await fetch(
          `https://api.github.com/repos/Meraj1312/${repo}/readme`,
          {
            headers: {
              Accept: "application/vnd.github.raw+json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("README not found");
        }

        const text = await res.text();

        setContent(text);
      } catch {
        setError("Unable to load README.");
      } finally {
        setLoading(false);
      }
    }

    loadReadme();
  }, [repo]);

  if (loading) {
    return (
      <div className="py-20 text-center text-zinc-400">
        Loading knowledge...
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center text-red-400">
        {error}
      </div>
    );
  }

  return <Markdown content={content} />;
}
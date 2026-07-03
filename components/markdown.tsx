"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface MarkdownProps {
  content: string;
}

export function Markdown({ content }: MarkdownProps) {
  return (
    <article
      className="
        prose
        prose-invert
        prose-green
        max-w-none

        prose-headings:font-bold
        prose-headings:text-white

        prose-p:text-zinc-300
        prose-li:text-zinc-300

        prose-strong:text-white

        prose-code:text-green-400
        prose-pre:bg-zinc-950
        prose-pre:border
        prose-pre:border-green-500/10
        prose-pre:rounded-xl
      "
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
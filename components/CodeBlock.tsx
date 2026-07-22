"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  language: string;
  code: string;
}

export default function CodeBlock({
  language,
  code,
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(code);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  }

  return (
    <div
      className="
        relative
        my-8
        overflow-hidden
        rounded-2xl
        border
        border-violet-500/20
        bg-[#09090b]

        transition-all
        duration-500

        shadow-[0_0_30px_rgba(139,92,246,.18)]

        before:absolute
        before:inset-0
        before:pointer-events-none
        before:rounded-2xl
        before:bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,.16),transparent_35%),radial-gradient(circle_at_top_right,rgba(59,130,246,.14),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(34,197,94,.12),transparent_35%)]
        before:opacity-100

        hover:border-violet-400/40
        hover:shadow-[0_0_60px_rgba(139,92,246,.30)]
      "
    >
      <div
        className="
          relative
          flex
          items-center
          justify-between
          border-b
          border-violet-500/20
          bg-black/70
          px-5
          py-3
          backdrop-blur-xl
        "
      >
        <div className="flex items-center gap-3">
          <Terminal
            size={18}
            className="text-violet-400"
          />

          <span
            className="
              rounded-full
              bg-green-500/15
              px-3
              py-1
              text-xs
              font-semibold
              uppercase
              tracking-widest
              text-green-300

              shadow-[0_0_10px_rgba(34,197,94,.30)]
            "
          >
            {language || "text"}
          </span>
        </div>

        <button
          onClick={copy}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            border
            border-violet-500/20
            bg-black/30
            px-3
            py-2
            text-sm
            text-green-300

            transition-all
            duration-300

            shadow-[0_0_12px_rgba(139,92,246,.25)]

            hover:border-violet-400/50
            hover:bg-violet-500/10
            hover:text-white
            hover:shadow-[0_0_24px_rgba(139,92,246,.45)]
          "
        >
          {copied ? (
            <>
              <Check size={16} />
              Copied
            </>
          ) : (
            <>
              <Copy size={16} />
              Copy
            </>
          )}
        </button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={atomDark}
        showLineNumbers
        wrapLongLines
        customStyle={{
          margin: 0,
          background: "transparent",
          padding: "1.5rem",
          fontSize: "15px",
          lineHeight: "1.8",
          boxShadow: "inset 0 0 80px rgba(139,92,246,.05)",
        }}
        lineNumberStyle={{
          color: "#7c3aed",
          marginRight: "20px",
          minWidth: "30px",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
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
        my-8
        overflow-hidden
        rounded-2xl
        border
        border-green-500/20
        bg-[#0a0a0a]
        shadow-[0_0_40px_rgba(34,197,94,.12)]
        hover:shadow-[0_0_60px_rgba(34,197,94,.18)]
        transition-all
        duration-300
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-green-500/10
          bg-black/60
          px-5
          py-3
          backdrop-blur-xl
        "
      >
        <div className="flex items-center gap-3">
          <Terminal
            size={18}
            className="text-green-400"
          />

          <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-green-400">
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
            border-green-500/20
            px-3
            py-2
            text-sm
            text-green-300
            shadow-[0_0_10px_rgba(34,197,94,.35)]
            transition-all
            hover:border-green-400
            hover:bg-green-500/10
            hover:shadow-[0_0_15px_rgba(34,197,94,.35)]
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
    }}
    lineNumberStyle={{
        color: "#3f3f46",
        marginRight: "20px",
        minWidth: "30px",
    }}
    >
    {code}
    </SyntaxHighlighter>
    </div>
  );
}
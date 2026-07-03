"use client";

import { useEffect, useState } from "react";

const commands = [
  {
    prompt: "meraj@kali:~$",
    command: "whoami",
    output: ["Mohammad Meraj"],
  },
  {
    prompt: "meraj@kali:~$",
    command: "bloodhound-python -u meraj -c All",
    output: [
      "[+] Collecting Active Directory Objects...",
      "[+] Session Complete",
    ],
  },
  {
    prompt: "meraj@kali:~$",
    command: "nmap -Pn -sC -sV 10.10.10.10",
    output: [
      "22/tcp   open  ssh",
      "80/tcp   open  http",
      "445/tcp  open  microsoft-ds",
    ],
  },
];

type HistoryItem = {
  prompt: string;
  command: string;
  output?: string[];
};

export function Terminal() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [current, setCurrent] = useState("");
  const [index, setIndex] = useState(0);
  const [cursor, setCursor] = useState(true);

  // Blinking cursor
  useEffect(() => {
    const blink = setInterval(() => {
      setCursor((v) => !v);
    }, 500);

    return () => clearInterval(blink);
  }, []);

  // Typing animation
  useEffect(() => {
    if (index >= commands.length) return;

    const cmd = commands[index];

    let char = 0;
    let typingTimeout: NodeJS.Timeout;
    let nextTimeout: NodeJS.Timeout;

    const type = () => {
      if (char <= cmd.command.length) {
        setCurrent(cmd.command.slice(0, char));
        char++;

        typingTimeout = setTimeout(type, 55);
      } else {
        // Finished typing, wait before printing output
        typingTimeout = setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            {
              prompt: cmd.prompt,
              command: cmd.command,
              output: cmd.output,
            },
          ]);

          // Move to next command after a pause
          nextTimeout = setTimeout(() => {
            setCurrent("");
            setIndex((i) => i + 1);
          }, 700);
        }, 500);
      }
    };

    type();

    return () => {
      clearTimeout(typingTimeout);
      clearTimeout(nextTimeout);
    };
  }, [index]);

  return (
    <div className="overflow-hidden rounded-2xl border border-green-500/20 bg-black/80 shadow-2xl backdrop-blur-xl">

      <div className="flex items-center gap-2 border-b border-green-500/10 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />

        <span className="ml-3 text-xs text-green-400">
          kali • bash
        </span>
      </div>

      <div className="space-y-3 p-5 font-mono text-sm leading-7">

        {history.map((cmd, i) => (
          <div key={i}>
            <div>
              <span className="text-green-500">{cmd.prompt}</span>{" "}
              <span className="text-green-300">{cmd.command}</span>
            </div>

            {cmd.output?.map((line, j) => (
              <div key={j} className="text-zinc-300">
                {line}
              </div>
            ))}
          </div>
        ))}

        {index < commands.length ? (
          <div>
            <span className="text-green-500">
              {commands[index].prompt}
            </span>{" "}
            <span className="text-green-300">{current}</span>
            <span className={cursor ? "opacity-100" : "opacity-0"}>
              █
            </span>
          </div>
        ) : (
          <div>
            <span className="text-green-500">
              meraj@kali:~$
            </span>{" "}
            <span className={cursor ? "opacity-100" : "opacity-0"}>
              █
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
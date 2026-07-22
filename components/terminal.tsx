"use client";

import { useEffect, useRef, useState } from "react";

const commands = [
  {
    prompt: "meraj@kali:~$",
    command: "whoami",
    output: ["meraj"],
  },
  {
    prompt: "meraj@kali:~$",
    command: "id",
    output: [
      "uid=1337(meraj) gid=1337(pentester) groups=htb,cpts,security",
    ],
  },
  {
    prompt: "meraj@kali:~$",
    command: "hostname",
    output: ["kali"],
  },
  {
    prompt: "meraj@kali:~$",
    command: "uptime",
    output: [
      "up 2 years, 3 months, 14 days, 7 hours, 21 minutes",
    ],
  },
  {
    prompt: "meraj@kali:~$",
    command: "pwd",
    output: ["~/HackTheBox/CPTS"],
  },
  {
    prompt: "meraj@kali:~$",
    command: "ls projects",
    output: [
      "AlertStack-SIEM",
      "PayloadForge",
      "CyberDocs",
      "CVE-Labs",
    ],
  },
  {
    prompt: "meraj@kali:~$",
    command: "ls knowledge",
    output: [
      "Active-Directory",
      "Windows",
      "Linux",
      "Web",
      "Cloud",
      "Detection-Engineering",
    ],
  },
  {
    prompt: "meraj@kali:~$",
    command: "find skills -maxdepth 1",
    output: [
      "skills/",
      "skills/Active-Directory",
      "skills/Windows",
      "skills/Linux",
      "skills/Web",
      "skills/Python",
      "skills/Networking",
    ],
  },
  {
    prompt: "meraj@kali:~$",
    command: 'grep -i "goal" profile.txt',
    output: ["Become a world-class Penetration Tester"],
  },
  {
    prompt: "meraj@kali:~$",
    command: "clear",
    output: [],
    clear: true,
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

  const terminalRef = useRef<HTMLDivElement>(null);

  // Cursor blink
  useEffect(() => {
    console.log("Cursor effect mounted");

    const blink = setInterval(() => {
      console.log("blink");
      setCursor((v) => !v);
    }, 500);

    return () => clearInterval(blink);
  }, []);

  // Auto-scroll
  useEffect(() => {
    terminalRef.current?.scrollTo({
      top: terminalRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history, current]);

  // Typing
  useEffect(() => {
    
    const cmd = commands[index];

    let char = 0;

    let typingTimer: ReturnType<typeof setTimeout>;
    let finishTimer: ReturnType<typeof setTimeout>;
    let nextTimer: ReturnType<typeof setTimeout>;

    function type() {
      if (char <= cmd.command.length) {
        setCurrent(cmd.command.slice(0, char));
        char++;

        typingTimer = setTimeout(
          type,
          35 + Math.random() * 35
        );
      } else {
        finishTimer = setTimeout(() => {
          setHistory((prev) => [
            ...prev,
            {
              prompt: cmd.prompt,
              command: cmd.command,
              output: cmd.output,
            },
          ]);

          setCurrent("");

          nextTimer = setTimeout(() => {
            if ((cmd as any).clear) {
              setHistory([]);
              setIndex(0);
            } else {
              setIndex((i) => i + 1);
            }
          }, 1000);
        }, 350);
      }
    }

    type();

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(finishTimer);
      clearTimeout(nextTimer);
    };
  }, [index]);
  console.log("Terminal render");

  return (
    <div className="overflow-hidden rounded-2xl border border-green-500/20 bg-black/80 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center gap-2 border-b border-green-500/10 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500" />
        <div className="h-3 w-3 rounded-full bg-yellow-500" />
        <div className="h-3 w-3 rounded-full bg-green-500" />

        <span className="ml-3 text-xs text-green-400">
          meraj@kali:~
        </span>
      </div>

      <div
        ref={terminalRef}
        className="
          h-[420px]
          overflow-y-auto
          space-y-3
          p-5
          font-mono
          text-sm
          leading-7
        "
      >
        {history.map((cmd, i) => (
          <div key={i}>
            <div>
              <span className="text-green-500">
                {cmd.prompt}
              </span>{" "}
              <span className="text-green-300">
                {cmd.command}
              </span>
            </div>

            {cmd.output?.map((line, j) => (
              <div
                key={j}
                className="text-zinc-300"
              >
                {line}
              </div>
            ))}
          </div>
        ))}

        <div>
          <span className="text-green-500">
            {commands[index].prompt}
          </span>{" "}
          <span className="text-green-300">
            {current}
          </span>
          <span className={cursor ? "opacity-100" : "opacity-0"}>
            █
          </span>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
  gradient?: boolean;
}

export function GlitchText({
  children,
  className = "",
  gradient = false,
}: GlitchTextProps) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    const loop = () => {
      setActive(true);

      setTimeout(() => setActive(false), 220);

      timer = setTimeout(loop, 5000 + Math.random() * 5000);
    };

    timer = setTimeout(loop, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <span
      data-text={children}
      className={`
        relative inline-block
        ${gradient
          ? "bg-gradient-to-r from-violet-300 via-violet-500 to-cyan-300 bg-clip-text text-transparent"
          : ""
        }
        ${className}
        ${active ? "glitch-active" : ""}
      `}
    >
      {children}
    </span>
  );
}
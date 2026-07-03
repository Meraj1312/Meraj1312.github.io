"use client";

import { useEffect, useState } from "react";

export function GlitchText({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const run = () => {
      setActive(true);

      setTimeout(() => setActive(false), 220);

      const next =
        5000 + Math.random() * 5000; // 5–10 seconds

      timeout = setTimeout(run, next);
    };

    timeout = setTimeout(run, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <span
      data-text={children}
      className={`${className} ${active ? "glitch-active" : ""}`}
    >
      {children}
    </span>
  );
}
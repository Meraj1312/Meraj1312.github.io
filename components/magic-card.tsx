"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
} from "framer-motion";
import { ReactNode } from "react";

interface MagicCardProps {
  children: ReactNode;
  className?: string;
}

export function MagicCard({
  children,
  className = "",
}: MagicCardProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const rect = e.currentTarget.getBoundingClientRect();

    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  }

  const spotlight = useMotionTemplate`
    radial-gradient(
      260px circle at ${mouseX}px ${mouseY}px,
      rgba(34,197,94,.16),
      transparent 65%
    )
  `;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      initial={false}
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: .25,
      }}
      className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        border-green-500/15
        bg-black/35
        backdrop-blur-2xl
        shadow-lg
        transition-all
        ${className}
      `}
    >
      {/* Spotlight */}

      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: spotlight,
        }}
      />

      {/* Border */}

      <div
        className="
        pointer-events-none
        absolute
        inset-0
        rounded-3xl
        opacity-0
        transition-opacity
        duration-300
        group-hover:opacity-100
        "
      >
        <div className="magic-border" />
      </div>

      {/* Glass reflection */}

      <div
        className="
        pointer-events-none
        absolute
        inset-0
        opacity-0
        transition-opacity
        duration-500
        group-hover:opacity-100
        "
      >
        <div
          className="
          absolute
          -left-1/2
          top-0
          h-full
          w-1/2
          rotate-12
          bg-gradient-to-r
          from-transparent
          via-white/10
          to-transparent
          blur-xl
          animate-glass
          "
        />
      </div>

      {/* Background */}

      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-green-500/5
        via-transparent
        to-black/40
        "
      />

      {/* Content */}

      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}
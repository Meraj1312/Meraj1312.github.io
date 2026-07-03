"use client";

export function BackgroundGrid() {
  return (
    <svg
      className="background-grid"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <defs>
        <pattern
          id="grid"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M50 0H0V50"
            fill="none"
            stroke="rgba(34,197,94,.12)"
            strokeWidth="1"
          />
        </pattern>
      </defs>

      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}
"use client";

export function AuroraBackground() {
  return (
    <div className="aurora-bg" aria-hidden="true">
      {/* Moving Grid */}
      <div className="cyber-grid" />

      {/* Aurora blobs */}
      <div className="aurora aurora-1" />
      <div className="aurora aurora-2" />
      <div className="aurora aurora-3" />

      {/* Noise */}
      <div className="noise" />
    </div>
  );
}
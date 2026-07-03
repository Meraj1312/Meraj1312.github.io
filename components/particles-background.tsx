"use client";

import { useEffect, useState, useMemo } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { tsParticles } from "@tsparticles/engine";

export function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    const initEngine = async () => {
      await loadSlim(tsParticles);
      setInit(true);
    };

    initEngine();
  }, []);

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: 10,
      },

      background: {
        color: "transparent",
      },

      particles: {
        number: {
          value: 80,
        },

        color: {
          value: ["#22c55e", "#16a34a", "#ca8a04"],
        },

        links: {
          enable: true,
          distance: 140,
          color: "#22c55e",
          opacity: 0.2,
        },

        move: {
          enable: true,
          speed: 1,
        },

        size: {
          value: { min: 1, max: 3 },
        },

        opacity: {
          value: 0.5,
        },

        shape: {
          type: "circle",
        },
      },

      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "repulse",
          },
        },
      },
    }),
    []
  );

  if (!init) return null;

  return <Particles id="tsparticles" options={options} />;
}
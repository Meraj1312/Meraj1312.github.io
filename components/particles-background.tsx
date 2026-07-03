"use client";

import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {
  tsParticles,
  type ISourceOptions,
} from "@tsparticles/engine";

export function ParticlesBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    async function initEngine() {
      await loadSlim(tsParticles);
      setInit(true);
    }

    initEngine();
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1,
      },

      fpsLimit: 120,

      background: {
        color: "transparent",
      },

      detectRetina: true,

      particles: {
        number: {
          value: 120,
          density: {
            enable: true,
          },
        },

        color: {
          value: ["#22c55e", "#16a34a", "#84cc16"],
        },

        shape: {
          type: "circle",
        },

        opacity: {
          value: {
            min: 0.2,
            max: 0.7,
          },
        },

        size: {
          value: {
            min: 1,
            max: 3,
          },
        },

        links: {
          enable: true,
          distance: 170,
          color: "#22c55e",
          opacity: 0.18,
          width: 1,
        },

        move: {
          enable: true,
          speed: 3,
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "bounce",
          },
        },
      },

      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },

          onClick: {
            enable: true,
            mode: "push",
          },

          resize: {
            enable: true,
          },
        },

        modes: {
          grab: {
            distance: 220,
            links: {
              opacity: 0.8,
            },
          },

          push: {
            quantity: 5,
          },
        },
      },
    }),
    []
  );

  if (!init) return null;

  return <Particles id="tsparticles" options={options} />;
}
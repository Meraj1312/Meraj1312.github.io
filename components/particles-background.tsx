"use client";

import { useEffect, useMemo, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import {
  tsParticles,
  type ISourceOptions,
} from "@tsparticles/engine";

export function ParticlesBackground() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadSlim(tsParticles).then(() => setLoaded(true));
  }, []);

  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: {
        enable: true,
        zIndex: -1,
      },

      background: {
        color: "transparent",
      },

      detectRetina: false,

      fpsLimit: 30,

      particles: {
        number: {
          value: 25,
          density: {
            enable: true,
            width: 1920,
            height: 1080,
          },
        },

        color: {
          value: "#22c55e",
        },

        shape: {
          type: "circle",
        },

        size: {
          value: {
            min: 1,
            max: 2,
          },
        },

        opacity: {
          value: 0.25,
        },

        links: {
          enable: false,
        },

        move: {
          enable: true,
          speed: 0.4,
          random: true,
          straight: false,
          outModes: {
            default: "out",
          },
        },
      },

      interactivity: {
        events: {
          onHover: {
            enable: false,
          },

          onClick: {
            enable: false,
          },
        },
      },

      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }),
    []
  );

  if (!loaded) return null;

  return <Particles id="particles" options={options} />;
}
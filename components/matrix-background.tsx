"use client";

import { useEffect } from "react";

export function MatrixBackground() {
  useEffect(() => {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d")!;
    canvas.style.position = "fixed";
    canvas.style.inset = "0";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none";

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const letters = "01";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops: number[] = Array(Math.floor(columns)).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#22c55e";
      ctx.font = fontSize + "px monospace";

      for (let i = 0; i < drops.length; i++) {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        drops[i]++;
      }
    }

    const interval = setInterval(draw, 33);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", resize);
      canvas.remove();
    };
  }, []);

  return null;
}
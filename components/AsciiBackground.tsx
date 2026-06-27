"use client";

import { useEffect, useRef } from "react";

const CHARS = [
  "ｦ",
  "ｧ",
  "ｨ",
  "ｩ",
  "ｪ",
  "ｫ",
  "ｬ",
  "ｭ",
  "ｮ",
  "ｯ",
  "ｰ",
  "ｱ",
  "ｲ",
  "ｳ",
  "ｴ",
  "ｵ",
  "ｶ",
  "ｷ",
  "ｸ",
  "ｹ",
  "ｺ",
  "ｻ",
  "ｼ",
  "ｽ",
  "ｾ",
  "ｿ",
  "ﾀ",
  "ﾁ",
  "ﾂ",
  "ﾃ",
  "ﾄ",
  "ﾅ",
  "ﾆ",
  "ﾇ",
  "ﾈ",
  "ﾉ",
  "ﾊ",
  "ﾋ",
  "ﾌ",
  "ﾍ",
  "ﾎ",
  "ﾏ",
  "ﾐ",
  "ﾑ",
  "ﾒ",
  "ﾓ",
  "ﾔ",
  "ﾕ",
  "ﾖ",
  "ﾗ",
  "ﾘ",
  "ﾙ",
  "ﾚ",
  "ﾛ",
  "ﾜ",
  "ﾝ",
];
const FONT_SIZE = 14;
let sharedMouseX = 0;
let sharedMouseY = 0;
let listenerAttached = false;

interface Cell {
  x: number;
  y: number;
  baseChar: string;
  phase: number;
  speed: number;
  brightness: number;
}

export default function AsciiBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0,
      height = 0;
    let time = 0;
    let grid: Cell[] = [];
    let rafId: number;
    let lastFrame = 0;

    const onMouseMove = (e: MouseEvent) => {
      sharedMouseX = e.clientX;
      sharedMouseY = e.clientY;
    };
    if (!listenerAttached) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
      listenerAttached = true;
    }

    function initGrid() {
      const columns = Math.ceil(width / FONT_SIZE);
      const rows = Math.ceil(height / FONT_SIZE);
      grid = [];
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          grid.push({
            x,
            y,
            baseChar: CHARS[Math.floor(Math.random() * CHARS.length)],
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.7,
            brightness: 0.08 + Math.random() * 0.18,
          });
        }
      }
    }

    function resize() {
      width = canvas!.width = window.innerWidth;
      height = canvas!.height = window.innerHeight;
      initGrid();
    }

    function draw(now: number) {
      rafId = requestAnimationFrame(draw);

      if (now - lastFrame < 33) return;
      lastFrame = now;

      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, width, height);
      ctx!.font = `${FONT_SIZE}px "DM Mono", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";

      ctx!.fillStyle = "rgb(160, 156, 150)";

      const mx = sharedMouseX / FONT_SIZE;
      const my = sharedMouseY / FONT_SIZE;

      for (const cell of grid) {
        const dx = cell.x - mx;
        const dy = cell.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wave =
          Math.sin(time * cell.speed + cell.phase + dist * 0.15) * 0.5 + 0.5;
        const proximity = Math.max(0, 1 - dist / 15);
        const alpha = Math.min(
          cell.brightness * (0.3 + wave * 0.7) + proximity * 0.6,
          0.32,
        );

        if (alpha < 0.02) continue;

        ctx!.globalAlpha = alpha;
        const charIndex = Math.floor(wave * (CHARS.length - 1));
        ctx!.fillText(
          CHARS[charIndex] ?? cell.baseChar,
          cell.x * FONT_SIZE + FONT_SIZE / 2,
          cell.y * FONT_SIZE + FONT_SIZE / 2,
        );
      }

      ctx!.globalAlpha = 1;
      time += 0.02;
    }

    window.addEventListener("resize", resize);
    resize();
    rafId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      listenerAttached = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="bg-canvas"
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}

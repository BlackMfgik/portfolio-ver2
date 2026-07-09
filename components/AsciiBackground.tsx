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
const FRAME_INTERVAL = 33;
const FACE_STITCHES = [-0.44, -0.34, -0.22, -0.1, 0.02, 0.15, 0.27, 0.39, 0.48];
const BACKGROUND_CURSOR_RADIUS = 9;
const FACE_SCATTER_RADIUS = 118;
const FACE_SCATTER_DISTANCE = 48;

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
  faceIntensity: number;
  faceCore: boolean;
}

interface AsciiBackgroundProps {
  faceMode?: boolean;
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function smooth01(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function lineDistance(
  px: number,
  py: number,
  ax: number,
  ay: number,
  bx: number,
  by: number,
) {
  const dx = bx - ax;
  const dy = by - ay;
  const lenSq = dx * dx + dy * dy || 1;
  const t = clamp01(((px - ax) * dx + (py - ay) * dy) / lenSq);
  const x = ax + dx * t;
  const y = ay + dy * t;
  return Math.hypot(px - x, py - y);
}

function getFaceIntensity(cell: Cell, width: number, height: number) {
  const px = cell.x * FONT_SIZE + FONT_SIZE / 2;
  const py = cell.y * FONT_SIZE + FONT_SIZE / 2;
  const faceWidth = Math.min(width * (width < 700 ? 0.94 : 0.68), height * 1.12);
  const centerX = width / 2;
  const centerY = height * (width < 700 ? 0.52 : 0.535);
  const x = (px - centerX) / faceWidth;
  const y = (py - centerY) / faceWidth;

  if (Math.abs(x) > 0.66 || y < -0.46 || y > 0.46) return 0;

  const roughness = 0.84 + Math.sin(cell.phase * 2.7) * 0.16;
  const stroke = 0.019;
  const eyeSize = width < 700 ? 0.13 : 0.155;
  const eyeY = -0.17;
  const eyeOffset = width < 700 ? 0.22 : 0.25;
  let minDist = Infinity;

  for (const cx of [-eyeOffset, eyeOffset]) {
    minDist = Math.min(
      minDist,
      lineDistance(x, y, cx - eyeSize, eyeY - eyeSize, cx + eyeSize, eyeY + eyeSize),
      lineDistance(x, y, cx - eyeSize, eyeY + eyeSize, cx + eyeSize, eyeY - eyeSize),
    );
  }

  const mouthLimit = 0.52;
  if (Math.abs(x) <= mouthLimit) {
    const mouthY = 0.2 - 0.15 * Math.pow(x / mouthLimit, 2);
    minDist = Math.min(minDist, Math.abs(y - mouthY));
  }

  for (const sx of FACE_STITCHES) {
    const mouthY = 0.2 - 0.15 * Math.pow(sx / mouthLimit, 2);
    const tilt = sx < 0 ? -0.025 : 0.025;
    minDist = Math.min(
      minDist,
      lineDistance(x, y, sx - tilt, mouthY - 0.055, sx + tilt, mouthY + 0.06),
    );
  }

  const core = clamp01(1 - minDist / stroke);
  const glow = clamp01(1 - minDist / (stroke * 4.8)) * 0.38;

  return clamp01(Math.max(core, glow) * roughness);
}

export default function AsciiBackground({ faceMode = false }: AsciiBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const faceModeRef = useRef(faceMode);

  useEffect(() => {
    faceModeRef.current = faceMode;
  }, [faceMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;
    let faceReveal = faceModeRef.current ? 1 : 0;
    let grid: Cell[] = [];
    let faceCells: Cell[] = [];
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
      faceCells = [];

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
          const cell: Cell = {
            x,
            y,
            baseChar: CHARS[Math.floor(Math.random() * CHARS.length)],
            phase: Math.random() * Math.PI * 2,
            speed: 0.3 + Math.random() * 0.7,
            brightness: 0.08 + Math.random() * 0.18,
            faceIntensity: 0,
            faceCore: false,
          };

          cell.faceIntensity = getFaceIntensity(cell, width, height);
          cell.faceCore = cell.faceIntensity > 0.48;
          grid.push(cell);

          if (cell.faceIntensity > 0.035) {
            faceCells.push(cell);
          }
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

      if (now - lastFrame < FRAME_INTERVAL) return;
      lastFrame = now;

      const targetReveal = faceModeRef.current ? 1 : 0;
      faceReveal += (targetReveal - faceReveal) * 0.12;
      if (Math.abs(targetReveal - faceReveal) < 0.003) {
        faceReveal = targetReveal;
      }

      ctx!.fillStyle = "#0a0a0a";
      ctx!.fillRect(0, 0, width, height);
      ctx!.font = `${FONT_SIZE}px "DM Mono", monospace`;
      ctx!.textAlign = "center";
      ctx!.textBaseline = "middle";
      ctx!.shadowBlur = 0;
      ctx!.fillStyle = "rgb(160, 156, 150)";

      const mx = sharedMouseX / FONT_SIZE;
      const my = sharedMouseY / FONT_SIZE;

      for (const cell of grid) {
        const dx = cell.x - mx;
        const dy = cell.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const wave =
          Math.sin(time * cell.speed * 0.58 + cell.phase + dist * 0.07) * 0.5 +
          0.5;
        const proximity = smooth01(1 - dist / BACKGROUND_CURSOR_RADIUS);
        const alpha = Math.min(
          cell.brightness * (0.45 + wave * 0.55) + proximity * 0.38,
          0.28,
        );

        if (alpha < 0.02) continue;

        const charIndex = Math.floor(wave * (CHARS.length - 1));
        ctx!.globalAlpha = alpha;
        ctx!.fillText(
          CHARS[charIndex] ?? cell.baseChar,
          cell.x * FONT_SIZE + FONT_SIZE / 2,
          cell.y * FONT_SIZE + FONT_SIZE / 2,
        );
      }

      if (faceReveal > 0.015) {
        ctx!.fillStyle = "rgb(255, 50, 48)";

        for (const cell of faceCells) {
          const flicker = 0.9 + Math.sin(time * 3.2 + cell.phase * 4) * 0.1;
          let intensity = cell.faceIntensity * faceReveal * flicker;
          if (intensity < 0.02) continue;

          const wave = Math.sin(time * cell.speed + cell.phase) * 0.5 + 0.5;
          const charIndex =
            (Math.floor(wave * (CHARS.length - 1)) +
              Math.floor(time * 18 + cell.phase * 5)) %
            CHARS.length;
          const baseX = cell.x * FONT_SIZE + FONT_SIZE / 2;
          const baseY = cell.y * FONT_SIZE + FONT_SIZE / 2;
          const cursorDx = baseX - sharedMouseX;
          const cursorDy = baseY - sharedMouseY;
          const cursorDist = Math.sqrt(cursorDx * cursorDx + cursorDy * cursorDy);
          const scatter = smooth01(1 - cursorDist / FACE_SCATTER_RADIUS);
          const safeDist = Math.max(cursorDist, 1);
          const nx = cursorDx / safeDist;
          const ny = cursorDy / safeDist;
          const swirl = Math.sin(time * 5 + cell.phase * 5) * scatter * 13;
          const push = scatter * scatter * FACE_SCATTER_DISTANCE;
          const x = baseX + nx * push - ny * swirl;
          const y = baseY + ny * push + nx * swirl;

          intensity *= 1 - scatter * 0.28;

          if (cell.faceCore && intensity > 0.35) {
            ctx!.globalAlpha = Math.min(0.18, intensity * 0.2);
            ctx!.fillText(CHARS[charIndex] ?? cell.baseChar, x - 1, y);
            ctx!.fillText(CHARS[charIndex] ?? cell.baseChar, x + 1, y);
          }

          ctx!.globalAlpha = Math.min(0.95, 0.12 + intensity * 0.83);
          ctx!.fillText(CHARS[charIndex] ?? cell.baseChar, x, y);
        }
      }

      ctx!.globalAlpha = 1;
      time += 0.014;
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

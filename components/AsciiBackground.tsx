"use client";

import { useEffect, useRef } from "react";
import type { AsciiWorkerMessage } from "@/lib/ascii/ascii.worker";
import { createAsciiRenderer, type AsciiRenderer } from "@/lib/ascii/renderer";

interface AsciiBackgroundProps {
  isMusicPlaying?: boolean;
  coverImageSrc?: string;
}

// Один спільний канал до рендера — або воркер, або локальний рендер
// у основному потоці, якщо браузер не вміє OffscreenCanvas.
interface RendererHandle {
  send(message: Exclude<AsciiWorkerMessage, { type: "init" }>): void;
  destroy(): void;
}

function toAbsolute(src: string) {
  return new URL(src, window.location.href).href;
}

function startRenderer(
  canvas: HTMLCanvasElement,
  isMusicPlaying: boolean,
  coverSrc: string,
): RendererHandle | null {
  // Малювання ~7.5 тис. символів щокадру займає понад 16 мс — якщо робити
  // це в основному потоці, воно відбирає час у Lenis/GSAP і прокрутка
  // починає смикатися. Тому canvas віддаємо у Web Worker.
  if (
    typeof Worker !== "undefined" &&
    "transferControlToOffscreen" in canvas
  ) {
    try {
      const worker = new Worker(
        new URL("../lib/ascii/ascii.worker.ts", import.meta.url),
      );
      const offscreen = canvas.transferControlToOffscreen();
      const init: AsciiWorkerMessage = {
        type: "init",
        canvas: offscreen,
        width: window.innerWidth,
        height: window.innerHeight,
        coverSrc: toAbsolute(coverSrc),
        isMusicPlaying,
      };
      worker.postMessage(init, [offscreen]);

      return {
        send: (message) => worker.postMessage(message),
        destroy: () => worker.terminate(),
      };
    } catch {
      // canvas міг уже бути переданий (наприклад, у StrictMode) — нижче
      // спробуємо звичайний рендер; якщо й він неможливий, фону просто не буде.
    }
  }

  let renderer: AsciiRenderer | null = null;
  try {
    renderer = createAsciiRenderer(canvas);
  } catch {
    return null;
  }
  if (!renderer) return null;

  renderer.resize(window.innerWidth, window.innerHeight);
  renderer.setMusicPlaying(isMusicPlaying);
  renderer.setCover(toAbsolute(coverSrc));
  const local = renderer;

  return {
    send(message) {
      switch (message.type) {
        case "resize":
          local.resize(message.width, message.height);
          break;
        case "mouse":
          local.setMouse(message.x, message.y);
          break;
        case "music":
          local.setMusicPlaying(message.playing);
          break;
        case "cover":
          local.setCover(message.src);
          break;
      }
    },
    destroy: () => local.destroy(),
  };
}

export default function AsciiBackground({
  isMusicPlaying = false,
  coverImageSrc = "/ascii-track-cover.png",
}: AsciiBackgroundProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<RendererHandle | null>(null);
  const initialPropsRef = useRef({ isMusicPlaying, coverImageSrc });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // canvas створюємо тут, а не в JSX: після transferControlToOffscreen
    // його вже не можна передати вдруге, а StrictMode у dev запускає ефект
    // двічі — кожен запуск отримує власний свіжий canvas.
    const canvas = document.createElement("canvas");
    canvas.id = "bg-canvas";
    canvas.className = "block w-full h-full";
    host.appendChild(canvas);

    const { isMusicPlaying: playing, coverImageSrc: cover } =
      initialPropsRef.current;
    const handle = startRenderer(canvas, playing, cover);
    if (!handle) {
      canvas.remove();
      return;
    }
    handleRef.current = handle;

    let pendingMouse: { x: number; y: number } | null = null;
    let mouseRaf = 0;

    // Надсилаємо позицію курсора не частіше за кадр, щоб не засипати
    // воркер повідомленнями на мишах з високою частотою опитування.
    const onMouseMove = (e: MouseEvent) => {
      pendingMouse = { x: e.clientX, y: e.clientY };
      if (mouseRaf) return;
      mouseRaf = requestAnimationFrame(() => {
        mouseRaf = 0;
        if (pendingMouse) handle.send({ type: "mouse", ...pendingMouse });
      });
    };

    const onResize = () => {
      handle.send({
        type: "resize",
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(mouseRaf);
      handle.destroy();
      handleRef.current = null;
      canvas.remove();
    };
  }, []);

  useEffect(() => {
    handleRef.current?.send({ type: "music", playing: isMusicPlaying });
  }, [isMusicPlaying]);

  useEffect(() => {
    handleRef.current?.send({ type: "cover", src: toAbsolute(coverImageSrc) });
  }, [coverImageSrc]);

  return (
    <div
      ref={hostRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0, opacity: 0.9 }}
      aria-hidden="true"
    />
  );
}

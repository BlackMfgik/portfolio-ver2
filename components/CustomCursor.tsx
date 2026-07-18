"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const canUseCustomCursor =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (!dot || !canUseCustomCursor) return;

    let mx = -100,
      my = -100;
    let rafId: number;
    let dirty = false;
    let ready = false;

    const moveCursor = (x: number, y: number) => {
      mx = x;
      my = y;
      if (!ready) {
        document.documentElement.classList.add("custom-cursor-ready");
        ready = true;
      }
      dirty = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      moveCursor(e.clientX, e.clientY);
    };

    const onPointerMove = (e: PointerEvent) => {
      moveCursor(e.clientX, e.clientY);
    };

    const animate = () => {
      if (dirty) {
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        dot.style.opacity = "1";
        dirty = false;
      }

      rafId = requestAnimationFrame(animate);
    };

    const onLeave = () => {
      dot.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-ready");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div id="cursor-dot" ref={dotRef} aria-hidden="true" />
  );
}

"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -100,
      my = -100;
    let rx = -100,
      ry = -100;
    let rafId: number;
    let dirty = false; // dot updates only when mouse actually moved

    // ── Mouse position: just store coords, no DOM writes here ────
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dirty = true;
    };

    // ── Single rAF loop: dot + ring both updated here ────────────
    const animate = () => {
      // Dot — instant snap, but inside rAF so it's always in sync with the frame
      if (dirty) {
        dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        dirty = false;
      }

      // Ring — lerp follow
      rx += (mx - rx) * 0.15;
      ry += (my - ry) * 0.15;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;

      rafId = requestAnimationFrame(animate);
    };

    // ── Hover state via delegated event ──────────────────────────
    const onOver = (e: MouseEvent) => {
      ring.classList.toggle(
        "hovering",
        !!(e.target as Element).closest('a, button, [role="button"]'),
      );
    };

    const onLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const onEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };

    // passive: true → browser won't wait for preventDefault → smoother scroll + cursor
    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);
    rafId = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div id="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div id="cursor-ring" ref={ringRef} aria-hidden="true" />
    </>
  );
}

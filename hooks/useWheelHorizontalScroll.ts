"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Attaches a non-passive wheel listener to a scrollable element and
 * translates vertical wheel movement into horizontal scroll — the
 * "scroll wheel drives a horizontal strip" pattern.
 *
 * Page scroll is only intercepted while the pointer is over the element
 * AND the strip still has room to move in that direction. Once the strip
 * hits its start/end, the event is left alone so the page keeps scrolling
 * vertically as normal — no scroll trap.
 */
export function useWheelHorizontalScroll<T extends HTMLElement>(): {
  ref: RefObject<T | null>;
  progress: number;
} {
  const ref = useRef<T | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const updateProgress = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };

    const onWheel = (e: WheelEvent) => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 0) return;

      const delta =
        Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      const goingForward = delta > 0;
      const atEnd = el.scrollLeft >= max - 1;
      const atStart = el.scrollLeft <= 1;

      if ((goingForward && atEnd) || (!goingForward && atStart)) {
        // Let the page handle vertical scroll from here.
        return;
      }

      e.preventDefault();
      el.scrollLeft += delta;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return { ref, progress };
}

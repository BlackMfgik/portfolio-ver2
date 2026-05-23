"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

/**
 * Purely a side-effect component — renders nothing, just boots
 * the scroll-reveal IntersectionObserver on mount.
 */
export default function ScrollRevealInit() {
  useScrollReveal();
  return null;
}

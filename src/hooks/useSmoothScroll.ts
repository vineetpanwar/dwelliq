"use client";

import { useEffect } from "react";

export function useSmoothScroll() {
  useEffect(() => {
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId = 0;
    import("lenis").then(({ default: Lenis }) => {
      lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
      function raf(t: number) { lenis!.raf(t); rafId = requestAnimationFrame(raf); }
      rafId = requestAnimationFrame(raf);
    });
    return () => { lenis?.destroy(); cancelAnimationFrame(rafId); };
  }, []);
}

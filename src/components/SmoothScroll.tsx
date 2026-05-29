import { useEffect } from "react";
import Lenis from "lenis";

/* Module-scoped handle to the active Lenis instance so non-scroll
   components (e.g. the mobile menu) can trigger eased scrolling without
   relying on the global click interceptor. Null when smooth-scroll is
   disabled (reduced motion) — callers fall back to native scrolling. */
let lenisInstance: Lenis | null = null;

/* Scroll to an in-page section by hash (e.g. "#services"), accounting for
   the fixed nav. Used by the mobile menu, which must close first and then
   scroll once its collapse animation has settled. */
export function scrollToSection(hash: string) {
  const el = document.querySelector(hash) as HTMLElement | null;
  if (!el) return;
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { offset: -80, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

/* Buttery momentum scrolling — the single biggest "expensive site" tell.
   Hooks Lenis into rAF and disables itself for reduced-motion users.
   Also intercepts in-page anchor links so they ease instead of jumping. */
export function SmoothScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
    });
    lenisInstance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      // Links that manage their own scrolling (e.g. the mobile menu, which
      // must close before scrolling) opt out via data-self-scroll.
      if (anchor.dataset.selfScroll !== undefined) return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -80, duration: 1.4 });
    };
    document.addEventListener("click", onAnchorClick);

    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("click", onAnchorClick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return null;
}

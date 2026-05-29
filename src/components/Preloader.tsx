import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* A short branded intro: the logo draws in over a counting percentage,
   then the panel slides away to reveal the page. Runs once per page load,
   instant for reduced-motion users. Sets a body flag so the hero can
   choreograph its entrance after the curtain lifts. */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      document.body.dataset.loaded = "true";
      return;
    }

    document.body.style.overflow = "hidden";
    const start = performance.now();
    const total = 1300;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / total);
      // easeOutCubic
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t = setTimeout(() => {
      setDone(true);
      document.body.style.overflow = "";
      document.body.dataset.loaded = "true";
    }, total + 350);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-primary"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-black tracking-tighter font-display mb-6"
          >
            <span className="text-secondary">Info</span>
            <span className="text-white">Metrix</span>
          </motion.div>

          <div className="w-48 h-px bg-white/15 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-secondary to-tertiary"
              initial={{ width: "0%" }}
              animate={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
          <div className="mt-4 text-sm font-display font-medium text-white/50 tabular-nums">
            {count}%
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

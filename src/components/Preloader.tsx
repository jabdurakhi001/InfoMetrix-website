import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* A brief branded fade shown once per page load. Kept deliberately short
   (no scroll lock, no fake progress) so content is never gated behind it;
   skipped entirely for reduced-motion users. Sets a body flag so the hero
   can choreograph its entrance after the fade. */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDone(true);
      document.body.dataset.loaded = "true";
      return;
    }

    const t = setTimeout(() => {
      setDone(true);
      document.body.dataset.loaded = "true";
    }, 500);

    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-primary"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="text-4xl sm:text-5xl font-black tracking-tighter font-display"
          >
            <span className="text-secondary">Info</span>
            <span className="text-white">Metrix</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/lib/site";

declare global {
  interface Window {
    __preloaded?: boolean;
  }
}

export function onPreloaded(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  if (window.__preloaded) {
    cb();
    return () => {};
  }
  window.addEventListener("preloader:done", cb, { once: true });
  return () => window.removeEventListener("preloader:done", cb);
}

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence
      onExitComplete={() => {
        window.__preloaded = true;
        window.dispatchEvent(new Event("preloader:done"));
      }}
    >
      {show && (
        <motion.div
          key="preloader"
          className="preloader fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center">
            <div className="overflow-hidden">
              <motion.p
                className="font-display text-5xl tracking-[0.2em] text-cream md:text-7xl"
                initial={{ y: "110%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                {site.shortName.toUpperCase()}
              </motion.p>
            </div>
            <motion.div
              className="mx-auto mt-6 h-px bg-gold"
              initial={{ width: 0 }}
              animate={{ width: 180 }}
              transition={{ duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

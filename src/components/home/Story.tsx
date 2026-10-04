"use client";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "framer-motion";
import Bottle from "@/components/Bottle";
import type { Product } from "@/lib/types";

// Pinned, scroll-driven story: the bottle stays put while the three layers of the scent unfold.
export default function Story({ product }: { product: Product }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.6 });
  const rotate = useTransform(p, [0, 0.5, 1], [-10, 4, 12]);
  const scale = useTransform(p, [0, 0.5, 1], [0.88, 1.04, 0.94]);
  const bar = useTransform(p, [0, 1], ["0%", "100%"]);
  const ringRotate = useTransform(p, [0, 1], [0, 240]);

  useMotionValueEvent(scrollYProgress, "change", (v) => setActive(Math.min(2, Math.floor(v * 3))));

  const acts = [
    { label: "Top notes", title: "The first breath", text: "Bright, sparkling and fleeting. The top notes greet you in the first minutes, an opening that sets the mood.", notes: product.notes.top, glow: "#e9d3a3" },
    { label: "Heart notes", title: "The soul of the scent", text: "As the opening settles, the heart blooms. This is the character of the perfume, warm and full, lasting for hours.", notes: product.notes.heart, glow: "#c9737f" },
    { label: "Base notes", title: "The lasting memory", text: "Rich resins and woods anchor everything. The base is what lingers on your skin and clothes long after you leave the room.", notes: product.notes.base, glow: product.color },
  ];
  const act = acts[active];

  return (
    <section id="story" ref={ref} className="relative h-[360vh] bg-ink-2" aria-labelledby="story-title">
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <motion.div
          aria-hidden
          className="absolute right-[-10%] top-1/2 h-[70vw] w-[70vw] -translate-y-1/2 rounded-full blur-[140px] md:right-[5%] md:h-[45vw] md:w-[45vw]"
          animate={{ backgroundColor: act.glow, opacity: 0.35 }}
          transition={{ duration: 1.2 }}
        />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:grid-cols-2 md:px-8">
          <div className="relative z-10 order-2 md:order-1">
            <p className="eyebrow mb-4">The anatomy of {product.name}</p>
            <h2 id="story-title" className="font-display text-3xl text-cream/90 md:text-5xl">Crafted in three acts</h2>
            <div className="mt-5 flex items-center gap-4 md:mt-10">
              <span className="font-display text-5xl text-gold md:text-8xl">0{active + 1}</span>
              <span className="text-sm text-muted">/ 03</span>
              <div className="ml-4 h-px flex-1 bg-white/10">
                <motion.div className="h-px bg-gold" style={{ width: bar }} />
              </div>
            </div>
            <div className="relative mt-4 min-h-[240px] md:mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -30, filter: "blur(8px)" }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                >
                  <p className="text-xs tracking-[0.3em] text-gold uppercase">{act.label}</p>
                  <h3 className="mt-3 font-display text-3xl text-cream md:text-6xl">{act.title}</h3>
                  <p className="mt-5 max-w-md text-cream/65">{act.text}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {act.notes.map((n, i) => (
                      <motion.li
                        key={n}
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 + i * 0.08 }}
                        className="rounded-full border border-gold/40 px-4 py-1.5 text-sm text-gold-2"
                      >
                        {n}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="relative order-1 mx-auto h-[28vh] w-full max-w-[360px] md:order-2 md:h-[70vh]">
            <motion.svg aria-hidden viewBox="0 0 200 200" className="absolute inset-[-15%] h-[130%] w-[130%]" style={{ rotate: ringRotate }}>
              {[0, 1, 2].map((i) => (
                <circle key={i} cx="100" cy="100" r={60 + i * 18} fill="none" stroke="#c8a46a" strokeWidth={i === active ? 0.8 : 0.3} strokeOpacity={i === active ? 0.8 : 0.25} strokeDasharray={i === 1 ? "1 3" : undefined} />
              ))}
              {[0, 1, 2].map((i) => {
                const a = (i * 120 * Math.PI) / 180;
                return <circle key={`d${i}`} cx={Math.round((100 + Math.cos(a) * (60 + i * 18)) * 100) / 100} cy={Math.round((100 + Math.sin(a) * (60 + i * 18)) * 100) / 100} r={i === active ? 3 : 1.6} fill="#c8a46a" />;
              })}
            </motion.svg>
            <motion.div className="absolute inset-0" style={{ rotate, scale }}>
              <Bottle color={product.color} shape={product.bottle} level={0.35 + active * 0.27} className="h-full w-full drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]" title={`${product.name} bottle`} />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

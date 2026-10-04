"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type FaqItem = { q: string; a: string };

export default function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-ink-2 py-24 md:py-32" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-4">
          <p className="eyebrow mb-5">Questions</p>
          <h2 id="faq-title" className="font-display text-5xl leading-none text-cream md:text-6xl">Good to know</h2>
        </div>
        <ul className="divide-y divide-white/10 border-y border-white/10 md:col-span-8">
          {items.map((f, i) => {
            const isOpen = open === i;
            return (
              <li key={f.q}>
                <h3>
                  <button className="flex w-full items-center justify-between gap-6 py-6 text-left" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
                    <span className="font-display text-2xl text-cream md:text-3xl">{f.q}</span>
                    <motion.span className="relative h-5 w-5 shrink-0" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 18 }}>
                      <span className="absolute left-0 top-1/2 h-px w-5 bg-gold" />
                      <span className="absolute left-1/2 top-0 h-5 w-px bg-gold" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ type: "spring", stiffness: 160, damping: 24 }} className="overflow-hidden">
                      <p className="max-w-2xl pb-6 text-cream/65">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

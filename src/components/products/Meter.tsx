"use client";
import { motion } from "framer-motion";

export default function Meter({ label, value, words }: { label: string; value: number; words: string[] }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-xs tracking-[0.16em] uppercase">
        <span className="text-muted">{label}</span>
        <span className="text-cream/80">{words[Math.max(0, Math.min(words.length - 1, value - 1))]}</span>
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full bg-gold"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: i < value ? 1 : 0 }}
              viewport={{ once: true }}
              style={{ originX: 0 }}
              transition={{ type: "spring", stiffness: 90, damping: 16, delay: 0.3 + i * 0.12 }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

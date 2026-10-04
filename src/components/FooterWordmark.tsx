"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

const word = "ÉLAN";

function Letter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const start = i * 0.08;
  const y = useTransform(progress, [start, start + 0.6], ["100%", "0%"]);
  const rotate = useTransform(progress, [start, start + 0.6], [12, 0]);
  return (
    <span className="inline-block overflow-hidden">
      <motion.span className="text-gold-gradient inline-block" style={{ y, rotate }}>{ch}</motion.span>
    </span>
  );
}

export default function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22 });
  return (
    <div ref={ref} aria-hidden className="mt-20 select-none px-5 text-center">
      <p className="font-display text-[28vw] leading-[0.8] md:text-[24vw]">
        {word.split("").map((ch, i) => <Letter key={i} ch={ch} i={i} progress={progress} />)}
      </p>
    </div>
  );
}

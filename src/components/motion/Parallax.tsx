"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

// Moves children at a different speed than the page, smoothed with a spring.
export default function Parallax({ children, speed = 0.2, className }: { children: React.ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const raw = useTransform(scrollYProgress, [0, 1], [speed * 200, speed * -200]);
  const y = useSpring(raw, { stiffness: 80, damping: 20, mass: 0.5 });
  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

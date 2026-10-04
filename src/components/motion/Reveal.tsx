"use client";
import { motion } from "framer-motion";

// Spring fade-up when the element scrolls into view.
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ type: "spring", stiffness: 70, damping: 18, mass: 0.9, delay }}
    >
      {children}
    </motion.div>
  );
}

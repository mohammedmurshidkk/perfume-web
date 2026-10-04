"use client";
import { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export default function CountUp({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, {
      duration: 2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix;
      },
    });
    return () => c.stop();
  }, [inView, to, decimals, suffix]);
  return <span ref={ref}>{to.toFixed(decimals) + suffix}</span>;
}

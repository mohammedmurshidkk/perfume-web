"use client";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ProductImage from "@/components/ProductImage";
import Bottle from "@/components/Bottle";
import type { Product } from "@/lib/types";

export default function ProductGallery({ product: p }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 16 });
  const sy = useSpring(my, { stiffness: 80, damping: 16 });
  const rotY = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const rotX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const glowX = useTransform(sx, [-0.5, 0.5], ["30%", "70%"]);
  const hasPhotos = p.images.length > 0;
  const slides = hasPhotos ? p.images.length + 1 : 1; // photos plus the illustration

  return (
    <div>
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[32px] border border-white/10 [perspective:1000px]"
        style={{ background: `radial-gradient(90% 70% at 50% 100%, ${p.color}80, transparent 65%), linear-gradient(180deg, #1f1a16, #0f0c0a)` }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => { mx.set(0); my.set(0); }}
      >
        <motion.div aria-hidden className="absolute top-[20%] h-[50%] w-[60%] -translate-x-1/2 rounded-full blur-[90px]" style={{ left: glowX, background: `${p.color}` , opacity: 0.45 }} />
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.08, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.96, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {hasPhotos && idx < p.images.length ? (
              <ProductImage product={p} index={idx} priority sizes="(min-width: 768px) 50vw, 100vw" />
            ) : (
              <motion.div className="absolute inset-x-[20%] bottom-[7%] top-[9%]" style={{ rotateY: rotY, rotateX: rotX }}>
                <div className="animate-floaty h-full w-full">
                  <Bottle color={p.color} shape={p.bottle} className="h-full w-full drop-shadow-[0_50px_50px_rgba(0,0,0,0.55)]" title={`${p.name} perfume bottle`} />
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {slides > 1 && (
        <div className="mt-4 flex gap-3">
          {Array.from({ length: slides }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-20 w-16 overflow-hidden rounded-xl border transition-colors ${i === idx ? "border-gold" : "border-white/10 hover:border-white/30"}`}
              style={{ background: "#1a1613" }}
            >
              {i < p.images.length ? <ProductImage product={p} index={i} sizes="64px" /> : <Bottle color={p.color} shape={p.bottle} className="h-full w-full p-1" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

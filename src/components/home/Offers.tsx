"use client";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import ProductImage from "@/components/ProductImage";
import { WhatsAppIcon } from "@/components/icons";
import type { Product, Settings } from "@/lib/types";
import { buyMessage, discountPct, finalPrice, money, whatsappLink } from "@/lib/format";

// Vertical scroll drives a horizontal gallery of offers, with spring smoothing.
export default function Offers({ products, settings, siteUrl }: { products: Product[]; settings: Settings; siteUrl: string }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 22, mass: 0.5 });
  const x = useTransform(p, (v) => -v * distance);
  const progress = useTransform(p, [0, 1], ["0%", "100%"]);

  useLayoutEffect(() => {
    const measure = () => {
      if (track.current) setDistance(Math.max(0, track.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  if (!products.length) return null;

  return (
    <section id="offers" ref={section} className="relative bg-cream text-ink" style={{ height: `${100 + products.length * 45}vh` }} aria-labelledby="offers-title">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <motion.div ref={track} className="flex w-max items-stretch gap-6 px-5 md:gap-10 md:px-16" style={{ x }}>
          <div className="flex w-[80vw] shrink-0 flex-col justify-center md:w-[34vw]">
            <p className="eyebrow !text-[#8a6a36]">Limited time</p>
            <h2 id="offers-title" className="mt-5 font-display text-6xl leading-[0.95] md:text-8xl">
              Special <em className="text-[#8a6a36]">offers</em>
            </h2>
            <p className="mt-6 max-w-sm text-ink/60">Signature fragrances at festive prices, while stock lasts. Keep scrolling to explore.</p>
            <div className="mt-10 flex items-center gap-3 text-xs tracking-[0.2em] text-ink/50 uppercase">
              <span>Scroll</span>
              <span className="h-px w-24 bg-ink/15"><motion.span className="block h-px bg-ink" style={{ width: progress }} /></span>
            </div>
          </div>
          {products.map((p, i) => (
            <article key={p.id} className="group relative flex h-[70svh] w-[80vw] shrink-0 flex-col overflow-hidden rounded-[32px] bg-ink text-cream md:w-[38vw]">
              <Link href={`/products/${p.slug}`} data-cursor="View" className="relative flex-1 overflow-hidden" style={{ background: `radial-gradient(90% 70% at 50% 90%, ${p.color}aa, transparent 70%), #15110e` }} aria-label={p.name}>
                <span className="absolute left-6 top-6 z-10 font-display text-7xl text-gold-2 md:text-8xl">-{discountPct(p)}%</span>
                <span className="absolute right-6 top-8 z-10 text-xs tracking-[0.2em] text-cream/50">0{i + 1}</span>
                <div className={`absolute ${p.images.length ? "inset-0" : "inset-x-[22%] bottom-[4%] top-[18%]"} transition-transform duration-[1.2s] ease-luxe group-hover:-translate-y-3 group-hover:rotate-[-3deg]`}>
                  <ProductImage product={p} className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]" sizes="40vw" />
                </div>
              </Link>
              <div className="flex items-end justify-between gap-4 p-6">
                <div>
                  <h3 className="font-display text-3xl">{p.name}</h3>
                  <p className="mt-1 flex items-baseline gap-2">
                    <span className="text-gold-2">{money(finalPrice(p), settings)}</span>
                    <span className="text-sm text-muted line-through">{money(p.price, settings)}</span>
                  </p>
                </div>
                <a href={whatsappLink(settings, buyMessage(p, settings, `${siteUrl}/products/${p.slug}`))} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-5 py-3 text-xs font-semibold tracking-[0.12em] text-ink uppercase transition-transform hover:scale-105">
                  <WhatsAppIcon className="h-4 w-4" /> Buy now
                </a>
              </div>
            </article>
          ))}
          <div className="w-[5vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}

"use client";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import Bottle from "@/components/Bottle";
import Magnetic from "@/components/motion/Magnetic";
import { onPreloaded } from "@/components/motion/Preloader";
import { gsap, prefersReducedMotion } from "@/components/motion/gsap";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";
import type { Product } from "@/lib/types";

const floaters = [
  { x: "8%", y: "22%", s: 46, d: 0.6, kind: "petal", c: "#c9737f", r: -20 },
  { x: "84%", y: "18%", s: 34, d: 1.2, kind: "leaf", c: "#7b8a52", r: 30 },
  { x: "78%", y: "72%", s: 58, d: 0.9, kind: "petal", c: "#c8a46a", r: 60 },
  { x: "14%", y: "78%", s: 28, d: 1.5, kind: "drop", c: "#e9d3a3", r: 0 },
  { x: "56%", y: "12%", s: 22, d: 1.8, kind: "drop", c: "#c8a46a", r: 0 },
  { x: "92%", y: "46%", s: 26, d: 0.4, kind: "leaf", c: "#c8a46a", r: -40 },
];

function Floater({ f, mx, my }: { f: (typeof floaters)[number]; mx: MotionValue<number>; my: MotionValue<number> }) {
  const x = useTransform(mx, (v) => v * 80 * f.d);
  const y = useTransform(my, (v) => v * 80 * f.d);
  const path =
    f.kind === "petal"
      ? "M12 2C6 6 4 14 12 22c8-8 6-16 0-20z"
      : f.kind === "leaf"
        ? "M3 21C3 9 11 3 21 3c0 10-6 18-18 18zM3 21 15 9"
        : "M12 2s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13z";
  return (
    <motion.div className="hero-floater absolute" style={{ left: f.x, top: f.y, x, y }}>
      <div className="animate-floaty" style={{ animationDelay: `${f.d * -3}s`, animationDuration: `${6 + f.d * 3}s` }}>
        <svg viewBox="0 0 24 24" width={f.s} height={f.s} style={{ rotate: `${f.r}deg`, filter: `blur(${f.d > 1.4 ? 2 : 0}px)` }}>
          <path d={path} fill={f.c} fillOpacity=".55" stroke={f.c} strokeOpacity=".8" strokeWidth=".6" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Hero({ product, whatsappHref, video }: { product?: Product; whatsappHref: string; video?: string }) {
  const root = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const bottleX = useTransform(smx, (v) => v * -40);
  const bottleY = useTransform(smy, (v) => v * -30);
  const bottleRotY = useTransform(smx, (v) => v * 25);
  const bottleRotX = useTransform(smy, (v) => v * -15);
  const bgX = useTransform(smx, (v) => v * 30);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.set(".hero-char", { yPercent: 115, rotate: 6 });
      gsap.set(".hero-fade", { opacity: 0, y: 24 });
      gsap.set(".hero-bottle", { scale: 0.6, opacity: 0, y: 120 });
      gsap.set(".hero-ring", { scale: 0.4, opacity: 0 });
      gsap.set(".hero-floater", { opacity: 0, scale: 0 });

      // Scroll: content drifts up and fades, the bottle sinks and turns.
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: 1 } })
        .to(".hero-content", { yPercent: -35, opacity: 0, ease: "none" }, 0)
        .to(".hero-bottle-wrap", { yPercent: 30, rotate: 12, scale: 0.85, ease: "none" }, 0)
        .to(".hero-giant", { xPercent: -20, ease: "none" }, 0)
        .to(".hero-ring", { rotate: 120, scale: 1.4, ease: "none" }, 0);
    }, el);

    const off = onPreloaded(() => {
      ctx.add(() => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(".hero-ring", { scale: 1, opacity: 1, duration: 2 }, 0)
          .to(".hero-bottle", { scale: 1, opacity: 1, y: 0, duration: 1.8, ease: "elastic.out(1, 0.6)" }, 0.1)
          .to(".hero-char", { yPercent: 0, rotate: 0, duration: 1.3, stagger: 0.025 }, 0.2)
          .to(".hero-fade", { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 }, 0.7)
          .to(".hero-floater", { opacity: 1, scale: 1, duration: 1.4, stagger: 0.08, ease: "back.out(2)" }, 0.6);
      });
    });
    return () => {
      off();
      ctx.revert();
    };
  }, []);

  const lines = [
    { text: "Luxury perfumes,", cls: "", char: "" },
    { text: "slowly made.", cls: "italic", char: "text-gold-gradient pr-[0.06em]" },
  ];

  return (
    <section
      ref={root}
      className="grain relative flex min-h-[100svh] items-center overflow-hidden bg-ink pb-16 pt-40 md:pb-0 md:pt-24"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set(e.clientX / window.innerWidth - 0.5);
        my.set(e.clientY / window.innerHeight - 0.5);
      }}
      aria-labelledby="hero-title"
    >
      {video ? (
        <>
          <video className="absolute inset-0 h-full w-full object-cover" src={video} autoPlay muted loop playsInline preload="metadata" aria-hidden />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
        </>
      ) : (
        <motion.div aria-hidden className="absolute inset-0" style={{ x: bgX }}>
          <div className="animate-blob absolute left-[45%] top-[10%] h-[55vw] w-[55vw] rounded-full blur-[120px]" style={{ background: `${product?.color ?? "#4a2516"}88` }} />
          <div className="animate-blob absolute -left-[10%] bottom-[-20%] h-[45vw] w-[45vw] rounded-full bg-gold/25 blur-[120px]" style={{ animationDelay: "-6s" }} />
        </motion.div>
      )}

      <p aria-hidden className="hero-giant pointer-events-none absolute bottom-[4%] left-0 whitespace-nowrap font-display text-[30vw] leading-none text-white/[0.03]">
        Maison Élan · Maison Élan
      </p>

      {!video && floaters.map((f, i) => <Floater key={i} f={f} mx={smx} my={smy} />)}

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="hero-content relative z-10 md:col-span-7">
          <p className="hero-fade eyebrow mb-6">Eau de parfum · Oud · Amber · Floral</p>
          <h1 id="hero-title" className="font-display text-[15vw] leading-[0.92] text-cream sm:text-7xl lg:text-[7.5rem]">
            <span className="sr-only">Luxury perfumes, slowly made.</span>
            {lines.map((l, li) => (
              <span key={li} className={`block ${l.cls}`} aria-hidden>
                {l.text.split(" ").map((word, wi, arr) => (
                  <span key={wi} className="inline-block whitespace-nowrap">
                    {word.split("").map((ch, i) => (
                      <span key={i} className="split-line">
                        <span className={`hero-char split-inner ${l.char}`}>{ch}</span>
                      </span>
                    ))}
                    {wi < arr.length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </span>
            ))}
          </h1>
          <p className="hero-fade mt-8 max-w-md text-base leading-relaxed text-cream/70 md:text-lg">
            Rare oud, Bulgarian rose and golden amber, aged for 90 days and bottled by hand. Find the scent people remember you by.
          </p>
          <div className="hero-fade mt-10 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link href="/products" className="group inline-flex items-center gap-3 rounded-full bg-cream px-7 py-4 text-sm font-semibold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-gold">
                Explore collection
                <span className="transition-transform duration-500 ease-luxe group-hover:translate-x-1"><ArrowIcon /></span>
              </Link>
            </Magnetic>
            <Magnetic>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-7 py-4 text-sm tracking-[0.12em] text-cream uppercase transition-colors hover:border-gold hover:text-gold">
                <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
              </a>
            </Magnetic>
          </div>
        </div>

        {!video && (
          <div className="hero-bottle-wrap relative mx-auto h-[56vh] w-full max-w-[420px] md:col-span-5 md:h-[72vh]">
            <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="hero-ring aspect-square w-[115%] shrink-0">
              <svg viewBox="0 0 200 200" className="h-full w-full animate-[spin_40s_linear_infinite]">
                <circle cx="100" cy="100" r="96" fill="none" stroke="#c8a46a" strokeOpacity=".35" strokeWidth=".4" />
                <circle cx="100" cy="100" r="80" fill="none" stroke="#c8a46a" strokeOpacity=".2" strokeWidth=".3" strokeDasharray="2 4" />
                <path id="ringtext" d="M100,100 m-88,0 a88,88 0 1,1 176,0 a88,88 0 1,1 -176,0" fill="none" />
                <text fontSize="6" letterSpacing="4" fill="#c8a46a" fillOpacity=".7">
                  <textPath href="#ringtext">EXTRAIT DE PARFUM · AGED 90 DAYS · HAND FINISHED · MAISON ÉLAN ·</textPath>
                </text>
              </svg>
            </div>
            </div>
            <motion.div className="hero-bottle absolute inset-0 [perspective:800px]" style={{ x: bottleX, y: bottleY }}>
              <motion.div className="animate-floaty h-full w-full" style={{ rotateY: bottleRotY, rotateX: bottleRotX }}>
                <Bottle color={product?.color} shape={product?.bottle ?? "facet"} className="h-full w-full drop-shadow-[0_50px_60px_rgba(0,0,0,0.6)]" title={product ? `${product.name} perfume bottle` : "Perfume bottle"} />
              </motion.div>
            </motion.div>
            {product && (
              <Link href={`/products/${product.slug}`} className="hero-fade absolute -bottom-2 right-0 rounded-2xl border border-white/10 bg-ink/60 px-5 py-3 backdrop-blur-md md:right-[-10%]">
                <span className="block text-[10px] tracking-[0.2em] text-gold uppercase">Signature</span>
                <span className="font-display text-xl text-cream">{product.name}</span>
              </Link>
            )}
          </div>
        )}
      </div>

      <div className="hero-fade absolute inset-x-0 bottom-8 hidden flex-col items-center gap-3 md:flex" aria-hidden>
        <span className="text-[10px] tracking-[0.3em] text-cream/50 uppercase">Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-white/15">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-gold" style={{ animation: "scrollcue 1.8s cubic-bezier(.65,0,.35,1) infinite" }} />
        </span>
      </div>
    </section>
  );
}

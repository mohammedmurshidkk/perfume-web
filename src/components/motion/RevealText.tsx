"use client";
import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "./gsap";

type Props = {
  text: string;
  id?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  // "scroll": reveal when it enters the viewport; "scrub": tied to scroll position (word fill effect)
  mode?: "scroll" | "scrub";
};

// Splits text into words, each masked, then slides them up with a stagger.
export default function RevealText({ text, id, as = "h2", className, delay = 0, stagger = 0.06, mode = "scroll" }: Props) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    const words = el.querySelectorAll<HTMLElement>(".split-inner");
    const ctx = gsap.context(() => {
      if (mode === "scrub") {
        gsap.set(words, { opacity: 0.15 });
        gsap.to(words, {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 85%", end: "bottom 45%", scrub: true },
        });
      } else {
        gsap.set(words, { yPercent: 110, rotate: 4 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 88%",
          once: true,
          onEnter: () =>
            gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.1, ease: "expo.out", stagger, delay }),
        });
      }
    }, el);
    return () => ctx.revert();
  }, [delay, stagger, mode]);

  const words = text.split(" ");
  const Tag = as;
  return (
    <Tag ref={ref as React.Ref<never>} id={id} className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} className="split-line" aria-hidden>
          <span className="split-inner">{w}</span>
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Tag>
  );
}

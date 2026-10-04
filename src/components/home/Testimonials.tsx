import RevealText from "@/components/motion/RevealText";
import Reveal from "@/components/motion/Reveal";
import CountUp from "@/components/motion/CountUp";
import { StarIcon } from "@/components/icons";
import type { Testimonial } from "@/lib/types";

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="mx-3 w-[320px] shrink-0 rounded-3xl border border-white/10 bg-ink-2 p-7 md:w-[400px]">
      <div className="flex gap-1 text-gold" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < t.rating} />)}
      </div>
      <blockquote className="mt-5 font-display text-xl leading-snug text-cream/90 md:text-2xl">“{t.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold/15 font-display text-lg text-gold">{t.name[0]}</span>
        <span>
          <span className="block text-sm text-cream">{t.name} · {t.location}</span>
          <span className="block text-xs text-muted">Wears {t.product}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items.length) return null;
  const avg = items.reduce((s, t) => s + t.rating, 0) / items.length;
  const half = Math.ceil(items.length / 2);
  const rows = [items.slice(0, half), items.slice(half).length ? items.slice(half) : items];
  return (
    <section id="reviews" className="relative overflow-hidden bg-ink py-24 md:py-36" aria-labelledby="reviews-title">
      <div className="mx-auto mb-16 flex max-w-7xl flex-col justify-between gap-8 px-5 md:flex-row md:items-end md:px-8">
        <div>
          <p className="eyebrow mb-5">Testimonials</p>
          <RevealText as="h2" id="reviews-title" text="Loved on skin, remembered in rooms." className="max-w-3xl font-display text-5xl leading-[1.02] text-cream md:text-7xl" />
        </div>
        <Reveal className="text-right">
          <p className="font-display text-7xl text-gold-2"><CountUp to={avg} decimals={1} /></p>
          <p className="text-xs tracking-[0.2em] text-muted uppercase">Average from {items.length}+ reviews</p>
        </Reveal>
      </div>
      <div className="space-y-6 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
        {rows.map((row, r) => (
          <div key={r} className="marquee flex overflow-hidden">
            <div className={`marquee-track flex w-max ${r % 2 ? "reverse" : ""}`} style={{ ["--marquee-duration" as string]: `${45 + r * 10}s` }}>
              {[...row, ...row, ...row, ...row].map((t, i) => (
                <div key={`${t.id}-${i}`} aria-hidden={i >= row.length}>
                  <Card t={t} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

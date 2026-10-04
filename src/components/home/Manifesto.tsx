import RevealText from "@/components/motion/RevealText";
import VelocityMarquee from "@/components/motion/VelocityMarquee";
import CountUp from "@/components/motion/CountUp";
import Reveal from "@/components/motion/Reveal";

const notes = ["Oud", "Saffron", "Rose", "Amber", "Sandalwood", "Musk", "Neroli", "Vanilla"];

export default function Manifesto() {
  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-36" aria-labelledby="manifesto-title">
      <VelocityMarquee className="border-y border-white/10 py-6" baseVelocity={-1.5}>
        {notes.map((n) => (
          <span key={n} className="flex items-center">
            <span className="px-8 font-display text-6xl italic text-transparent md:text-8xl" style={{ WebkitTextStroke: "1px rgba(233,211,163,0.55)" }}>
              {n}
            </span>
            <span className="text-2xl text-gold">✦</span>
          </span>
        ))}
      </VelocityMarquee>

      <div className="mx-auto mt-24 max-w-6xl px-5 md:mt-36 md:px-8">
        <p className="eyebrow mb-8">Our philosophy</p>
        <h2 id="manifesto-title" className="sr-only">Our perfume philosophy</h2>
        <RevealText
          as="p"
          mode="scrub"
          className="font-display text-4xl leading-[1.15] text-cream md:text-6xl"
          text="We believe a fragrance should be felt before it is noticed. Every Maison Élan perfume begins with rare raw materials, rests for ninety days, and is finished by hand, so it unfolds on your skin for hours, not minutes."
        />
        <div className="mt-20 grid grid-cols-2 gap-10 border-t border-white/10 pt-10 md:grid-cols-4">
          {[
            { n: 90, s: "", l: "Days of maceration" },
            { n: 12, s: "h+", l: "Lasting on skin" },
            { n: 38, s: "", l: "Rare ingredients" },
            { n: 4.9, s: "★", l: "Average rating", d: 1 },
          ].map((s, i) => (
            <Reveal key={s.l} delay={i * 0.08}>
              <p className="font-display text-5xl text-gold-2 md:text-6xl">
                <CountUp to={s.n} suffix={s.s} decimals={s.d ?? 0} />
              </p>
              <p className="mt-2 text-xs tracking-[0.2em] text-muted uppercase">{s.l}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

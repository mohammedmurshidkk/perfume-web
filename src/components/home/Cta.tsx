import Link from "next/link";
import Bottle from "@/components/Bottle";
import Magnetic from "@/components/motion/Magnetic";
import Parallax from "@/components/motion/Parallax";
import RevealText from "@/components/motion/RevealText";
import { WhatsAppIcon } from "@/components/icons";
import type { Product } from "@/lib/types";

export default function Cta({ products, whatsappHref }: { products: Product[]; whatsappHref: string }) {
  const [a, b, c] = products;
  return (
    <section className="grain relative overflow-hidden bg-ink py-32 md:py-48" aria-labelledby="cta-title">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {a && <Parallax speed={0.5} className="absolute left-[4%] top-[12%] w-24 md:w-40"><Bottle color={a.color} shape={a.bottle} className="w-full -rotate-12 opacity-80" /></Parallax>}
        {b && <Parallax speed={-0.4} className="absolute right-[6%] top-[8%] w-20 md:w-32"><Bottle color={b.color} shape={b.bottle} className="w-full rotate-12 opacity-70" /></Parallax>}
        {c && <Parallax speed={0.8} className="absolute bottom-[6%] right-[18%] hidden w-28 md:block"><Bottle color={c.color} shape={c.bottle} className="w-full rotate-6 opacity-60" /></Parallax>}
      </div>
      <div className="relative mx-auto max-w-4xl px-5 text-center">
        <p className="eyebrow mb-6">Personal consultation</p>
        <RevealText as="h2" id="cta-title" text="Find your signature scent." className="font-display text-6xl leading-[0.95] text-cream md:text-8xl" />
        <p className="mx-auto mt-8 max-w-lg text-cream/65">Not sure where to start? Tell us what you love and our perfumer will recommend a fragrance for you, right on WhatsApp.</p>
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Magnetic strength={0.5}>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-gold px-9 py-5 text-sm font-semibold tracking-[0.14em] text-ink uppercase">
              <WhatsAppIcon /> Talk to a perfumer
            </a>
          </Magnetic>
          <Magnetic strength={0.5}>
            <Link href="/products" className="inline-flex items-center rounded-full border border-cream/30 px-9 py-5 text-sm tracking-[0.14em] text-cream uppercase hover:border-gold hover:text-gold">
              Browse all
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}

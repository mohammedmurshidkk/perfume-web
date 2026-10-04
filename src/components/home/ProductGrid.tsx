import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";
import { ArrowIcon } from "@/components/icons";
import type { Product, Settings } from "@/lib/types";

export default function ProductGrid({
  id,
  eyebrow,
  title,
  intro,
  products,
  settings,
  siteUrl,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  products: Product[];
  settings: Settings;
  siteUrl: string;
}) {
  if (!products.length) return null;
  return (
    <section id={id} className="relative bg-ink py-24 md:py-32" aria-labelledby={`${id}-title`}>
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="mb-14 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-5">{eyebrow}</p>
            <RevealText as="h2" id={`${id}-title`} text={title} className="font-display text-5xl leading-none text-cream md:text-7xl" />
          </div>
          <Reveal className="max-w-sm">
            <p className="text-cream/60">{intro}</p>
            <Link href="/products" className="group mt-5 inline-flex items-center gap-2 text-sm tracking-[0.14em] text-gold uppercase">
              View all perfumes <span className="transition-transform group-hover:translate-x-1"><ArrowIcon /></span>
            </Link>
          </Reveal>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p, i) => (
            <Reveal key={p.id} delay={(i % 4) * 0.1} y={70}>
              <ProductCard product={p} settings={settings} siteUrl={siteUrl} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

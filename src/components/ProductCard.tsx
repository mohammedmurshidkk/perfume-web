"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Product, Settings } from "@/lib/types";
import { buyMessage, discountPct, finalPrice, money, onOffer, stockLabel, whatsappLink } from "@/lib/format";
import TiltCard from "./motion/TiltCard";
import ProductImage from "./ProductImage";
import { WhatsAppIcon } from "./icons";

export default function ProductCard({
  product: p,
  settings,
  siteUrl,
  priority,
}: {
  product: Product;
  settings: Settings;
  siteUrl: string;
  priority?: boolean;
}) {
  const stock = stockLabel(p);
  const href = `/products/${p.slug}`;
  const hasPhoto = p.images.length > 0;
  return (
    <TiltCard className="group rounded-[28px]">
      <article className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-2">
        <Link href={href} data-cursor="View" className="block" aria-label={`${p.name}, ${p.tagline}`}>
          <div
            className="relative aspect-[4/5] overflow-hidden"
            style={{ background: `radial-gradient(120% 80% at 50% 100%, ${p.color}55 0%, transparent 60%), linear-gradient(180deg, #1f1a16, #120f0d)` }}
          >
            <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
              {p.bestSeller && <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-ink uppercase">Best seller</span>}
              {onOffer(p) && <span className="rounded-full bg-cream px-3 py-1 text-[10px] font-semibold tracking-[0.14em] text-ink uppercase">-{discountPct(p)}%</span>}
              {stock.tone === "out" && <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] tracking-[0.14em] text-cream uppercase backdrop-blur">Sold out</span>}
            </div>
            {hasPhoto ? (
              <div className="absolute inset-0 transition-transform duration-[1.2s] ease-luxe group-hover:scale-105">
                <ProductImage product={p} priority={priority} />
              </div>
            ) : (
              <motion.div
                className="absolute inset-x-[18%] bottom-[6%] top-[10%]"
                whileHover={{ y: -14, rotate: -3 }}
                transition={{ type: "spring", stiffness: 200, damping: 12 }}
              >
                <ProductImage product={p} className="h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]" />
              </motion.div>
            )}
          </div>
          <div className="space-y-1 p-5 pb-3">
            <p className="text-[11px] tracking-[0.2em] text-muted uppercase">{p.category} · {p.sizeMl}ml</p>
            <h3 className="font-display text-2xl text-cream">{p.name}</h3>
            <p className="line-clamp-1 text-sm text-cream/60">{p.tagline}</p>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-3 px-5 pb-5">
          <p className="flex items-baseline gap-2">
            <span className="text-lg text-gold-2">{money(finalPrice(p), settings)}</span>
            {onOffer(p) && <span className="text-sm text-muted line-through">{money(p.price, settings)}</span>}
          </p>
          <a
            href={whatsappLink(settings, buyMessage(p, settings, `${siteUrl}${href}`))}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-[11px] font-semibold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-gold"
            aria-label={`Buy ${p.name} on WhatsApp`}
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> {stock.tone === "out" ? "Enquire" : "Buy"}
          </a>
        </div>
      </article>
    </TiltCard>
  );
}

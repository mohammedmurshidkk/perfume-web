import Link from "next/link";
import type { Product, Settings } from "@/lib/types";
import { buyMessage, discountPct, finalPrice, money, onOffer, stockLabel, whatsappLink } from "@/lib/format";
import ProductImage from "@/components/ProductImage";
import { WhatsAppIcon } from "@/components/icons";

export default function ShopProductCard({ product: p, settings, siteUrl, priority }: { product: Product; settings: Settings; siteUrl: string; priority?: boolean }) {
  const href = `/products/${p.slug}`;
  const out = stockLabel(p).tone === "out";
  return (
    <article className="flex h-full flex-col">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-[#f5f3f0]">
        {onOffer(p) && <span className="absolute left-3 top-3 z-10 bg-[#c0392b] px-2 py-1 text-[11px] font-medium text-white">-{discountPct(p)}%</span>}
        {out && <span className="absolute right-3 top-3 z-10 bg-neutral-800 px-2 py-1 text-[11px] font-medium text-white">Sold out</span>}
        {p.images.length ? (
          <ProductImage product={p} priority={priority} />
        ) : (
          <div className="absolute inset-x-[22%] inset-y-[8%]">
            <ProductImage product={p} className="h-full w-full" />
          </div>
        )}
      </Link>
      <div className="flex flex-1 flex-col pt-3 text-center">
        <p className="text-xs tracking-wide text-neutral-500 uppercase">{p.category} · {p.gender}</p>
        <h3 className="mt-1 text-base font-medium">
          <Link href={href} className="hover:text-[#a37e4c]">{p.name} – {p.sizeMl}ml</Link>
        </h3>
        <p className="mt-1 flex items-baseline justify-center gap-2">
          {onOffer(p) && <span className="text-sm text-neutral-400 line-through">{money(p.price, settings)}</span>}
          <span className="font-semibold">{money(finalPrice(p), settings)}</span>
        </p>
        <a
          href={whatsappLink(settings, buyMessage(p, settings, `${siteUrl}${href}`))}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Buy ${p.name} on WhatsApp`}
          className="btn-dark mt-3 w-full !py-2.5"
        >
          <WhatsAppIcon className="h-4 w-4" /> {out ? "Enquire" : "Buy Now"}
        </a>
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import ProductsBrowser from "@/components/products/ProductsBrowser";
import RevealText from "@/components/motion/RevealText";
import JsonLd from "@/components/JsonLd";
import { getProducts, getSettings } from "@/lib/db";
import { CATEGORIES } from "@/lib/types";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop All Perfumes | Oud, Amber, Floral & Fresh Fragrances",
  description:
    "Browse the full Maison Élan collection of long lasting oud, amber, woody, floral and fresh perfumes. Compare notes, sizes and prices, then order on WhatsApp.",
  alternates: { canonical: "/products" },
  openGraph: { title: `All perfumes | ${site.name}`, url: `${site.url}/products` },
};

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const sp = await searchParams;
  const cat = typeof sp.category === "string" && (CATEGORIES as readonly string[]).includes(sp.category) ? sp.category : "All";
  const q = typeof sp.q === "string" ? sp.q : "";
  const [products, settings] = await Promise.all([getProducts(), getSettings()]);

  return (
    <section className="mx-auto max-w-7xl px-5 pb-32 pt-36 md:px-8 md:pt-44">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Maison Élan perfume collection",
          itemListElement: products.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/products/${p.slug}`, name: p.name })),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-8 text-xs tracking-[0.2em] text-muted uppercase">
        <Link href="/" className="hover:text-gold">Home</Link> <span className="mx-2">/</span> <span className="text-cream">Collection</span>
      </nav>
      <div className="mb-14 grid gap-8 md:grid-cols-2 md:items-end">
        <RevealText as="h1" text="The collection" className="font-display text-6xl leading-none text-cream md:text-8xl" />
        <p className="max-w-md text-cream/60 md:justify-self-end">
          Every fragrance in the Maison Élan collection, from smoky ouds to sunlit citrus. Filter by family, search by note, and tap Buy to order on WhatsApp.
        </p>
      </div>
      <ProductsBrowser products={products} settings={settings} siteUrl={site.url} initialCategory={cat} initialQuery={q} />
    </section>
  );
}

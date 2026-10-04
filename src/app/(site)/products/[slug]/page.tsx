import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductGallery from "@/components/products/ProductGallery";
import Meter from "@/components/products/Meter";
import ProductCard from "@/components/ProductCard";
import Magnetic from "@/components/motion/Magnetic";
import Reveal from "@/components/motion/Reveal";
import RevealText from "@/components/motion/RevealText";
import JsonLd from "@/components/JsonLd";
import { WhatsAppIcon } from "@/components/icons";
import { getProductBySlug, getProducts, getSettings } from "@/lib/db";
import { buyMessage, discountPct, finalPrice, money, onOffer, stockLabel, whatsappLink } from "@/lib/format";
import { site } from "@/lib/site";

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Perfume not found" };
  const title = `${p.name} ${p.sizeMl}ml | ${p.category} Perfume for ${p.gender === "Unisex" ? "Men & Women" : p.gender}`;
  const description = `${p.tagline} ${p.name} by ${site.name}: notes of ${[...p.notes.top, ...p.notes.heart, ...p.notes.base].slice(0, 5).join(", ")}. Long lasting ${p.category.toLowerCase()} fragrance. Order on WhatsApp.`;
  return {
    title,
    description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { title, description, url: `${site.url}/products/${p.slug}`, type: "website", images: p.images[0] ? [{ url: p.images[0] }] : undefined },
  };
}

export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const { slug } = await params;
  const [p, settings, all] = await Promise.all([getProductBySlug(slug), getSettings(), getProducts()]);
  if (!p) notFound();

  const url = `${site.url}/products/${p.slug}`;
  const stock = stockLabel(p);
  const buy = whatsappLink(settings, buyMessage(p, settings, url));
  const ask = whatsappLink(settings, `Hi! I have a question about ${p.name} (${p.sizeMl}ml).\n${url}`);
  const related = all.filter((x) => x.id !== p.id).sort((a, b) => Number(b.category === p.category) - Number(a.category === p.category)).slice(0, 4);

  const pyramid = [
    { k: "Top", v: p.notes.top, d: "First 15 minutes" },
    { k: "Heart", v: p.notes.heart, d: "2 to 4 hours" },
    { k: "Base", v: p.notes.base, d: "The lasting trail" },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "Product",
            name: p.name,
            description: p.description,
            sku: p.id.toUpperCase(),
            category: `${p.category} perfume`,
            brand: { "@type": "Brand", name: site.name },
            image: p.images.length ? p.images.map((i) => (i.startsWith("http") ? i : `${site.url}${i}`)) : [`${url}/opengraph-image`],
            offers: {
              "@type": "Offer",
              url,
              priceCurrency: settings.currencyCode,
              price: finalPrice(p),
              availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              itemCondition: "https://schema.org/NewCondition",
              seller: { "@type": "Organization", name: site.name },
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: site.url },
              { "@type": "ListItem", position: 2, name: "Collection", item: `${site.url}/products` },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          },
        ]}
      />
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8 md:pt-40">
        <nav aria-label="Breadcrumb" className="mb-10 text-xs tracking-[0.2em] text-muted uppercase">
          <Link href="/" className="hover:text-gold">Home</Link> <span className="mx-2">/</span>
          <Link href="/products" className="hover:text-gold">Collection</Link> <span className="mx-2">/</span>
          <span className="text-cream">{p.name}</span>
        </nav>
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="md:sticky md:top-28 md:self-start">
            <ProductGallery product={p} />
          </div>
          <div>
            <Reveal>
              <p className="eyebrow">{p.category} · {p.gender} · {p.sizeMl}ml</p>
            </Reveal>
            <RevealText as="h1" text={p.name} className="mt-4 font-display text-6xl leading-none text-cream md:text-7xl" />
            <Reveal delay={0.1}>
              <p className="mt-4 font-display text-2xl italic text-cream/70">{p.tagline}</p>
              <div className="mt-8 flex flex-wrap items-baseline gap-3">
                <span className="text-4xl text-gold-2">{money(finalPrice(p), settings)}</span>
                {onOffer(p) && (
                  <>
                    <span className="text-lg text-muted line-through">{money(p.price, settings)}</span>
                    <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">Save {discountPct(p)}%</span>
                  </>
                )}
              </div>
              <p className={`mt-3 flex items-center gap-2 text-sm ${stock.tone === "out" ? "text-red-300" : stock.tone === "low" ? "text-amber-300" : "text-emerald-300"}`}>
                <span className="relative flex h-2 w-2">
                  {stock.tone !== "out" && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />}
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
                </span>
                {stock.text}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-4">
                <Magnetic strength={0.3}>
                  <a href={buy} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-full bg-gold px-9 py-5 text-sm font-semibold tracking-[0.14em] text-ink uppercase shadow-[0_20px_60px_-15px_rgba(200,164,106,0.6)] transition-colors hover:bg-gold-2">
                    <WhatsAppIcon /> {stock.tone === "out" ? "Enquire on WhatsApp" : "Buy on WhatsApp"}
                  </a>
                </Magnetic>
                <a href={ask} target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-cream/25 px-7 py-5 text-sm tracking-[0.14em] text-cream uppercase hover:border-gold hover:text-gold">
                  Ask a question
                </a>
              </div>
              <p className="mt-4 text-xs text-muted">Tapping Buy opens WhatsApp with this perfume&apos;s details filled in. No account or payment needed here.</p>
            </Reveal>

            <Reveal delay={0.1} className="mt-14 border-t border-white/10 pt-10">
              <h2 className="eyebrow mb-4">About this fragrance</h2>
              <p className="text-lg leading-relaxed text-cream/75">{p.description}</p>
            </Reveal>

            <div className="mt-12">
              <h2 className="eyebrow mb-6">Scent pyramid</h2>
              <ol className="space-y-3">
                {pyramid.map((n, i) => (
                  <Reveal key={n.k} delay={i * 0.1} y={30}>
                    <li className="flex items-center justify-between gap-6 rounded-2xl border border-white/10 bg-ink-2 px-6 py-5">
                      <div>
                        <p className="font-display text-2xl text-cream">{n.k} notes</p>
                        <p className="text-xs text-muted">{n.d}</p>
                      </div>
                      <p className="text-right text-gold-2">{n.v.join(" · ")}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <Meter label="Longevity" value={p.longevity} words={["Light", "Moderate", "Long", "Very long", "Exceptional"]} />
              <Meter label="Projection" value={p.sillage} words={["Intimate", "Soft", "Moderate", "Strong", "Room filling"]} />
            </div>

            {p.features.length > 0 && (
              <div className="mt-12">
                <h2 className="eyebrow mb-6">Features</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {p.features.map((f, i) => (
                    <Reveal key={f} delay={i * 0.06} y={20}>
                      <li className="flex gap-3 text-cream/80"><span className="mt-1.5 text-gold">✦</span>{f}</li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-white/10 py-24" aria-labelledby="related-title">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <RevealText as="h2" id="related-title" text="You may also love" className="mb-12 font-display text-5xl text-cream md:text-6xl" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r, i) => (
                <Reveal key={r.id} delay={i * 0.08} y={60}>
                  <ProductCard product={r} settings={settings} siteUrl={site.url} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

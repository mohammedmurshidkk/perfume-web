import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductPhotos from "@/components/shop/ProductPhotos";
import ShopProductCard from "@/components/shop/ShopProductCard";
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
    { k: "Top", v: p.notes.top },
    { k: "Heart", v: p.notes.heart },
    { k: "Base", v: p.notes.base },
  ];
  const longevityWords = ["Light", "Moderate", "Long lasting", "Very long lasting", "Exceptional (12h+)"];
  const sillageWords = ["Intimate", "Soft", "Moderate", "Strong", "Room filling"];

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
              { "@type": "ListItem", position: 2, name: "Shop", item: `${site.url}/products` },
              { "@type": "ListItem", position: 3, name: p.name, item: url },
            ],
          },
        ]}
      />
      <div className="container-shop py-6">
        <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-black">Home</Link> <span className="mx-1">/</span>
          <Link href="/products" className="hover:text-black">Shop</Link> <span className="mx-1">/</span>
          <Link href={`/products?category=${p.category}`} className="hover:text-black">{p.category}</Link> <span className="mx-1">/</span>
          <span className="text-black">{p.name}</span>
        </nav>
      </div>

      <section className="container-shop grid gap-10 pb-14 md:grid-cols-2 md:gap-14">
        <ProductPhotos product={p} />
        <div>
          <h1 className="text-3xl font-medium md:text-4xl">{p.name} – {p.sizeMl}ml</h1>
          <p className="mt-2 text-neutral-600">{p.tagline}</p>
          <p className="mt-5 flex flex-wrap items-baseline gap-3">
            {onOffer(p) && <span className="text-lg text-neutral-400 line-through">{money(p.price, settings)}</span>}
            <span className="text-3xl font-semibold">{money(finalPrice(p), settings)}</span>
            {onOffer(p) && <span className="bg-[#c0392b] px-2 py-1 text-xs font-medium text-white">Save {discountPct(p)}%</span>}
          </p>
          <p className={`mt-3 text-sm font-medium ${stock.tone === "out" ? "text-[#c0392b]" : stock.tone === "low" ? "text-amber-600" : "text-[#1f9d55]"}`}>{stock.text}</p>

          <p className="mt-6 leading-relaxed text-neutral-700">{p.description}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href={buy} target="_blank" rel="noopener noreferrer" className="btn-wa flex-1">
              <WhatsAppIcon className="h-5 w-5" /> {stock.tone === "out" ? "Enquire on WhatsApp" : "Buy Now on WhatsApp"}
            </a>
            <a href={ask} target="_blank" rel="noopener noreferrer" className="btn-line">Ask a question</a>
          </div>
          <p className="mt-3 text-xs text-neutral-500">Tapping Buy opens WhatsApp with this product&apos;s details filled in. Our team confirms delivery and payment with you there.</p>

          <dl className="mt-8 space-y-1 border-t border-neutral-200 pt-5 text-sm">
            <div className="flex gap-2"><dt className="text-neutral-500">SKU:</dt><dd>{p.id.toUpperCase()}</dd></div>
            <div className="flex gap-2"><dt className="text-neutral-500">Category:</dt><dd><Link className="hover:underline" href={`/products?category=${p.category}`}>{p.category}</Link>, <Link className="hover:underline" href={`/products?gender=${p.gender}`}>{p.gender}</Link></dd></div>
            <div className="flex gap-2"><dt className="text-neutral-500">Size:</dt><dd>{p.sizeMl}ml</dd></div>
          </dl>
        </div>
      </section>

      <section className="container-shop grid gap-10 border-t border-neutral-200 py-12 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-medium">Fragrance Notes</h2>
          <table className="w-full border border-neutral-200 text-sm">
            <tbody>
              {pyramid.map((n) => (
                <tr key={n.k} className="border-b border-neutral-200 last:border-0">
                  <th scope="row" className="w-32 bg-[#f7f5f2] px-4 py-3 text-left font-medium">{n.k} notes</th>
                  <td className="px-4 py-3">{n.v.join(", ")}</td>
                </tr>
              ))}
              <tr className="border-b border-neutral-200">
                <th scope="row" className="bg-[#f7f5f2] px-4 py-3 text-left font-medium">Longevity</th>
                <td className="px-4 py-3">{longevityWords[p.longevity - 1] ?? "Moderate"}</td>
              </tr>
              <tr>
                <th scope="row" className="bg-[#f7f5f2] px-4 py-3 text-left font-medium">Projection</th>
                <td className="px-4 py-3">{sillageWords[p.sillage - 1] ?? "Moderate"}</td>
              </tr>
            </tbody>
          </table>
        </div>
        {p.features.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-medium">Product Details</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-neutral-700">
              {p.features.map((f) => <li key={f}>{f}</li>)}
            </ul>
          </div>
        )}
      </section>

      {related.length > 0 && (
        <section className="container-shop border-t border-neutral-200 py-12" aria-labelledby="related-title">
          <h2 id="related-title" className="section-title mb-8">Related Products</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 lg:gap-x-6">
            {related.map((r) => <ShopProductCard key={r.id} product={r} settings={settings} siteUrl={site.url} />)}
          </div>
        </section>
      )}
    </>
  );
}

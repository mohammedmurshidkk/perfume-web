import Link from "next/link";
import Bottle from "@/components/Bottle";
import JsonLd from "@/components/JsonLd";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { ChatIcon, ClockIcon, DropIcon, TruckIcon } from "@/components/shop/shopIcons";
import { StarIcon, WhatsAppIcon } from "@/components/icons";
import { getProducts, getSettings, getTestimonials } from "@/lib/db";
import { discountPct, onOffer, whatsappLink } from "@/lib/format";
import { faqs } from "@/lib/faq";
import { site } from "@/lib/site";
import { CATEGORIES, type Product } from "@/lib/types";

const perks = [
  { icon: DropIcon, title: "Premium Oils", text: "High concentration blends" },
  { icon: ClockIcon, title: "Long Lasting", text: "8 to 14 hours on skin" },
  { icon: TruckIcon, title: "Fast Delivery", text: "Across India and the Gulf" },
  { icon: ChatIcon, title: "Order on WhatsApp", text: "Quick, personal service" },
];

function Grid({ products, children }: { products: Product[]; children: (p: Product, i: number) => React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">{products.map(children)}</div>;
}

function SectionHead({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-8 text-center">
      <h2 className="section-title">{title}</h2>
      <span className="mx-auto mt-3 block h-0.5 w-12 bg-[#a37e4c]" />
      {href && <Link href={href} className="mt-3 inline-block text-sm text-neutral-600 underline underline-offset-4 hover:text-black">View all</Link>}
    </div>
  );
}

export default async function HomePage() {
  const [products, settings, testimonials] = await Promise.all([getProducts(), getSettings(), getTestimonials()]);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const newest = [...products].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 8);
  const offers = products.filter(onOffer);
  const maxOff = Math.max(0, ...offers.map(discountPct));
  const heroBottles = (bestSellers.length >= 3 ? bestSellers : products).slice(0, 3);
  const chat = whatsappLink(settings, "Hello! I'd like help choosing a perfume.");
  const genderTiles = [
    { label: "Men", text: "Woody, fresh and bold", href: "/products?gender=Men", p: products.find((p) => p.gender === "Men") },
    { label: "Women", text: "Floral, soft and elegant", href: "/products?gender=Women", p: products.find((p) => p.gender === "Women") },
    { label: "Unisex", text: "Oud, amber and musk", href: "/products?gender=Unisex", p: products.find((p) => p.gender === "Unisex") },
  ];

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: site.url,
            potentialAction: { "@type": "SearchAction", target: `${site.url}/products?q={search_term_string}`, "query-input": "required name=search_term_string" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-[#f3ede4]">
        {site.heroVideo && <video className="absolute inset-0 h-full w-full object-cover opacity-30" src={site.heroVideo} autoPlay muted loop playsInline aria-hidden />}
        <div className="container-shop relative grid grid-cols-1 items-center gap-8 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-sm font-medium tracking-[0.2em] text-[#a37e4c] uppercase">Luxury perfumes</p>
            <h1 className="mt-3 text-4xl font-medium leading-tight md:text-5xl">Long lasting fragrances for every moment</h1>
            <p className="mt-4 max-w-md text-neutral-600">{site.description}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/products" className="btn-dark">Shop Now</Link>
              <a href={chat} target="_blank" rel="noopener noreferrer" className="btn-line">
                <WhatsAppIcon className="h-4 w-4" /> Order on WhatsApp
              </a>
            </div>
          </div>
          <div className="flex h-56 min-w-0 items-end justify-center gap-2 overflow-hidden sm:h-64 md:h-96">
            {heroBottles.map((p, i) => (
              <Bottle key={p.id} color={p.color} shape={p.bottle} className={`${i === 1 ? "h-full" : "h-4/5"} w-auto max-w-[32%]`} title={`${p.name} perfume bottle`} />
            ))}
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-neutral-200">
        <ul className="container-shop grid grid-cols-2 gap-6 py-8 lg:grid-cols-4">
          {perks.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-center gap-3">
              <Icon className="h-8 w-8 shrink-0 text-[#a37e4c]" />
              <div>
                <p className="text-sm font-semibold">{title}</p>
                <p className="text-xs text-neutral-500">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Shop by category */}
      <section className="container-shop py-16">
        <SectionHead title="Shop by Category" />
        <div className="grid gap-4 sm:grid-cols-3">
          {genderTiles.map((t) => (
            <Link key={t.label} href={t.href} className="group relative flex aspect-[4/3] items-end overflow-hidden bg-[#f5f3f0] p-5">
              {t.p && <Bottle color={t.p.color} shape={t.p.bottle} className="absolute right-6 top-6 h-[75%]" />}
              <div className="relative">
                <p className="text-xl font-medium">{t.label}&apos;s Perfumes</p>
                <p className="text-sm text-neutral-600">{t.text}</p>
                <p className="mt-2 text-sm font-medium underline underline-offset-4 group-hover:text-[#a37e4c]">Shop now</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best sellers */}
      {bestSellers.length > 0 && (
        <section className="container-shop pb-16">
          <SectionHead title="Best Sellers" href="/products?filter=best-sellers" />
          <Grid products={bestSellers}>{(p, i) => <ShopProductCard key={p.id} product={p} settings={settings} siteUrl={site.url} priority={i < 4} />}</Grid>
        </section>
      )}

      {/* Promo banners */}
      <section className="container-shop grid gap-4 pb-16 md:grid-cols-2">
        <Link href="/products?filter=offers" className="flex flex-col justify-center bg-[#1a1a1a] p-8 text-white md:p-12">
          <p className="text-sm tracking-[0.2em] text-[#d8b98a] uppercase">Special offer</p>
          <p className="mt-2 text-3xl font-medium">{maxOff ? `Up to ${maxOff}% off` : "Seasonal offers"}</p>
          <p className="mt-2 text-sm text-neutral-300">On selected fragrances, while stock lasts.</p>
          <span className="mt-5 text-sm font-medium underline underline-offset-4">Shop offers</span>
        </Link>
        <Link href="/products?category=Oud" className="flex flex-col justify-center bg-[#efe6d8] p-8 md:p-12">
          <p className="text-sm tracking-[0.2em] text-[#a37e4c] uppercase">Signature collection</p>
          <p className="mt-2 text-3xl font-medium">The Oud Collection</p>
          <p className="mt-2 text-sm text-neutral-600">Rich, smoky and made to last all day.</p>
          <span className="mt-5 text-sm font-medium underline underline-offset-4">Explore oud</span>
        </Link>
      </section>

      {/* New arrivals */}
      <section className="container-shop pb-16">
        <SectionHead title="New Arrivals" href="/products" />
        <Grid products={newest}>{(p) => <ShopProductCard key={p.id} product={p} settings={settings} siteUrl={site.url} />}</Grid>
      </section>

      {/* Fragrance families */}
      <section className="bg-[#f7f5f2] py-14">
        <div className="container-shop">
          <SectionHead title="Shop by Fragrance Family" />
          <ul className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <Link href={`/products?category=${c}`} className="block border border-neutral-300 bg-white px-6 py-3 text-sm font-medium hover:border-black">{c}</Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="container-shop py-16">
          <SectionHead title="What Our Customers Say" />
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.slice(0, 3).map((t) => (
              <figure key={t.id} className="border border-neutral-200 p-6">
                <div className="flex gap-0.5 text-[#e0a526]" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} filled={i < t.rating} />)}
                </div>
                <blockquote className="mt-3 text-sm leading-relaxed text-neutral-700">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold">{t.name}</span>
                  <span className="text-neutral-500">, {t.location}</span>
                  {t.product && <span className="block text-xs text-neutral-500">Bought: {t.product}</span>}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="bg-[#f3ede4]">
        <div className="container-shop grid gap-6 py-14 md:grid-cols-2 md:items-center">
          <h2 className="text-3xl font-medium">About {site.name}</h2>
          <div>
            <p className="leading-relaxed text-neutral-700">
              We make long lasting perfumes from quality oils at honest prices. Every bottle is blended in small batches and checked by hand before it reaches you. Pick a fragrance, tap Buy, and our team confirms your order on WhatsApp.
            </p>
            <Link href="/about" className="btn-line mt-5">Read our story</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shop max-w-3xl py-16">
        <SectionHead title="Frequently Asked Questions" />
        <div className="divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.map((f) => (
            <details key={f.q} className="group py-4">
              <summary className="flex items-center justify-between gap-4 font-medium">
                {f.q}
                <span className="text-xl text-neutral-400 group-open:hidden">+</span>
                <span className="hidden text-xl text-neutral-400 group-open:inline">−</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-neutral-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import ShopProductCard from "@/components/shop/ShopProductCard";
import SortSelect from "@/components/shop/SortSelect";
import { getProducts, getSettings } from "@/lib/db";
import { finalPrice, onOffer } from "@/lib/format";
import { CATEGORIES, GENDERS } from "@/lib/types";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop All Perfumes | Oud, Amber, Floral & Fresh Fragrances",
  description: `Browse the full ${site.name} collection of long lasting oud, amber, woody, floral and fresh perfumes for men and women. Compare notes, sizes and prices, then order on WhatsApp.`,
  alternates: { canonical: "/products" },
  openGraph: { title: `All perfumes | ${site.name}`, url: `${site.url}/products` },
};

const str = (v: string | string[] | undefined) => (typeof v === "string" ? v : "");

export default async function ProductsPage({ searchParams }: PageProps<"/products">) {
  const sp = await searchParams;
  const category = (CATEGORIES as readonly string[]).includes(str(sp.category)) ? str(sp.category) : "";
  const gender = (GENDERS as readonly string[]).includes(str(sp.gender)) ? str(sp.gender) : "";
  const filter = ["best-sellers", "offers"].includes(str(sp.filter)) ? str(sp.filter) : "";
  const sort = str(sp.sort) || "featured";
  const q = str(sp.q).trim();
  const [all, settings] = await Promise.all([getProducts(), getSettings()]);

  const query = q.toLowerCase();
  const list = all.filter(
    (p) =>
      (!category || p.category === category) &&
      (!gender || p.gender === gender) &&
      (filter !== "offers" || onOffer(p)) &&
      (filter !== "best-sellers" || p.bestSeller) &&
      (!query || [p.name, p.tagline, p.category, p.gender, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(" ").toLowerCase().includes(query)),
  );
  if (sort === "price-asc") list.sort((a, b) => finalPrice(a) - finalPrice(b));
  else if (sort === "price-desc") list.sort((a, b) => finalPrice(b) - finalPrice(a));
  else if (sort === "newest") list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else list.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.stock > 0) - Number(a.stock > 0));

  const title = q
    ? `Search results for “${q}”`
    : filter === "offers"
      ? "Offers"
      : filter === "best-sellers"
        ? "Best Sellers"
        : category
          ? `${category} Perfumes`
          : gender
            ? `${gender === "Unisex" ? "Unisex" : `${gender}'s`} Perfumes`
            : "Shop";

  // Links keep the other active filters and swap one value.
  const href = (patch: Record<string, string>) => {
    const next = new URLSearchParams();
    const cur = { category, gender, filter, q, sort: sort === "featured" ? "" : sort, ...patch };
    for (const [k, v] of Object.entries(cur)) if (v) next.set(k, v);
    const s = next.toString();
    return s ? `/products?${s}` : "/products";
  };
  const count = (pred: (p: (typeof all)[number]) => boolean) => all.filter(pred).length;
  const item = (active: boolean) => `flex justify-between py-1.5 text-sm ${active ? "font-semibold text-black" : "text-neutral-600 hover:text-black"}`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `${site.name} perfume collection`,
          itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/products/${p.slug}`, name: p.name })),
        }}
      />
      <div className="bg-[#f7f5f2] py-10 text-center">
        <h1 className="text-3xl font-medium md:text-4xl">{title}</h1>
        <nav aria-label="Breadcrumb" className="mt-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-black">Home</Link> <span className="mx-1">/</span> <span>{title}</span>
        </nav>
      </div>

      <div className="container-shop grid gap-10 py-10 lg:grid-cols-[240px_1fr]">
        <aside>
          <details className="border border-neutral-200 p-4 lg:border-0 lg:p-0" open>
            <summary className="text-sm font-semibold tracking-[0.12em] uppercase lg:hidden">Filters</summary>
            <div className="mt-4 space-y-8 lg:mt-0">
              <form action="/products" role="search">
                {category && <input type="hidden" name="category" value={category} />}
                {gender && <input type="hidden" name="gender" value={gender} />}
                <p className="mb-3 text-sm font-semibold tracking-[0.12em] uppercase">Search</p>
                <div className="flex border border-neutral-300">
                  <input type="search" name="q" defaultValue={q} placeholder="Name or note…" aria-label="Search perfumes" className="w-full px-3 py-2 text-sm outline-none" />
                  <button className="bg-[#1a1a1a] px-3 text-xs text-white uppercase">Go</button>
                </div>
              </form>
              <div>
                <p className="mb-2 text-sm font-semibold tracking-[0.12em] uppercase">Categories</p>
                <ul>
                  <li><Link href={href({ category: "" })} className={item(!category)}><span>All perfumes</span><span>({all.length})</span></Link></li>
                  {CATEGORIES.map((c) => (
                    <li key={c}><Link href={href({ category: c })} className={item(category === c)}><span>{c}</span><span>({count((p) => p.category === c)})</span></Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold tracking-[0.12em] uppercase">Gender</p>
                <ul>
                  <li><Link href={href({ gender: "" })} className={item(!gender)}><span>All</span></Link></li>
                  {GENDERS.map((g) => (
                    <li key={g}><Link href={href({ gender: g })} className={item(gender === g)}><span>{g}</span><span>({count((p) => p.gender === g)})</span></Link></li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-sm font-semibold tracking-[0.12em] uppercase">Collections</p>
                <ul>
                  <li><Link href={href({ filter: filter === "best-sellers" ? "" : "best-sellers" })} className={item(filter === "best-sellers")}><span>Best Sellers</span><span>({count((p) => p.bestSeller)})</span></Link></li>
                  <li><Link href={href({ filter: filter === "offers" ? "" : "offers" })} className={item(filter === "offers")}><span>On Offer</span><span>({count(onOffer)})</span></Link></li>
                </ul>
              </div>
              {(category || gender || filter || q) && <Link href="/products" className="text-sm underline underline-offset-4">Clear all filters</Link>}
            </div>
          </details>
        </aside>

        <section aria-label="Products">
          <form action="/products" className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-4">
            {category && <input type="hidden" name="category" value={category} />}
            {gender && <input type="hidden" name="gender" value={gender} />}
            {filter && <input type="hidden" name="filter" value={filter} />}
            {q && <input type="hidden" name="q" value={q} />}
            <p className="text-sm text-neutral-600">Showing {list.length} {list.length === 1 ? "result" : "results"}</p>
            <SortSelect value={sort} />
            <noscript><button className="btn-dark !py-2">Sort</button></noscript>
          </form>
          {list.length ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:gap-x-6">
              {list.map((p, i) => <ShopProductCard key={p.id} product={p} settings={settings} siteUrl={site.url} priority={i < 3} />)}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-lg">No products were found matching your selection.</p>
              <Link href="/products" className="btn-dark mt-6">View all perfumes</Link>
            </div>
          )}
        </section>
      </div>
    </>
  );
}

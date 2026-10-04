"use client";
import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, GENDERS, type Product, type Settings } from "@/lib/types";
import { finalPrice, onOffer } from "@/lib/format";

type Sort = "featured" | "price-asc" | "price-desc" | "newest";

export default function ProductsBrowser({
  products,
  settings,
  siteUrl,
  initialCategory,
  initialQuery,
}: {
  products: Product[];
  settings: Settings;
  siteUrl: string;
  initialCategory: string;
  initialQuery: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [gender, setGender] = useState("All");
  const [sort, setSort] = useState<Sort>("featured");
  const [q, setQ] = useState(initialQuery);
  const [offersOnly, setOffersOnly] = useState(false);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    const r = products.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (gender === "All" || p.gender === gender) &&
        (!offersOnly || onOffer(p)) &&
        (!query || [p.name, p.tagline, p.category, ...p.notes.top, ...p.notes.heart, ...p.notes.base].join(" ").toLowerCase().includes(query)),
    );
    if (sort === "price-asc") r.sort((a, b) => finalPrice(a) - finalPrice(b));
    if (sort === "price-desc") r.sort((a, b) => finalPrice(b) - finalPrice(a));
    if (sort === "newest") r.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "featured") r.sort((a, b) => Number(b.bestSeller) - Number(a.bestSeller) || Number(b.stock > 0) - Number(a.stock > 0));
    return r;
  }, [products, category, gender, sort, q, offersOnly]);

  const pickCategory = (c: string) => {
    setCategory(c);
    const url = new URL(window.location.href);
    if (c === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", c);
    window.history.replaceState(null, "", url);
  };

  return (
    <div>
      <div className="sticky top-16 z-20 -mx-5 mb-10 border-y border-white/10 bg-ink/80 px-5 py-4 backdrop-blur-xl md:top-20 md:-mx-8 md:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <LayoutGroup id="cats">
            <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Filter by family">
              {["All", ...CATEGORIES].map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={category === c}
                  onClick={() => pickCategory(c)}
                  className={`relative rounded-full px-4 py-2 text-xs tracking-[0.14em] uppercase transition-colors ${category === c ? "text-ink" : "text-cream/70 hover:text-cream"}`}
                >
                  {category === c && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notes: oud, rose…"
              aria-label="Search perfumes"
              className="w-56 rounded-full border border-white/15 bg-transparent px-4 py-2 text-sm text-cream placeholder:text-muted focus:border-gold focus:outline-none"
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)} aria-label="Filter by gender" className="rounded-full border border-white/15 bg-ink px-4 py-2 text-sm text-cream focus:border-gold focus:outline-none">
              <option value="All">For everyone</option>
              {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort" className="rounded-full border border-white/15 bg-ink px-4 py-2 text-sm text-cream focus:border-gold focus:outline-none">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-cream/80">
              <input type="checkbox" checked={offersOnly} onChange={(e) => setOffersOnly(e.target.checked)} className="accent-[#c8a46a]" /> Offers
            </label>
          </div>
        </div>
      </div>

      <p className="mb-6 text-sm text-muted" aria-live="polite">{list.length} {list.length === 1 ? "fragrance" : "fragrances"}</p>
      <motion.ul layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 60, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.25 } }}
              transition={{ type: "spring", stiffness: 120, damping: 18, delay: Math.min(i, 8) * 0.05 }}
            >
              <ProductCard product={p} settings={settings} siteUrl={siteUrl} priority={i < 4} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {!list.length && <p className="py-24 text-center font-display text-3xl text-cream/60">No fragrances match. Try another note.</p>}
    </div>
  );
}

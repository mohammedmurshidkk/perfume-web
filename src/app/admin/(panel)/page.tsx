import Link from "next/link";
import { getProducts, getSettings } from "@/lib/db";
import { finalPrice, money, onOffer } from "@/lib/format";
import { quickUpdate } from "../actions";
import Bottle from "@/components/Bottle";
import { btn, card } from "@/components/admin/ui";

export default async function AdminProducts({ searchParams }: PageProps<"/admin">) {
  const [products, settings, sp] = await Promise.all([getProducts({ includeInactive: true, fresh: true }), getSettings({ fresh: true }), searchParams]);
  const stats = [
    { l: "Products", v: products.length },
    { l: "Best sellers", v: products.filter((p) => p.bestSeller).length },
    { l: "On offer", v: products.filter(onOffer).length },
    { l: "Low stock (≤5)", v: products.filter((p) => p.stock > 0 && p.stock <= 5).length },
    { l: "Sold out", v: products.filter((p) => p.stock <= 0).length },
  ];
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl">Products</h1>
          <p className="text-sm text-muted">Manage prices, offers, stock and which perfumes appear as best sellers.</p>
        </div>
        <Link href="/admin/products/new" className={btn}>+ Add product</Link>
      </div>
      {sp.saved && <p className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Saved. The website has been updated.</p>}
      <div className="mb-8 grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.l} className={card + " !p-4"}>
            <p className="text-2xl text-gold-2">{s.v}</p>
            <p className="text-xs text-muted">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="bg-ink-2 text-left text-xs tracking-[0.1em] text-muted uppercase">
            <tr>
              <th className="p-4">Perfume</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Best seller</th>
              <th className="p-4">Visible</th>
              <th className="p-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {products.map((p) => (
              <tr key={p.id} className={p.active ? "" : "opacity-50"}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-ink-3">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Bottle color={p.color} shape={p.bottle} className="h-full w-full p-0.5" />
                      )}
                    </div>
                    <div>
                      <Link href={`/admin/products/${p.id}`} className="font-medium text-cream hover:text-gold">{p.name}</Link>
                      <p className="text-xs text-muted">{p.category} · {p.sizeMl}ml · /{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-cream">{money(finalPrice(p), settings)}</p>
                  {onOffer(p) && <p className="text-xs text-muted line-through">{money(p.price, settings)}</p>}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-1.5">
                    <form action={quickUpdate}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value="stock-" /><button className="h-7 w-7 rounded-full border border-white/15 hover:border-gold" aria-label="Decrease stock">−</button></form>
                    <form action={quickUpdate} className="flex">
                      <input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value="stock" />
                      <input name="stock" defaultValue={p.stock} key={p.stock} type="number" min={0} aria-label={`Stock for ${p.name}`} className={`w-16 rounded-lg border bg-transparent px-2 py-1 text-center ${p.stock <= 0 ? "border-red-400/50 text-red-300" : p.stock <= 5 ? "border-amber-400/50 text-amber-200" : "border-white/10"}`} />
                    </form>
                    <form action={quickUpdate}><input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value="stock+" /><button className="h-7 w-7 rounded-full border border-white/15 hover:border-gold" aria-label="Increase stock">+</button></form>
                  </div>
                </td>
                <td className="p-4">
                  <form action={quickUpdate}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value="bestSeller" />
                    <button className={`relative h-6 w-11 rounded-full transition-colors ${p.bestSeller ? "bg-gold" : "bg-white/15"}`} aria-label="Toggle best seller" aria-pressed={p.bestSeller}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${p.bestSeller ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </form>
                </td>
                <td className="p-4">
                  <form action={quickUpdate}>
                    <input type="hidden" name="id" value={p.id} /><input type="hidden" name="op" value="active" />
                    <button className={`relative h-6 w-11 rounded-full transition-colors ${p.active ? "bg-emerald-500" : "bg-white/15"}`} aria-label="Toggle visibility" aria-pressed={p.active}>
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${p.active ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </form>
                </td>
                <td className="p-4 text-right">
                  <Link href={`/admin/products/${p.id}`} className="text-gold hover:underline">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">Tip: type a stock number and press Enter to save it. Set an offer price on a product to show it in Special Offers.</p>
    </div>
  );
}

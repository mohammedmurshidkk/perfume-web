"use client";
import { useActionState, useState } from "react";
import { saveProduct, deleteProduct } from "@/app/admin/actions";
import Bottle from "@/components/Bottle";
import { BOTTLES, CATEGORIES, GENDERS, type Product } from "@/lib/types";
import { btn, btnGhost, card, input, label } from "./ui";

const empty: Omit<Product, "id" | "createdAt"> = {
  slug: "",
  name: "",
  tagline: "",
  description: "",
  category: "Oud",
  gender: "Unisex",
  price: 0,
  offerPrice: null,
  sizeMl: 100,
  stock: 10,
  bestSeller: false,
  active: true,
  notes: { top: [], heart: [], base: [] },
  features: [],
  images: [],
  color: "#4a2516",
  bottle: "classic",
  longevity: 4,
  sillage: 3,
};

export default function ProductForm({ product, currency }: { product?: Product; currency: string }) {
  const p = product ?? empty;
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [color, setColor] = useState(p.color);
  const [bottle, setBottle] = useState(p.bottle);
  const [name, setName] = useState(p.name);
  const [images, setImages] = useState(p.images.join("\n"));
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setUploadError("");
    const urls: string[] = [];
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (res.ok) urls.push(json.url);
      else setUploadError(json.error ?? "Upload failed");
    }
    setImages((cur) => [cur, ...urls].filter(Boolean).join("\n"));
    setUploading(false);
  }

  const imageList = images.split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
      <form action={action} className="space-y-6">
        {product && <input type="hidden" name="id" value={product.id} />}
        <section className={card + " grid gap-4 sm:grid-cols-2"}>
          <h2 className="font-display text-2xl sm:col-span-2">Basics</h2>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="name">Name *</label>
            <input id="name" name="name" required defaultValue={p.name} onChange={(e) => setName(e.target.value)} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="slug">URL slug</label>
            <input id="slug" name="slug" defaultValue={p.slug} placeholder="auto from name" className={input} />
          </div>
          <div>
            <label className={label} htmlFor="tagline">Tagline</label>
            <input id="tagline" name="tagline" defaultValue={p.tagline} placeholder="Smoked oud and saffron." className={input} />
          </div>
          <div className="sm:col-span-2">
            <label className={label} htmlFor="description">Description (shown on product page, good for SEO)</label>
            <textarea id="description" name="description" rows={4} defaultValue={p.description} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="category">Family</label>
            <select id="category" name="category" defaultValue={p.category} className={input}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
          <div>
            <label className={label} htmlFor="gender">For</label>
            <select id="gender" name="gender" defaultValue={p.gender} className={input}>{GENDERS.map((c) => <option key={c}>{c}</option>)}</select>
          </div>
        </section>

        <section className={card + " grid gap-4 sm:grid-cols-4"}>
          <h2 className="font-display text-2xl sm:col-span-4">Price, offer & stock</h2>
          <div>
            <label className={label} htmlFor="price">Price ({currency}) *</label>
            <input id="price" name="price" type="number" min={1} required defaultValue={p.price || ""} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="offerPrice">Offer price</label>
            <input id="offerPrice" name="offerPrice" type="number" min={1} defaultValue={p.offerPrice ?? ""} placeholder="No offer" className={input} />
          </div>
          <div>
            <label className={label} htmlFor="stock">Stock</label>
            <input id="stock" name="stock" type="number" min={0} defaultValue={p.stock} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="sizeMl">Size (ml)</label>
            <input id="sizeMl" name="sizeMl" type="number" min={1} defaultValue={p.sizeMl} className={input} />
          </div>
          <label className="flex items-center gap-3 text-sm sm:col-span-2">
            <input type="checkbox" name="bestSeller" defaultChecked={p.bestSeller} className="h-4 w-4 accent-[#c8a46a]" /> Best seller (shown on home page)
          </label>
          <label className="flex items-center gap-3 text-sm sm:col-span-2">
            <input type="checkbox" name="active" defaultChecked={p.active} className="h-4 w-4 accent-[#c8a46a]" /> Visible on website
          </label>
        </section>

        <section className={card + " grid gap-4 sm:grid-cols-3"}>
          <h2 className="font-display text-2xl sm:col-span-3">Notes & features</h2>
          {(["Top", "Heart", "Base"] as const).map((k) => (
            <div key={k}>
              <label className={label} htmlFor={`notes${k}`}>{k} notes</label>
              <input id={`notes${k}`} name={`notes${k}`} defaultValue={p.notes[k.toLowerCase() as "top"].join(", ")} placeholder="Comma separated" className={input} />
            </div>
          ))}
          <div className="sm:col-span-3">
            <label className={label} htmlFor="features">Features (one per line)</label>
            <textarea id="features" name="features" rows={4} defaultValue={p.features.join("\n")} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="longevity">Longevity (1 to 5)</label>
            <input id="longevity" name="longevity" type="number" min={1} max={5} defaultValue={p.longevity} className={input} />
          </div>
          <div>
            <label className={label} htmlFor="sillage">Projection (1 to 5)</label>
            <input id="sillage" name="sillage" type="number" min={1} max={5} defaultValue={p.sillage} className={input} />
          </div>
        </section>

        <section className={card + " space-y-4"}>
          <h2 className="font-display text-2xl">Images</h2>
          <p className="text-sm text-muted">Upload product photos (first one is the main image). Without photos, the illustrated bottle below is used.</p>
          <div className="flex flex-wrap gap-3">
            {imageList.map((src) => (
              <div key={src} className="group relative h-24 w-20 overflow-hidden rounded-xl border border-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setImages(imageList.filter((s) => s !== src).join("\n"))} className="absolute right-1 top-1 rounded-full bg-black/70 px-1.5 text-xs opacity-0 group-hover:opacity-100" aria-label="Remove image">✕</button>
              </div>
            ))}
            <label className="flex h-24 w-20 cursor-pointer items-center justify-center rounded-xl border border-dashed border-white/20 text-xs text-muted hover:border-gold hover:text-gold">
              {uploading ? "…" : "+ Upload"}
              <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple hidden onChange={(e) => upload(e.target.files)} />
            </label>
          </div>
          {uploadError && <p className="text-sm text-red-300">{uploadError}</p>}
          <div>
            <label className={label} htmlFor="images">Image URLs (one per line)</label>
            <textarea id="images" name="images" rows={2} value={images} onChange={(e) => setImages(e.target.value)} className={input} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="color">Bottle / theme colour</label>
              <div className="flex gap-2">
                <input id="color" name="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
                <input value={color} onChange={(e) => setColor(e.target.value)} className={input} aria-label="Colour hex" />
              </div>
            </div>
            <div>
              <label className={label} htmlFor="bottle">Bottle illustration</label>
              <select id="bottle" name="bottle" value={bottle} onChange={(e) => setBottle(e.target.value as Product["bottle"])} className={input}>{BOTTLES.map((b) => <option key={b}>{b}</option>)}</select>
            </div>
          </div>
        </section>

        {state?.error && <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{state.error}</p>}
        <div className="flex flex-wrap gap-3">
          <button className={btn} disabled={pending || uploading}>{pending ? "Saving…" : product ? "Save changes" : "Add product"}</button>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-10 lg:self-start">
        <div className={card}>
          <p className={label}>Preview</p>
          <div className="relative mt-3 aspect-[4/5] overflow-hidden rounded-xl" style={{ background: `radial-gradient(120% 80% at 50% 100%, ${color}55, transparent 60%), #15110e` }}>
            {imageList[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageList[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <Bottle color={color} shape={bottle} className="absolute inset-x-[15%] bottom-[5%] top-[8%] h-[87%] w-[70%]" />
            )}
          </div>
          <p className="mt-3 font-display text-2xl">{name || "Untitled"}</p>
        </div>
        {product && (
          <form action={deleteProduct} onSubmit={(e) => { if (!confirm(`Delete ${product.name}? This cannot be undone.`)) e.preventDefault(); }}>
            <input type="hidden" name="id" value={product.id} />
            <button className={`${btnGhost} w-full !border-red-400/30 !text-red-300 hover:!border-red-400`}>Delete product</button>
          </form>
        )}
      </aside>
    </div>
  );
}

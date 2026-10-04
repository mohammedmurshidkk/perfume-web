import { getProducts, getTestimonials } from "@/lib/db";
import { deleteTestimonial, saveTestimonial } from "../../actions";
import { btn, card, input, label } from "@/components/admin/ui";

export default async function AdminTestimonials() {
  const [items, products] = await Promise.all([getTestimonials(), getProducts({ includeInactive: true })]);
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-display text-4xl">Testimonials</h1>
      <p className="mb-8 text-sm text-muted">Shown in the scrolling reviews section on the home page.</p>
      <form action={saveTestimonial} className={card + " mb-8 grid gap-4 sm:grid-cols-4"}>
        <div><label className={label} htmlFor="t-name">Name *</label><input id="t-name" name="name" required className={input} /></div>
        <div><label className={label} htmlFor="t-loc">City</label><input id="t-loc" name="location" className={input} /></div>
        <div>
          <label className={label} htmlFor="t-prod">Perfume</label>
          <select id="t-prod" name="product" className={input}>{products.map((p) => <option key={p.id}>{p.name}</option>)}</select>
        </div>
        <div><label className={label} htmlFor="t-rating">Rating</label><select id="t-rating" name="rating" defaultValue="5" className={input}>{[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} ★</option>)}</select></div>
        <div className="sm:col-span-4"><label className={label} htmlFor="t-quote">Review *</label><textarea id="t-quote" name="quote" required rows={3} className={input} /></div>
        <div><button className={btn}>Add testimonial</button></div>
      </form>
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t.id} className={card + " flex items-start justify-between gap-6"}>
            <div>
              <p className="text-gold">{"★".repeat(t.rating)}<span className="text-white/20">{"★".repeat(5 - t.rating)}</span></p>
              <p className="mt-2 text-cream/85">“{t.quote}”</p>
              <p className="mt-2 text-xs text-muted">{t.name}{t.location && ` · ${t.location}`}{t.product && ` · ${t.product}`}</p>
            </div>
            <form action={deleteTestimonial}>
              <input type="hidden" name="id" value={t.id} />
              <button className="text-sm text-red-300 hover:underline">Delete</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}

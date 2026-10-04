import type { Product, Settings } from "./types";

export function money(n: number, s: Pick<Settings, "currencySymbol">) {
  return `${s.currencySymbol}${n.toLocaleString("en-IN")}`;
}

export function finalPrice(p: Product) {
  return p.offerPrice && p.offerPrice < p.price ? p.offerPrice : p.price;
}

export function onOffer(p: Product) {
  return !!p.offerPrice && p.offerPrice < p.price;
}

export function discountPct(p: Product) {
  return onOffer(p) ? Math.round((1 - (p.offerPrice as number) / p.price) * 100) : 0;
}

export function stockLabel(p: Product) {
  if (p.stock <= 0) return { text: "Sold out", tone: "out" as const };
  if (p.stock <= 5) return { text: `Only ${p.stock} left`, tone: "low" as const };
  return { text: "In stock", tone: "ok" as const };
}

export function whatsappLink(settings: Settings, text: string) {
  const num = settings.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
}

export function buyMessage(p: Product, settings: Settings, url: string) {
  const price = money(finalPrice(p), settings);
  return [
    `Hello! I'd like to order:`,
    ``,
    `*${p.name}* (${p.sizeMl}ml)`,
    `Price: ${price}${onOffer(p) ? ` (offer, was ${money(p.price, settings)})` : ""}`,
    `Product code: ${p.id.toUpperCase()}`,
    ``,
    url,
  ].join("\n");
}

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

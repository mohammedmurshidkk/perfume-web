"use server";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { updateDB, readDB, DB_TAG } from "@/lib/db";
import { slugify } from "@/lib/format";
import { BOTTLES, CATEGORIES, GENDERS, type BottleShape, type Category, type Gender, type Product } from "@/lib/types";

function refreshSite() {
  updateTag(DB_TAG);
  revalidatePath("/", "layout");
}

const str = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();
const num = (fd: FormData, k: string, fallback = 0) => {
  const n = Number(str(fd, k));
  return Number.isFinite(n) ? n : fallback;
};
const list = (fd: FormData, k: string) =>
  str(fd, k)
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);
const pick = <T extends string>(v: string, options: readonly T[], fallback: T) => ((options as readonly string[]).includes(v) ? (v as T) : fallback);
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, Math.round(n)));

export async function login(_: unknown, fd: FormData) {
  if (!checkPassword(str(fd, "password"))) return { error: "Incorrect password." };
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export type SaveState = { error?: string } | undefined;

export async function saveProduct(_: SaveState, fd: FormData): Promise<SaveState> {
  await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return { error: "Name is required." };
  const price = num(fd, "price");
  if (price <= 0) return { error: "Price must be greater than zero." };
  const offerRaw = str(fd, "offerPrice");
  const offerPrice = offerRaw ? num(fd, "offerPrice") : null;
  if (offerPrice !== null && (offerPrice <= 0 || offerPrice >= price)) return { error: "Offer price must be lower than the regular price (leave empty for no offer)." };

  const db = await readDB({ fresh: true });
  const slug = slugify(str(fd, "slug") || name);
  if (!slug) return { error: "Please enter a valid URL slug." };
  if (db.products.some((p) => p.slug === slug && p.id !== id)) return { error: `Another product already uses the URL "${slug}".` };

  const existing = db.products.find((p) => p.id === id);
  const product: Product = {
    id: existing?.id ?? `p${randomUUID().slice(0, 8)}`,
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    slug,
    name,
    tagline: str(fd, "tagline"),
    description: str(fd, "description"),
    category: pick<Category>(str(fd, "category"), CATEGORIES, "Oud"),
    gender: pick<Gender>(str(fd, "gender"), GENDERS, "Unisex"),
    price,
    offerPrice,
    sizeMl: num(fd, "sizeMl", 100),
    stock: Math.max(0, Math.round(num(fd, "stock"))),
    bestSeller: fd.get("bestSeller") === "on",
    active: fd.get("active") === "on",
    notes: { top: list(fd, "notesTop"), heart: list(fd, "notesHeart"), base: list(fd, "notesBase") },
    features: str(fd, "features").split("\n").map((s) => s.trim()).filter(Boolean),
    images: str(fd, "images").split("\n").map((s) => s.trim()).filter(Boolean),
    color: /^#[0-9a-f]{6}$/i.test(str(fd, "color")) ? str(fd, "color") : "#4a2516",
    bottle: pick<BottleShape>(str(fd, "bottle"), BOTTLES, "classic"),
    longevity: clamp(num(fd, "longevity", 3), 1, 5),
    sillage: clamp(num(fd, "sillage", 3), 1, 5),
  };

  try {
    await updateDB((d) => {
      const i = d.products.findIndex((p) => p.id === product.id);
      if (i >= 0) d.products[i] = product;
      else d.products.unshift(product);
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Could not save." };
  }
  refreshSite();
  redirect("/admin?saved=1");
}

export async function deleteProduct(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDB((d) => {
    d.products = d.products.filter((p) => p.id !== id);
  });
  refreshSite();
  redirect("/admin");
}

// Quick edits from the products table.
export async function quickUpdate(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const op = str(fd, "op");
  await updateDB((d) => {
    const p = d.products.find((x) => x.id === id);
    if (!p) return;
    if (op === "bestSeller") p.bestSeller = !p.bestSeller;
    if (op === "active") p.active = !p.active;
    if (op === "stock") p.stock = Math.max(0, Math.round(num(fd, "stock", p.stock)));
    if (op === "stock+") p.stock += 1;
    if (op === "stock-") p.stock = Math.max(0, p.stock - 1);
  });
  refreshSite();
}

export async function saveTestimonial(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name");
  const quote = str(fd, "quote");
  if (!name || !quote) return;
  await updateDB((d) => {
    d.testimonials.unshift({
      id: `t${randomUUID().slice(0, 8)}`,
      name,
      quote,
      location: str(fd, "location"),
      product: str(fd, "product"),
      rating: clamp(num(fd, "rating", 5), 1, 5),
    });
  });
  refreshSite();
}

export async function deleteTestimonial(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  await updateDB((d) => {
    d.testimonials = d.testimonials.filter((t) => t.id !== id);
  });
  refreshSite();
}

export async function saveSettings(fd: FormData) {
  await requireAdmin();
  await updateDB((d) => {
    d.settings = {
      whatsapp: str(fd, "whatsapp").replace(/\D/g, "") || d.settings.whatsapp,
      currencySymbol: str(fd, "currencySymbol") || "₹",
      currencyCode: (str(fd, "currencyCode") || "INR").toUpperCase(),
      email: str(fd, "email"),
      phone: str(fd, "phone"),
      address: str(fd, "address"),
      instagram: str(fd, "instagram"),
      announcement: str(fd, "announcement"),
    };
  });
  refreshSite();
  redirect("/admin/settings?saved=1");
}

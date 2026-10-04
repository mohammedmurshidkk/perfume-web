import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { seed } from "./seed";
import type { DB, Product } from "./types";

// Two storage backends behind the same functions:
// - Supabase (set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY): required on Vercel and other
//   serverless hosts, where the filesystem is read-only.
// - A JSON file in ./data: fine on a single server with a disk (VPS, Railway, Render).
// With neither writable, the site still renders from the seed data.
export const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
export const DB_TAG = "db";

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = SB_URL && SB_KEY ? { url: SB_URL, key: SB_KEY } : null;
export const storageReadOnly = !supabase && !!process.env.VERCEL;

const sbHeaders = () => ({ apikey: SB_KEY!, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" });

function withDefaults(db: Partial<DB>): DB {
  return {
    products: db.products ?? seed.products,
    testimonials: db.testimonials ?? seed.testimonials,
    settings: { ...seed.settings, ...db.settings },
  };
}

export async function readDB({ fresh = false } = {}): Promise<DB> {
  if (supabase) {
    const res = await fetch(`${supabase.url}/rest/v1/site_data?id=eq.1&select=data`, {
      headers: sbHeaders(),
      ...(fresh ? { cache: "no-store" as const } : { cache: "force-cache" as const, next: { tags: [DB_TAG] } }),
    });
    if (!res.ok) throw new Error(`Supabase read failed (${res.status}): ${await res.text()}`);
    const rows = (await res.json()) as { data: DB }[];
    return rows[0]?.data ? withDefaults(rows[0].data) : structuredClone(seed);
  }
  try {
    return withDefaults(JSON.parse(await fs.readFile(DB_FILE, "utf8")));
  } catch {
    // First run (or a read-only host): start from the seed data.
    try {
      await writeDB(seed);
    } catch {}
    return structuredClone(seed);
  }
}

export async function writeDB(db: DB) {
  if (supabase) {
    const res = await fetch(`${supabase.url}/rest/v1/site_data`, {
      method: "POST",
      headers: { ...sbHeaders(), Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ id: 1, data: db }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Supabase write failed (${res.status}): ${await res.text()}`);
    return;
  }
  if (storageReadOnly) throw new Error("This host has a read-only filesystem. Add the Supabase keys to save changes.");
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, DB_FILE);
}

export async function updateDB(fn: (db: DB) => DB | void) {
  const db = await readDB({ fresh: true });
  const next = fn(db) ?? db;
  await writeDB(next);
  return next;
}

export async function getProducts({ includeInactive = false, fresh = false } = {}) {
  const { products } = await readDB({ fresh });
  return includeInactive ? products : products.filter((p) => p.active);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getSettings({ fresh = false } = {}) {
  return (await readDB({ fresh })).settings;
}

export async function getTestimonials({ fresh = false } = {}) {
  return (await readDB({ fresh })).testimonials;
}

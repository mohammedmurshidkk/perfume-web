import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { seed } from "./seed";
import type { DB, Product } from "./types";

// A small JSON-file store. Good for a single server (VPS, Railway, Render with a disk).
// For serverless hosting swap these functions for Supabase/Postgres; the rest of the app
// only talks to the functions exported here.
export const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

export async function readDB(): Promise<DB> {
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const db = JSON.parse(raw) as DB;
    return { ...seed, ...db, settings: { ...seed.settings, ...db.settings } };
  } catch {
    await writeDB(seed);
    return structuredClone(seed);
  }
}

export async function writeDB(db: DB) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(db, null, 2));
  await fs.rename(tmp, DB_FILE);
}

export async function updateDB(fn: (db: DB) => DB | void) {
  const db = await readDB();
  const next = fn(db) ?? db;
  await writeDB(next);
  return next;
}

export async function getProducts({ includeInactive = false } = {}) {
  const { products } = await readDB();
  return includeInactive ? products : products.filter((p) => p.active);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return (await getProducts()).find((p) => p.slug === slug);
}

export async function getSettings() {
  return (await readDB()).settings;
}

export async function getTestimonials() {
  return (await readDB()).testimonials;
}

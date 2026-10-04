import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdmin } from "@/lib/auth";
import { DATA_DIR, storageReadOnly, supabase } from "@/lib/db";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };
const BUCKET = process.env.SUPABASE_BUCKET || "product-images";

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: "Use JPG, PNG, WebP or AVIF" }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return Response.json({ error: "Max 4 MB per image" }, { status: 400 });
  const name = `${randomUUID()}.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  if (supabase) {
    const res = await fetch(`${supabase.url}/storage/v1/object/${BUCKET}/${name}`, {
      method: "POST",
      headers: { apikey: supabase.key, Authorization: `Bearer ${supabase.key}`, "Content-Type": file.type, "Cache-Control": "31536000" },
      body,
    });
    if (!res.ok) return Response.json({ error: `Upload failed: ${await res.text()}` }, { status: 500 });
    return Response.json({ url: `${supabase.url}/storage/v1/object/public/${BUCKET}/${name}` });
  }
  if (storageReadOnly) return Response.json({ error: "Uploads need Supabase on this host. Paste an image URL instead." }, { status: 400 });

  const dir = path.join(DATA_DIR, "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), body);
  return Response.json({ url: `/uploads/${name}` });
}

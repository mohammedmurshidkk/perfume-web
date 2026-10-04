import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isAdmin } from "@/lib/auth";
import { DATA_DIR } from "@/lib/db";

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" };

export async function POST(req: Request) {
  if (!(await isAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  const ext = TYPES[file.type];
  if (!ext) return Response.json({ error: "Use JPG, PNG, WebP or AVIF" }, { status: 400 });
  if (file.size > 8 * 1024 * 1024) return Response.json({ error: "Max 8 MB" }, { status: 400 });
  const dir = path.join(DATA_DIR, "uploads");
  await fs.mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ url: `/uploads/${name}` });
}

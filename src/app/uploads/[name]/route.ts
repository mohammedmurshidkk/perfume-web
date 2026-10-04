import { promises as fs } from "fs";
import path from "path";
import { DATA_DIR } from "@/lib/db";

const MIME: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp", avif: "image/avif" };

// Serves images uploaded from the admin panel (stored outside /public so they work after build).
export async function GET(_: Request, ctx: RouteContext<"/uploads/[name]">) {
  const { name } = await ctx.params;
  if (!/^[a-f0-9-]+\.(jpg|png|webp|avif)$/.test(name)) return new Response("Not found", { status: 404 });
  try {
    const buf = await fs.readFile(path.join(DATA_DIR, "uploads", name));
    return new Response(buf, {
      headers: { "Content-Type": MIME[name.split(".").pop()!], "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}

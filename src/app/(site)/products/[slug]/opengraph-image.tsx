import { ogImage, ogSize } from "@/lib/og";
import { getProductBySlug } from "@/lib/db";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `${site.name} perfume`;

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  return ogImage({
    eyebrow: p ? `${p.category} · ${p.sizeMl}ml` : "Perfume",
    title: p?.name ?? site.name,
    subtitle: p?.tagline ?? site.tagline,
    color: p?.color,
  });
}

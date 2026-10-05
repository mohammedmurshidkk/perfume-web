import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/db";
import { CATEGORIES, GENDERS } from "@/lib/types";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    { url: site.url, changeFrequency: "weekly", priority: 1 },
    { url: `${site.url}/products`, changeFrequency: "daily", priority: 0.9 },
    { url: `${site.url}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${site.url}/contact`, changeFrequency: "monthly", priority: 0.5 },
    ...GENDERS.map((g) => ({ url: `${site.url}/products?gender=${g}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...CATEGORIES.map((c) => ({ url: `${site.url}/products?category=${c}`, changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({
      url: `${site.url}/products/${p.slug}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: p.images.map((i) => (i.startsWith("http") ? i : `${site.url}${i}`)),
    })),
  ];
}

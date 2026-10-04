import { ogImage, ogSize } from "@/lib/og";
import { site } from "@/lib/site";

export const size = ogSize;
export const contentType = "image/png";
export const alt = `${site.name}: luxury oud and niche perfumes`;

export default function Image() {
  return ogImage({ eyebrow: "Luxury perfumes", title: "Slowly made.", subtitle: "Rare oud, rose and amber. Order on WhatsApp." });
}

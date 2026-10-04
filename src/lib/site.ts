// Brand-level constants. Editable values (WhatsApp number, currency, contact)
// live in the admin panel under Settings.
export const site = {
  name: "Maison Élan",
  shortName: "Élan",
  tagline: "Rare fragrances, slowly made.",
  description:
    "Maison Élan crafts luxury oud, amber, floral and fresh perfumes from rare ingredients, aged for depth and made to last. Explore the collection and order directly on WhatsApp.",
  keywords: [
    "luxury perfume",
    "oud perfume",
    "attar",
    "long lasting perfume",
    "eau de parfum",
    "perfume online India",
    "niche fragrance",
  ],
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  // Set NEXT_PUBLIC_HERO_VIDEO=/videos/hero.mp4 (file in /public) to use a video hero.
  heroVideo: process.env.NEXT_PUBLIC_HERO_VIDEO ?? "",
  locale: "en_IN",
};

# Maison Élan perfume website

Next.js (App Router) + Tailwind, with GSAP ScrollTrigger, Lenis smooth scroll and Framer Motion.

## Run
```bash
npm install
npm run dev        # http://localhost:3000, admin at /admin (default password admin123)
```

## Environment
| Variable | Purpose |
| --- | --- |
| `ADMIN_PASSWORD` | Admin login password (change before going live) |
| `ADMIN_SECRET` | Optional extra secret for signing the admin cookie |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, sitemap and WhatsApp messages |
| `NEXT_PUBLIC_HERO_VIDEO` | Optional, e.g. `/videos/hero.mp4` in `public/` to use a video hero |

## Content
- Products, testimonials and settings (WhatsApp number, currency, contact) are edited in `/admin`.
- Data lives in `data/db.json` (created from `src/lib/seed.ts` on first run); uploads in `data/uploads/`.
  Host on a server with a persistent disk (VPS, Railway, Render). For serverless hosting, replace `src/lib/db.ts` with Supabase/Postgres.
- Brand name and SEO copy: `src/lib/site.ts`.

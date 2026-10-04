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
| `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` | Database + image storage (required on Vercel, see below) |
| `NEXT_PUBLIC_HERO_VIDEO` | Optional, e.g. `/videos/hero.mp4` in `public/` to use a video hero |

## Content
- Products, testimonials and settings (WhatsApp number, currency, contact) are edited in `/admin`.
- On a server with a disk (VPS, Railway, Render) data lives in `data/db.json` (created from `src/lib/seed.ts`) and uploads in `data/uploads/`.
- On Vercel the filesystem is read-only, so the site shows the seed data and the admin can't save until you connect Supabase:

### Supabase setup (needed for Vercel)
1. Create a free project at supabase.com.
2. In the SQL editor run:
   ```sql
   create table site_data (id int primary key, data jsonb not null);
   alter table site_data enable row level security;
   ```
3. In Storage, create a **public** bucket named `product-images`.
4. In Vercel → Project → Settings → Environment Variables add
   `SUPABASE_URL` (Project URL) and `SUPABASE_SERVICE_ROLE_KEY` (Settings → API → service_role key), plus `ADMIN_PASSWORD`, then redeploy.
   The first save in /admin copies the starter products into Supabase.
- Brand name and SEO copy: `src/lib/site.ts`.

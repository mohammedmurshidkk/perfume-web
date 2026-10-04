import Link from "next/link";
import { site } from "@/lib/site";
import type { Settings } from "@/lib/types";
import { whatsappLink } from "@/lib/format";
import FooterWordmark from "./FooterWordmark";
import { WhatsAppIcon } from "./icons";
import { CATEGORIES } from "@/lib/types";

export default function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  return (
    <footer id="contact" className="relative overflow-hidden border-t border-white/10 bg-ink pt-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="eyebrow">Maison Élan</p>
          <p className="mt-5 max-w-sm font-display text-3xl leading-tight text-cream">{site.tagline}</p>
          <a
            href={whatsappLink(settings, "Hello! I have a question about your perfumes.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-[0.1em] text-ink uppercase transition-transform hover:scale-[1.03]"
          >
            <WhatsAppIcon /> Order on WhatsApp
          </a>
        </div>
        <nav className="md:col-span-2" aria-label="Collection">
          <p className="text-[11px] tracking-[0.24em] text-muted uppercase">Collection</p>
          <ul className="mt-5 space-y-3 text-cream/80">
            {CATEGORIES.map((c) => (
              <li key={c}><Link className="transition-colors hover:text-gold" href={`/products?category=${c}`}>{c} perfumes</Link></li>
            ))}
          </ul>
        </nav>
        <nav className="md:col-span-2" aria-label="Explore">
          <p className="text-[11px] tracking-[0.24em] text-muted uppercase">Explore</p>
          <ul className="mt-5 space-y-3 text-cream/80">
            <li><Link className="hover:text-gold" href="/">Home</Link></li>
            <li><Link className="hover:text-gold" href="/products">All products</Link></li>
            <li><Link className="hover:text-gold" href="/#story">Our story</Link></li>
            <li><Link className="hover:text-gold" href="/#reviews">Reviews</Link></li>
          </ul>
        </nav>
        <address className="not-italic md:col-span-3">
          <p className="text-[11px] tracking-[0.24em] text-muted uppercase">Visit & contact</p>
          <ul className="mt-5 space-y-3 text-cream/80">
            <li>{settings.address}</li>
            <li><a className="hover:text-gold" href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></li>
            <li><a className="hover:text-gold" href={`mailto:${settings.email}`}>{settings.email}</a></li>
            {settings.instagram && <li><a className="hover:text-gold" href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
          </ul>
        </address>
      </div>
      <FooterWordmark />
      <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-white/10 px-5 py-6 text-xs text-muted md:flex-row md:justify-between md:px-8">
        <p>© {year} {site.name}. All rights reserved.</p>
        <p>Crafted with patience. Ordered on WhatsApp.</p>
      </div>
    </footer>
  );
}

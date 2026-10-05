import Link from "next/link";
import { site } from "@/lib/site";
import { whatsappLink } from "@/lib/format";
import { CATEGORIES, type Settings } from "@/lib/types";
import { WhatsAppIcon } from "@/components/icons";

export default function ShopFooter({ settings }: { settings: Settings }) {
  const head = "mb-4 text-sm font-semibold tracking-[0.12em] uppercase";
  const link = "text-sm text-neutral-600 hover:text-black";
  return (
    <footer className="mt-20 border-t border-neutral-200 bg-[#f7f5f2]">
      <div className="container-shop grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="text-lg font-semibold tracking-[0.2em] uppercase">{site.name}</p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-600">{site.description}</p>
          <a href={whatsappLink(settings, "Hello! I have a question about your perfumes.")} target="_blank" rel="noopener noreferrer" className="btn-wa mt-5">
            <WhatsAppIcon className="h-4 w-4" /> Chat with us
          </a>
        </div>
        <nav aria-label="Quick links">
          <p className={head}>Quick Links</p>
          <ul className="space-y-2.5">
            <li><Link className={link} href="/">Home</Link></li>
            <li><Link className={link} href="/products">Shop All</Link></li>
            <li><Link className={link} href="/products?filter=best-sellers">Best Sellers</Link></li>
            <li><Link className={link} href="/products?filter=offers">Offers</Link></li>
            <li><Link className={link} href="/about">About Us</Link></li>
            <li><Link className={link} href="/contact">Contact Us</Link></li>
          </ul>
        </nav>
        <nav aria-label="Categories">
          <p className={head}>Categories</p>
          <ul className="space-y-2.5">
            <li><Link className={link} href="/products?gender=Men">Men&apos;s Perfumes</Link></li>
            <li><Link className={link} href="/products?gender=Women">Women&apos;s Perfumes</Link></li>
            <li><Link className={link} href="/products?gender=Unisex">Unisex Perfumes</Link></li>
            {CATEGORIES.map((c) => (
              <li key={c}><Link className={link} href={`/products?category=${c}`}>{c} Perfumes</Link></li>
            ))}
          </ul>
        </nav>
        <address className="not-italic">
          <p className={head}>Contact</p>
          <ul className="space-y-2.5 text-sm text-neutral-600">
            <li>{settings.address}</li>
            <li><a className={link} href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a></li>
            <li><a className={link} href={`mailto:${settings.email}`}>{settings.email}</a></li>
            {settings.instagram && <li><a className={link} href={settings.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>}
          </ul>
        </address>
      </div>
      <div className="border-t border-neutral-200">
        <p className="container-shop py-5 text-center text-xs text-neutral-500">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
      </div>
    </footer>
  );
}

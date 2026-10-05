import Link from "next/link";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons";
import { MenuIcon, SearchIcon } from "./shopIcons";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?gender=Men", label: "Men" },
  { href: "/products?gender=Women", label: "Women" },
  { href: "/products?gender=Unisex", label: "Unisex" },
  { href: "/products?filter=best-sellers", label: "Best Sellers" },
  { href: "/products?filter=offers", label: "Offers" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
];

function SearchForm({ className = "" }: { className?: string }) {
  return (
    <form action="/products" role="search" className={`flex items-center border border-neutral-300 ${className}`}>
      <input type="search" name="q" placeholder="Search perfumes…" aria-label="Search perfumes" className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-neutral-400" />
      <button type="submit" aria-label="Search" className="px-3 text-neutral-700 hover:text-black">
        <SearchIcon />
      </button>
    </form>
  );
}

export default function ShopHeader({ announcement, whatsappHref }: { announcement?: string; whatsappHref: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      {announcement && <p className="bg-[#1a1a1a] px-4 py-2 text-center text-xs tracking-wide text-white">{announcement}</p>}
      <div className="container-shop flex h-16 items-center justify-between gap-4 md:h-20">
        <details className="relative lg:hidden">
          <summary aria-label="Open menu" className="p-1">
            <MenuIcon />
          </summary>
          <nav aria-label="Mobile" className="absolute left-0 top-10 w-64 border border-neutral-200 bg-white p-4 shadow-lg">
            <SearchForm className="mb-3" />
            <ul className="divide-y divide-neutral-100">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-2.5 text-sm hover:text-[#a37e4c]">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>

        <Link href="/" className="text-xl font-semibold tracking-[0.2em] uppercase md:text-2xl" aria-label={`${site.name} home`}>
          {site.name}
        </Link>

        <SearchForm className="hidden w-80 lg:flex" />

        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium hover:text-[#1f9d55]">
          <WhatsAppIcon className="h-6 w-6 text-[#1f9d55]" />
          <span className="hidden sm:inline">Order on WhatsApp</span>
        </a>
      </div>
      <nav aria-label="Main" className="hidden border-t border-neutral-200 lg:block">
        <ul className="container-shop flex h-12 items-center justify-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="text-[13px] font-medium tracking-[0.08em] uppercase hover:text-[#a37e4c]">{l.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

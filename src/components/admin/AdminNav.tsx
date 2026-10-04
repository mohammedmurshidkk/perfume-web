"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin", label: "Products" },
  { href: "/admin/products/new", label: "Add product" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3">
      {items.map((i) => {
        const active = i.href === "/admin" ? path === "/admin" || (path.startsWith("/admin/products/") && !path.endsWith("/new")) : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm transition-colors ${active ? "bg-gold/15 text-gold" : "text-cream/70 hover:bg-white/5 hover:text-cream"}`}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}

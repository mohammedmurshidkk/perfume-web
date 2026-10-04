"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { site } from "@/lib/site";
import { WhatsAppIcon } from "./icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Collection" },
  { href: "/#story", label: "Our Story" },
  { href: "/#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export default function Header({ whatsappHref, announcement }: { whatsappHref: string; announcement?: string }) {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 300 && !open);
    setSolid(y > 40);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden ? "-100%" : "0%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
      >
        {announcement && (
          <div className="overflow-hidden bg-gold text-ink">
            <p className="px-4 py-1.5 text-center text-[11px] font-medium tracking-[0.12em] uppercase">{announcement}</p>
          </div>
        )}
        <div
          className={`transition-[background,backdrop-filter,border-color] duration-500 ${
            solid || open ? "border-b border-white/10 bg-ink/70 backdrop-blur-xl" : "border-b border-transparent"
          }`}
        >
          <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-8" aria-label="Main">
            <Link href="/" className="font-display text-2xl tracking-[0.18em] text-cream" aria-label={`${site.name} home`}>
              MAISON <span className="text-gold">ÉLAN</span>
            </Link>
            <ul className="hidden items-center gap-9 md:flex">
              {links.map((l) => {
                const active = l.href === pathname || (l.href === "/products" && pathname.startsWith("/products"));
                return (
                  <li key={l.href}>
                    <Link href={l.href} className="group relative text-[13px] tracking-[0.14em] text-cream/80 uppercase transition-colors hover:text-cream">
                      {l.label}
                      <span className={`absolute -bottom-1.5 left-0 h-px bg-gold transition-all duration-500 ease-luxe ${active ? "w-full" : "w-0 group-hover:w-full"}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center gap-3">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-[12px] tracking-[0.14em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink sm:flex"
              >
                <WhatsAppIcon className="h-4 w-4" /> Chat
              </a>
              <button
                className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
                onClick={() => setOpen((o) => !o)}
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
              >
                <motion.span className="block h-px w-6 bg-cream" animate={open ? { rotate: 45, y: 3.5 } : { rotate: 0, y: 0 }} />
                <motion.span className="block h-px w-6 bg-cream" animate={open ? { rotate: -45, y: -3.5 } : { rotate: 0, y: 0 }} />
              </button>
            </div>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-ink px-8 md:hidden"
            initial={{ clipPath: "circle(0% at 100% 0%)" }}
            animate={{ clipPath: "circle(150% at 100% 0%)" }}
            exit={{ clipPath: "circle(0% at 100% 0%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <ul className="space-y-4">
              {links.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Link href={l.href} onClick={() => setOpen(false)} className="font-display text-5xl text-cream">
                      {l.label}
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="mt-12 inline-flex items-center gap-2 text-gold">
              <WhatsAppIcon /> Chat with us on WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

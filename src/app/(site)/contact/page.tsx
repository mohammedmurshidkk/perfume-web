import type { Metadata } from "next";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { getSettings } from "@/lib/db";
import { whatsappLink } from "@/lib/format";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Contact ${site.name} on WhatsApp, phone or email for orders, delivery and fragrance advice.`,
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const s = await getSettings();
  const rows = [
    { k: "WhatsApp", v: `+${s.whatsapp}`, href: whatsappLink(s, "Hello! I have a question.") },
    { k: "Phone", v: s.phone, href: `tel:${s.phone.replace(/\s/g, "")}` },
    { k: "Email", v: s.email, href: `mailto:${s.email}` },
    { k: "Address", v: s.address },
  ];
  return (
    <>
      <div className="bg-[#f7f5f2] py-10 text-center">
        <h1 className="text-3xl font-medium md:text-4xl">Contact Us</h1>
        <nav aria-label="Breadcrumb" className="mt-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-black">Home</Link> <span className="mx-1">/</span> <span>Contact Us</span>
        </nav>
      </div>
      <section className="container-shop grid max-w-4xl gap-10 py-14 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-medium">We&apos;re here to help</h2>
          <p className="mt-4 leading-relaxed text-neutral-700">
            The quickest way to reach us is WhatsApp. Ask about a fragrance, place an order or check on a delivery and we will reply as soon as we can.
          </p>
          <a href={whatsappLink(s, "Hello! I have a question.")} target="_blank" rel="noopener noreferrer" className="btn-wa mt-6">
            <WhatsAppIcon className="h-5 w-5" /> Chat on WhatsApp
          </a>
        </div>
        <address className="not-italic">
          <dl className="divide-y divide-neutral-200 border border-neutral-200">
            {rows.map((r) => (
              <div key={r.k} className="flex gap-4 px-5 py-4 text-sm">
                <dt className="w-24 shrink-0 font-medium">{r.k}</dt>
                <dd className="text-neutral-700">{r.href ? <a href={r.href} className="hover:underline">{r.v}</a> : r.v}</dd>
              </div>
            ))}
          </dl>
        </address>
      </section>
    </>
  );
}

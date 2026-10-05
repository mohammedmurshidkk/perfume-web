import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `The story behind ${site.name}: long lasting perfumes blended in small batches from quality oils, at honest prices.`,
  alternates: { canonical: "/about" },
};

const values = [
  { title: "Quality oils", text: "We source concentrated perfume oils and blend them at high strength, so every spray lasts." },
  { title: "Small batches", text: "Each fragrance is mixed, rested and bottled in small runs, then checked by hand before it ships." },
  { title: "Honest prices", text: "Luxury-level fragrance without the luxury mark-up. What you see is what you pay." },
  { title: "Personal service", text: "Order on WhatsApp and talk to a real person who can help you pick the right scent." },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-[#f7f5f2] py-10 text-center">
        <h1 className="text-3xl font-medium md:text-4xl">About Us</h1>
        <nav aria-label="Breadcrumb" className="mt-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-black">Home</Link> <span className="mx-1">/</span> <span>About Us</span>
        </nav>
      </div>
      <section className="container-shop max-w-3xl py-14">
        <h2 className="text-2xl font-medium">Who we are</h2>
        <p className="mt-4 leading-relaxed text-neutral-700">
          {site.name} started with a simple idea: everyone deserves a perfume that smells expensive and lasts all day, without paying designer prices. We create our own blends of oud, amber, floral, woody and fresh fragrances for men and women, and sell them directly to you.
        </p>
        <p className="mt-4 leading-relaxed text-neutral-700">
          There is no checkout and no account to create. Find a fragrance you like, tap Buy, and WhatsApp opens with the product details ready to send. Our team replies to confirm your order, delivery address and payment.
        </p>
      </section>
      <section className="bg-[#f3ede4] py-14">
        <div className="container-shop grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <div key={v.title}>
              <h3 className="text-lg font-medium">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700">{v.text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-shop py-14 text-center">
        <Link href="/products" className="btn-dark">Shop the collection</Link>
      </section>
    </>
  );
}

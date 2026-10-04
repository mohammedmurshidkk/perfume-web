import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import ProductGrid from "@/components/home/ProductGrid";
import Story from "@/components/home/Story";
import Offers from "@/components/home/Offers";
import Testimonials from "@/components/home/Testimonials";
import Faq from "@/components/home/Faq";
import Cta from "@/components/home/Cta";
import JsonLd from "@/components/JsonLd";
import { getProducts, getSettings, getTestimonials } from "@/lib/db";
import { onOffer, whatsappLink } from "@/lib/format";
import { faqs } from "@/lib/faq";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [products, settings, testimonials] = await Promise.all([getProducts(), getSettings(), getTestimonials()]);
  const bestSellers = products.filter((p) => p.bestSeller).slice(0, 4);
  const offers = products.filter(onOffer);
  const signature = bestSellers[0] ?? products[0];
  const chat = whatsappLink(settings, "Hello! I'd like help choosing a perfume.");

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: site.name,
            url: site.url,
            potentialAction: { "@type": "SearchAction", target: `${site.url}/products?q={search_term_string}`, "query-input": "required name=search_term_string" },
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          },
        ]}
      />
      <Hero product={signature} whatsappHref={chat} video={site.heroVideo || undefined} />
      <Manifesto />
      <ProductGrid
        id="best-sellers"
        eyebrow="Most loved"
        title="Best sellers"
        intro="The fragrances our customers reorder again and again. Long lasting, compliment pulling and made in small batches."
        products={bestSellers}
        settings={settings}
        siteUrl={site.url}
      />
      {signature && <Story product={signature} />}
      <Offers products={offers} settings={settings} siteUrl={site.url} />
      <Testimonials items={testimonials} />
      <Faq items={faqs} />
      <Cta products={products.slice(0, 3)} whatsappHref={chat} />
    </>
  );
}

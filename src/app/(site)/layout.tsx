import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import SmoothScroll from "@/components/motion/SmoothScroll";
import Preloader from "@/components/motion/Preloader";
import Cursor from "@/components/motion/Cursor";
import { getSettings } from "@/lib/db";
import { whatsappLink } from "@/lib/format";
import { site } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: site.name,
          url: site.url,
          logo: `${site.url}/icon.svg`,
          email: settings.email,
          telephone: settings.phone,
          address: { "@type": "PostalAddress", streetAddress: settings.address },
          sameAs: settings.instagram ? [settings.instagram] : [],
          contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            telephone: `+${settings.whatsapp}`,
            availableLanguage: ["English", "Malayalam", "Hindi", "Arabic"],
          },
        }}
      />
      <Preloader />
      <SmoothScroll />
      <Cursor />
      <Header whatsappHref={whatsappLink(settings, "Hello! I'd like to know more about your perfumes.")} announcement={settings.announcement} />
      <main>{children}</main>
      <Footer settings={settings} />
    </>
  );
}

import ShopHeader from "@/components/shop/ShopHeader";
import ShopFooter from "@/components/shop/ShopFooter";
import JsonLd from "@/components/JsonLd";
import { getSettings } from "@/lib/db";
import { whatsappLink } from "@/lib/format";
import { site } from "@/lib/site";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <div className="shop min-h-dvh">
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
      <ShopHeader whatsappHref={whatsappLink(settings, "Hello! I'd like to know more about your perfumes.")} announcement={settings.announcement} />
      <main>{children}</main>
      <ShopFooter settings={settings} />
    </div>
  );
}

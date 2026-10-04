import { getSettings } from "@/lib/db";
import { saveSettings } from "../../actions";
import { btn, card, input, label } from "@/components/admin/ui";

export default async function AdminSettings({ searchParams }: PageProps<"/admin/settings">) {
  const [s, sp] = await Promise.all([getSettings({ fresh: true }), searchParams]);
  const fields: { k: keyof typeof s; l: string; hint?: string; wide?: boolean }[] = [
    { k: "whatsapp", l: "WhatsApp number *", hint: "With country code, digits only. Example: 919876543210" },
    { k: "phone", l: "Display phone" },
    { k: "email", l: "Email" },
    { k: "instagram", l: "Instagram URL" },
    { k: "currencySymbol", l: "Currency symbol" },
    { k: "currencyCode", l: "Currency code", hint: "Used for Google product data, e.g. INR, AED" },
    { k: "address", l: "Address", wide: true },
    { k: "announcement", l: "Announcement bar", hint: "Leave empty to hide the bar at the top of the site", wide: true },
  ];
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-4xl">Settings</h1>
      <p className="mb-8 text-sm text-muted">The WhatsApp number receives every Buy click from the website.</p>
      {sp.saved && <p className="mb-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Settings saved.</p>}
      <form action={saveSettings} className={card + " grid gap-5 sm:grid-cols-2"}>
        {fields.map((f) => (
          <div key={f.k} className={f.wide ? "sm:col-span-2" : ""}>
            <label className={label} htmlFor={f.k}>{f.l}</label>
            <input id={f.k} name={f.k} defaultValue={s[f.k]} required={f.k === "whatsapp"} className={input} />
            {f.hint && <p className="mt-1 text-xs text-muted">{f.hint}</p>}
          </div>
        ))}
        <div><button className={btn}>Save settings</button></div>
      </form>
    </div>
  );
}

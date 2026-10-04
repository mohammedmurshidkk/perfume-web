import ProductForm from "@/components/admin/ProductForm";
import { getSettings } from "@/lib/db";

export default async function NewProduct() {
  const settings = await getSettings();
  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-8 font-display text-4xl">Add product</h1>
      <ProductForm currency={settings.currencySymbol} />
    </div>
  );
}

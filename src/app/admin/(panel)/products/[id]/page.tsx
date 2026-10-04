import Link from "next/link";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import { getProducts, getSettings } from "@/lib/db";

export default async function EditProduct({ params }: PageProps<"/admin/products/[id]">) {
  const { id } = await params;
  const [products, settings] = await Promise.all([getProducts({ includeInactive: true }), getSettings()]);
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4">
        <h1 className="font-display text-4xl">Edit {product.name}</h1>
        <Link href={`/products/${product.slug}`} target="_blank" className="text-sm text-gold hover:underline">View on website ↗</Link>
      </div>
      <ProductForm product={product} currency={settings.currencySymbol} />
    </div>
  );
}

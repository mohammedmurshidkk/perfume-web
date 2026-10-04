import Image from "next/image";
import Bottle from "./Bottle";
import type { Product } from "@/lib/types";

// Uses the uploaded photo when there is one, otherwise the illustrated bottle in the product's colour.
export default function ProductImage({
  product,
  index = 0,
  className = "",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
}: {
  product: Product;
  index?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const src = product.images[index];
  if (src) {
    return (
      <Image
        src={src}
        alt={`${product.name} ${product.category.toLowerCase()} perfume ${product.sizeMl}ml`}
        fill
        sizes={sizes}
        priority={priority}
        unoptimized={src.startsWith("http") || src.startsWith("/uploads")}
        className={`object-cover ${className}`}
      />
    );
  }
  return (
    <Bottle
      color={product.color}
      shape={product.bottle}
      className={className}
      title={`${product.name} ${product.category} perfume bottle`}
    />
  );
}

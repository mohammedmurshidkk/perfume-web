"use client";
import { useState } from "react";
import ProductImage from "@/components/ProductImage";
import Bottle from "@/components/Bottle";
import type { Product } from "@/lib/types";

// Main photo with clickable thumbnails. Falls back to the illustrated bottle when there are no photos.
export default function ProductPhotos({ product: p }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  const photos = p.images.length;
  return (
    <div>
      <div className="relative aspect-square overflow-hidden bg-[#f5f3f0]">
        {photos ? (
          <ProductImage product={p} index={idx} priority sizes="(min-width: 768px) 50vw, 100vw" />
        ) : (
          <div className="absolute inset-x-[25%] inset-y-[8%]">
            <Bottle color={p.color} shape={p.bottle} className="h-full w-full" title={`${p.name} perfume bottle`} />
          </div>
        )}
      </div>
      {photos > 1 && (
        <div className="mt-3 flex gap-3">
          {p.images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show image ${i + 1}`}
              className={`relative h-20 w-20 overflow-hidden border bg-[#f5f3f0] ${i === idx ? "border-black" : "border-neutral-200"}`}
            >
              <ProductImage product={p} index={i} sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

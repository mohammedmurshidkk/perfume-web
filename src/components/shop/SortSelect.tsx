"use client";

// Submits the surrounding filter form as soon as a new sort order is picked.
export default function SortSelect({ value }: { value: string }) {
  return (
    <select
      name="sort"
      defaultValue={value}
      aria-label="Sort products"
      onChange={(e) => e.currentTarget.form?.requestSubmit()}
      className="border border-neutral-300 bg-white px-3 py-2 text-sm outline-none"
    >
      <option value="featured">Default sorting</option>
      <option value="newest">Sort by latest</option>
      <option value="price-asc">Price: low to high</option>
      <option value="price-desc">Price: high to low</option>
    </select>
  );
}

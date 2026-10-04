import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-6xl text-cream md:text-8xl">This scent has faded.</h1>
      <p className="mt-6 text-cream/60">The page you are looking for doesn&apos;t exist or has moved.</p>
      <Link href="/products" className="mt-10 rounded-full bg-gold px-8 py-4 text-sm font-semibold tracking-[0.14em] text-ink uppercase">Browse the collection</Link>
    </section>
  );
}

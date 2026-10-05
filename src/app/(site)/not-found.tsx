import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-shop flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-6xl font-medium">404</p>
      <h1 className="mt-4 text-2xl font-medium">Page not found</h1>
      <p className="mt-3 text-neutral-600">The page you are looking for doesn&apos;t exist or has moved.</p>
      <Link href="/products" className="btn-dark mt-8">Browse perfumes</Link>
    </section>
  );
}

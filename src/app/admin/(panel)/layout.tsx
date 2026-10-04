import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logout } from "../actions";
import AdminNav from "@/components/admin/AdminNav";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  return (
    <div className="md:flex">
      <aside className="border-b border-white/10 bg-ink-2 md:sticky md:top-0 md:h-dvh md:w-60 md:shrink-0 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between p-5 md:block">
          <Link href="/admin" className="font-display text-2xl tracking-[0.14em]">ÉLAN <span className="text-sm tracking-normal text-muted">admin</span></Link>
          <form action={logout} className="md:hidden"><button className="text-sm text-muted hover:text-gold">Log out</button></form>
        </div>
        <AdminNav />
        <div className="hidden space-y-2 p-5 md:absolute md:bottom-0 md:block">
          <Link href="/" target="_blank" className="block text-sm text-muted hover:text-gold">View website ↗</Link>
          <form action={logout}><button className="text-sm text-muted hover:text-gold">Log out</button></form>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10">{children}</main>
    </div>
  );
}

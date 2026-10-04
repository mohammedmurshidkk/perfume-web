"use client";
import { useActionState } from "react";
import { login } from "../actions";
import { btn, input, label } from "@/components/admin/ui";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);
  return (
    <main className="flex min-h-dvh items-center justify-center px-5">
      <form action={action} className="w-full max-w-sm rounded-3xl border border-white/10 bg-ink-2 p-8">
        <p className="font-display text-3xl tracking-[0.14em]">MAISON <span className="text-gold">ÉLAN</span></p>
        <p className="mt-1 text-sm text-muted">Admin panel</p>
        <div className="mt-8">
          <label htmlFor="password" className={label}>Password</label>
          <input id="password" name="password" type="password" required autoFocus className={input} />
        </div>
        {state?.error && <p className="mt-3 text-sm text-red-300">{state.error}</p>}
        <button className={`${btn} mt-6 w-full`} disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

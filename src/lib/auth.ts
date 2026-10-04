import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "elan_admin";
const MAX_AGE = 60 * 60 * 24 * 7;

function password() {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function secret() {
  return process.env.ADMIN_SECRET || `elan:${password()}`;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}

export function checkPassword(input: string) {
  const a = Buffer.from(input);
  const b = Buffer.from(password());
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function createSession() {
  const expires = Date.now() + MAX_AGE * 1000;
  const value = `${expires}.${sign(String(expires))}`;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [expires, sig] = raw.split(".");
  if (!expires || !sig || Number(expires) < Date.now()) return false;
  const expected = sign(expires);
  return sig.length === expected.length && timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

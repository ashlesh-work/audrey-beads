"use server";

import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/lib/store";
import { SESSION_COOKIE } from "@/lib/auth";

function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export type SignInState = { error?: string };

// Email + password checked against env (ADMIN_EMAIL / ADMIN_PASSWORD), constant-time.
export async function signIn(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const okEmail = safeEqual(email.trim().toLowerCase(), (process.env.ADMIN_EMAIL || "").toLowerCase());
  const okPass = safeEqual(password, process.env.ADMIN_PASSWORD || "");
  if (!okEmail || !okPass) {
    return { error: "Wrong email or password. Please try again." };
  }

  const sid = createSession();
  (await cookies()).set(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE !== "false",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function signOut() {
  const store = await cookies();
  const sid = store.get(SESSION_COOKIE)?.value;
  if (sid) deleteSession(sid);
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

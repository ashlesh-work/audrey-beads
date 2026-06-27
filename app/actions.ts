"use server";

import { addOrder } from "@/lib/store";

// Public order submission → saved to the local database. Honeypot + length caps reduce spam.
export async function placeOrder(
  formData: FormData
): Promise<{ ok: boolean; error?: string }> {
  if (formData.get("company")) return { ok: true }; // honeypot tripped → silently drop

  const name = String(formData.get("name") || "").trim().slice(0, 80);
  const style = String(formData.get("style") || "").trim().slice(0, 120);
  const message = String(formData.get("message") || "").trim().slice(0, 500);

  if (!name || !style) {
    return { ok: false, error: "Please add your name and which style you'd like." };
  }

  try {
    addOrder({ name, style, message });
    return { ok: true };
  } catch {
    return { ok: false, error: "Something went wrong — please try again." };
  }
}

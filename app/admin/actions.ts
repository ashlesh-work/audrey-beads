"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import * as store from "@/lib/store";
import type { OrderStatus, Product, SiteContent, Testimonial } from "@/lib/types";

export async function saveContent(data: SiteContent) {
  await assertAdmin();
  store.saveContent(data);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function addProduct(): Promise<Product> {
  await assertAdmin();
  const created = store.addProduct();
  revalidatePath("/");
  return created;
}

export async function updateProduct(
  id: string,
  patch: Partial<Pick<Product, "name" | "tag" | "description" | "image_url">>
) {
  await assertAdmin();
  store.updateProduct(id, patch);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProduct(id: string) {
  await assertAdmin();
  store.deleteProduct(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function reorderProducts(ids: string[]) {
  await assertAdmin();
  store.reorderProducts(ids);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  await assertAdmin();
  store.setOrderStatus(id, status);
  revalidatePath("/admin");
}

export async function deleteOrder(id: string) {
  await assertAdmin();
  store.deleteOrder(id);
  revalidatePath("/admin");
}

export async function addTestimonial(): Promise<Testimonial> {
  await assertAdmin();
  const created = store.addTestimonial();
  revalidatePath("/");
  return created;
}

export async function updateTestimonial(
  id: string,
  patch: Partial<Pick<Testimonial, "name" | "text" | "image_url">>
) {
  await assertAdmin();
  store.updateTestimonial(id, patch);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteTestimonial(id: string) {
  await assertAdmin();
  store.deleteTestimonial(id);
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function reorderTestimonials(ids: string[]) {
  await assertAdmin();
  store.reorderTestimonials(ids);
  revalidatePath("/");
  revalidatePath("/admin");
}


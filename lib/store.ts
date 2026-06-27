import crypto from "node:crypto";
import db from "./db";
import { DEFAULT_CONTENT } from "./defaults";
import type { Order, OrderStatus, Product, SiteContent, Testimonial } from "@/lib/types";

/* ---------- content ---------- */
export function getContent(): SiteContent {
  const row = db.prepare("select data from site_content where id = 'main'").get() as
    | { data: string }
    | undefined;
  let parsed: Partial<SiteContent> = {};
  try {
    parsed = row ? JSON.parse(row.data) : {};
  } catch {
    parsed = {};
  }
  return { ...DEFAULT_CONTENT, ...parsed };
}

export function saveContent(data: SiteContent) {
  db.prepare("update site_content set data = ? where id = 'main'").run(JSON.stringify(data));
}

/* ---------- products ---------- */
export function listProducts(): Product[] {
  return db.prepare("select * from products order by sort asc").all() as Product[];
}

export function addProduct(): Product {
  const max = db.prepare("select max(sort) as m from products").get() as { m: number | null };
  const sort = (max.m ?? 0) + 1;
  const id = crypto.randomUUID();
  db.prepare(
    "insert into products (id, name, tag, description, image_url, sort, created_at) values (?,?,?,?,?,?,?)"
  ).run(id, "New bracelet", "New", "Describe this style…", "", sort, new Date().toISOString());
  return db.prepare("select * from products where id = ?").get(id) as Product;
}

export function updateProduct(
  id: string,
  patch: Partial<Pick<Product, "name" | "tag" | "description" | "image_url">>
) {
  const fields = Object.keys(patch);
  if (fields.length === 0) return;
  const set = fields.map((f) => `${f} = @${f}`).join(", ");
  db.prepare(`update products set ${set} where id = @id`).run({ ...patch, id });
}

export function deleteProduct(id: string) {
  db.prepare("delete from products where id = ?").run(id);
}

export function reorderProducts(ids: string[]) {
  const upd = db.prepare("update products set sort = ? where id = ?");
  const tx = db.transaction((list: string[]) => list.forEach((id, i) => upd.run(i + 1, id)));
  tx(ids);
}

/* ---------- orders ---------- */
export function listOrders(): Order[] {
  return db.prepare("select * from orders order by created_at desc").all() as Order[];
}

export function addOrder(o: { name: string; style: string; message: string }) {
  db.prepare(
    "insert into orders (id, name, style, message, status, created_at) values (?,?,?,?,?,?)"
  ).run(crypto.randomUUID(), o.name, o.style, o.message, "New", new Date().toISOString());
}

export function setOrderStatus(id: string, status: OrderStatus) {
  db.prepare("update orders set status = ? where id = ?").run(status, id);
}

export function deleteOrder(id: string) {
  db.prepare("delete from orders where id = ?").run(id);
}

/* ---------- sessions (admin login) ---------- */
export function createSession(): string {
  const id = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days
  db.prepare("insert into sessions (id, expires_at) values (?, ?)").run(id, expires);
  return id;
}

export function isValidSession(id: string): boolean {
  const row = db.prepare("select expires_at from sessions where id = ?").get(id) as
    | { expires_at: number }
    | undefined;
  if (!row) return false;
  if (row.expires_at < Date.now()) {
    db.prepare("delete from sessions where id = ?").run(id);
    return false;
  }
  return true;
}

export function deleteSession(id: string) {
  db.prepare("delete from sessions where id = ?").run(id);
}

/* ---------- testimonials ---------- */
export function listTestimonials(): Testimonial[] {
  return db.prepare("select * from testimonials order by sort asc").all() as Testimonial[];
}

export function addTestimonial(): Testimonial {
  const max = db.prepare("select max(sort) as m from testimonials").get() as { m: number | null };
  const sort = (max.m ?? 0) + 1;
  const id = crypto.randomUUID();
  db.prepare(
    "insert into testimonials (id, name, text, image_url, sort, created_at) values (?,?,?,?,?,?)"
  ).run(id, "New Friend/Stall", "Write customer quote or event details here...", "", sort, new Date().toISOString());
  return db.prepare("select * from testimonials where id = ?").get(id) as Testimonial;
}

export function updateTestimonial(
  id: string,
  patch: Partial<Pick<Testimonial, "name" | "text" | "image_url">>
) {
  const fields = Object.keys(patch);
  if (fields.length === 0) return;
  const set = fields.map((f) => `${f} = @${f}`).join(", ");
  db.prepare(`update testimonials set ${set} where id = @id`).run({ ...patch, id });
}

export function deleteTestimonial(id: string) {
  db.prepare("delete from testimonials where id = ?").run(id);
}

export function reorderTestimonials(ids: string[]) {
  const upd = db.prepare("update testimonials set sort = ? where id = ?");
  const tx = db.transaction((list: string[]) => list.forEach((id, i) => upd.run(i + 1, id)));
  tx(ids);
}


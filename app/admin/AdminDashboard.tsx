"use client";

import { useEffect, useRef, useState } from "react";
import type { Order, OrderStatus, Product, SiteContent, Testimonial } from "@/lib/types";
import {
  saveContent,
  addProduct,
  updateProduct,
  deleteProduct,
  reorderProducts,
  setOrderStatus,
  deleteOrder,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from "./actions";
import { signOut } from "./auth-actions";

const STATUSES: OrderStatus[] = ["New", "Making", "Ready", "Delivered"];

type Props = {
  email: string;
  brand: string;
  content: SiteContent;
  products: Product[];
  orders: Order[];
  testimonials: Testimonial[];
};

export default function AdminDashboard(props: Props) {
  const [tab, setTab] = useState<"content" | "creations" | "orders" | "community">("content");
  const [content, setContent] = useState<SiteContent>(props.content);
  const [products, setProducts] = useState<Product[]>(props.products);
  const [orders, setOrders] = useState<Order[]>(props.orders);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(props.testimonials);
  const [toast, setToast] = useState("");

  function flash(msg: string) {
    setToast(msg);
    window.clearTimeout((flash as any)._t);
    (flash as any)._t = window.setTimeout(() => setToast(""), 1800);
  }

  const activeOrders = orders.filter((o) => o.status !== "Delivered").length;

  return (
    <div className="admin-shell">
      <div className="admin-bar">
        <span className="brand"><span className="dot" />Admin · {props.brand}</span>
        <div className="admin-nav">
          <button className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>📝 Content</button>
          <button className={tab === "creations" ? "active" : ""} onClick={() => setTab("creations")}>🧷 Creations</button>
          <button className={tab === "community" ? "active" : ""} onClick={() => setTab("community")}>🗣️ Community</button>
          <button className={tab === "orders" ? "active" : ""} onClick={() => setTab("orders")}>
            📦 Orders{activeOrders > 0 && <span className="admin-count">{activeOrders}</span>}
          </button>
        </div>
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          <a className="btn ghost" href="/" target="_blank" style={{ height: 40 }}>View site ↗</a>
          <button className="btn" onClick={() => signOut()} style={{ height: 40 }}>Sign out</button>
        </div>
      </div>

      <div className="admin-inner admin">
        {/* CONTENT */}
        {tab === "content" && (
          <section>
            <h4>Brand &amp; hero</h4>
            <Field label="Brand name" value={content.brand} onChange={(v) => setContent({ ...content, brand: v })} />
            <Field label="Hero intro line" textarea value={content.heroLead} onChange={(v) => setContent({ ...content, heroLead: v })} />
            <div className="row">
              <Field grow label="Badge 1" value={content.badge1} onChange={(v) => setContent({ ...content, badge1: v })} />
              <Field grow label="Badge 2" value={content.badge2} onChange={(v) => setContent({ ...content, badge2: v })} />
              <Field grow label="Badge 3" value={content.badge3} onChange={(v) => setContent({ ...content, badge3: v })} />
            </div>

            <h4>How to buy</h4>
            <Field label="Online note" textarea value={content.onlineText} onChange={(v) => setContent({ ...content, onlineText: v })} />
            <div className="row">
              <Field grow label="Society / stall name" value={content.stallSociety} onChange={(v) => setContent({ ...content, stallSociety: v })} />
              <Field grow label="Stall day & time" value={content.stallTime} onChange={(v) => setContent({ ...content, stallTime: v })} />
            </div>

            <h4>About Audrey</h4>
            <Field label="Paragraph 1" textarea value={content.about1} onChange={(v) => setContent({ ...content, about1: v })} />
            <Field label="Paragraph 2" textarea value={content.about2} onChange={(v) => setContent({ ...content, about2: v })} />

            <div className="row" style={{ marginTop: "1rem" }}>
              <button
                className="btn"
                onClick={async () => {
                  await saveContent(content);
                  flash("Saved! 🎉");
                }}
              >
                💾 Save content
              </button>
            </div>
          </section>
        )}

        {/* CREATIONS */}
        {tab === "creations" && (
          <section>
            <h4>Creations — photos &amp; styles</h4>
            {products.map((p, i) => (
              <ProductRow
                key={p.id}
                product={p}
                isFirst={i === 0}
                isLast={i === products.length - 1}
                onChange={(patch) => setProducts((prev) => prev.map((x) => (x.id === p.id ? { ...x, ...patch } : x)))}
                onSaved={() => flash("Saved! ✅")}
                onDeleted={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))}
                onMove={async (dir) => {
                  const idx = products.findIndex((x) => x.id === p.id);
                  const j = dir === "up" ? idx - 1 : idx + 1;
                  if (j < 0 || j >= products.length) return;
                  const next = [...products];
                  [next[idx], next[j]] = [next[j], next[idx]];
                  setProducts(next);
                  await reorderProducts(next.map((x) => x.id));
                }}
              />
            ))}
            <button
              className="btn ghost"
              style={{ width: "100%" }}
              onClick={async () => {
                const created = await addProduct();
                setProducts((prev) => [...prev, created]);
              }}
            >
              ＋ Add a creation
            </button>
          </section>
        )}

        {/* ORDERS */}
        {tab === "orders" && (
          <section>
            <h4>Orders <span style={{ textTransform: "none", letterSpacing: 0, color: "var(--muted)", fontWeight: 500, fontSize: ".78rem" }}>· {orders.length} total</span></h4>
            {orders.length === 0 && <div className="empty">No orders yet. When someone sends an order from your site, it appears here. 📦</div>}
            {orders.map((o) => (
              <div className="order" key={o.id}>
                <div className="ot">
                  <div>
                    <div className="oname">{o.name}</div>
                    <div className="ostyle">{o.style}</div>
                    {o.message && <div className="omsg">“{o.message}”</div>}
                    <div className="odate">{new Date(o.created_at).toLocaleString()}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".45rem", alignItems: "flex-end" }}>
                    <select
                      value={o.status}
                      aria-label="Order status"
                      onChange={async (e) => {
                        const status = e.target.value as OrderStatus;
                        setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status } : x)));
                        await setOrderStatus(o.id, status);
                      }}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <button
                      className="mini-link"
                      onClick={async () => {
                        setOrders((prev) => prev.filter((x) => x.id !== o.id));
                        await deleteOrder(o.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* COMMUNITY / TESTIMONIALS */}
        {tab === "community" && (
          <section>
            <h4>Community Testimonials &amp; Photos</h4>
            {testimonials.map((t, i) => (
              <TestimonialRow
                key={t.id}
                testimonial={t}
                isFirst={i === 0}
                isLast={i === testimonials.length - 1}
                onChange={(patch) => setTestimonials((prev) => prev.map((x) => (x.id === t.id ? { ...x, ...patch } : x)))}
                onSaved={() => flash("Saved! ✅")}
                onDeleted={() => setTestimonials((prev) => prev.filter((x) => x.id !== t.id))}
                onMove={async (dir) => {
                  const idx = testimonials.findIndex((x) => x.id === t.id);
                  const j = dir === "up" ? idx - 1 : idx + 1;
                  if (j < 0 || j >= testimonials.length) return;
                  const next = [...testimonials];
                  [next[idx], next[j]] = [next[j], next[idx]];
                  setTestimonials(next);
                  await reorderTestimonials(next.map((x) => x.id));
                }}
              />
            ))}
            <button
              className="btn ghost"
              style={{ width: "100%" }}
              onClick={async () => {
                const created = await addTestimonial();
                setTestimonials((prev) => [...prev, created]);
              }}
            >
              ＋ Add a testimonial / event photo
            </button>
          </section>
        )}
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}

/* ---------- Field ---------- */
function Field({
  label,
  value,
  onChange,
  textarea,
  grow,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  grow?: boolean;
}) {
  return (
    <div className="field" style={grow ? { flex: 1 } : undefined}>
      <label>{label}</label>
      {textarea ? (
        <textarea rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

/* ---------- ProductRow ---------- */
function ProductRow({
  product,
  isFirst,
  isLast,
  onChange,
  onSaved,
  onDeleted,
  onMove,
}: {
  product: Product;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<Product>) => void;
  onSaved: () => void;
  onDeleted: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [cleanBg, setCleanBg] = useState(true);
  const [before, setBefore] = useState<string>("");

  useEffect(() => {
    return () => {
      if (before) URL.revokeObjectURL(before);
    };
  }, [before]);

  async function upload(file: File) {
    setBusy(true);
    const localPreview = URL.createObjectURL(file);
    setBefore(localPreview);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("cleanBg", String(cleanBg));
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange({ image_url: json.url });
      await updateProduct(product.id, { image_url: json.url });
      onSaved();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pe">
      <div className="pe-top">
        {product.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pe-thumb" src={product.image_url} alt="" />
        ) : (
          <div className="pe-thumb">🧷</div>
        )}
        <input
          value={product.name}
          placeholder="Name"
          onChange={(e) => onChange({ name: e.target.value })}
          style={{ flex: 1, padding: ".6rem .8rem", borderRadius: "10px", border: "1.5px solid var(--hairline)", background: "var(--canvas)", color: "var(--ink)", font: "inherit" }}
        />
      </div>

      <div className="field">
        <input value={product.tag} placeholder="Tag (e.g. New) — optional" onChange={(e) => onChange({ tag: e.target.value })} />
      </div>
      <div className="field">
        <textarea rows={2} value={product.description} placeholder="Short description" onChange={(e) => onChange({ description: e.target.value })} />
      </div>

      {before && (
        <div className="beforeafter">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <figure><img src={before} alt="before" /><figcaption>Before</figcaption></figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <figure><img src={product.image_url || before} alt="after" /><figcaption>After ✨</figcaption></figure>
        </div>
      )}

      <label style={{ display: "flex", gap: ".4rem", alignItems: "center", fontSize: ".84rem", color: "var(--muted)", margin: ".3rem 0 .6rem" }}>
        <input type="checkbox" checked={cleanBg} onChange={(e) => setCleanBg(e.target.checked)} style={{ width: "auto" }} />
        Clean up background on upload
      </label>

      <div className="row">
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        <button className="btn ghost" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Improving…" : product.image_url ? "📷 Replace photo" : "📷 Add photo"}
        </button>
        <button
          className="btn ghost"
          onClick={async () => {
            await updateProduct(product.id, { name: product.name, tag: product.tag, description: product.description });
            onSaved();
          }}
        >
          💾 Save
        </button>
        <button className="btn ghost" disabled={isFirst} onClick={() => onMove("up")} aria-label="Move up">↑</button>
        <button className="btn ghost" disabled={isLast} onClick={() => onMove("down")} aria-label="Move down">↓</button>
        <button
          className="mini-link"
          onClick={async () => {
            if (!confirm(`Delete "${product.name}"?`)) return;
            await deleteProduct(product.id);
            onDeleted();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

/* ---------- TestimonialRow ---------- */
function TestimonialRow({
  testimonial,
  isFirst,
  isLast,
  onChange,
  onSaved,
  onDeleted,
  onMove,
}: {
  testimonial: Testimonial;
  isFirst: boolean;
  isLast: boolean;
  onChange: (patch: Partial<Testimonial>) => void;
  onSaved: () => void;
  onDeleted: () => void;
  onMove: (dir: "up" | "down") => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [before, setBefore] = useState<string>("");

  useEffect(() => {
    return () => {
      if (before) URL.revokeObjectURL(before);
    };
  }, [before]);

  async function upload(file: File) {
    setBusy(true);
    const localPreview = URL.createObjectURL(file);
    setBefore(localPreview);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("cleanBg", "false"); // We want to keep the background for community/event/sale photos!
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Upload failed");
      onChange({ image_url: json.url });
      await updateTestimonial(testimonial.id, { image_url: json.url });
      onSaved();
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="pe">
      <div className="pe-top">
        {testimonial.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="pe-thumb" src={testimonial.image_url} alt="" />
        ) : (
          <div className="pe-thumb">🗣️</div>
        )}
        <input
          value={testimonial.name}
          placeholder="Name / Event (e.g. Mrs. Peterson or Saturday Market)"
          onChange={(e) => onChange({ name: e.target.value })}
          style={{ flex: 1, padding: ".6rem .8rem", borderRadius: "10px", border: "1.5px solid var(--hairline)", background: "var(--canvas)", color: "var(--ink)", font: "inherit" }}
        />
      </div>

      <div className="field">
        <textarea rows={3} value={testimonial.text} placeholder="Review text or event description..." onChange={(e) => onChange({ text: e.target.value })} />
      </div>

      {before && (
        <div className="beforeafter">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <figure><img src={before} alt="before" /><figcaption>Original</figcaption></figure>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <figure><img src={testimonial.image_url || before} alt="after" /><figcaption>Processed</figcaption></figure>
        </div>
      )}

      <div className="row">
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
        <button className="btn ghost" disabled={busy} onClick={() => fileRef.current?.click()}>
          {busy ? "Uploading…" : testimonial.image_url ? "📷 Replace photo" : "📷 Add photo"}
        </button>
        <button
          className="btn ghost"
          onClick={async () => {
            await updateTestimonial(testimonial.id, { name: testimonial.name, text: testimonial.text });
            onSaved();
          }}
        >
          💾 Save
        </button>
        <button className="btn ghost" disabled={isFirst} onClick={() => onMove("up")} aria-label="Move up">↑</button>
        <button className="btn ghost" disabled={isLast} onClick={() => onMove("down")} aria-label="Move down">↓</button>
        <button
          className="mini-link"
          onClick={async () => {
            if (!confirm(`Delete testimonial from "${testimonial.name}"?`)) return;
            await deleteTestimonial(testimonial.id);
            onDeleted();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

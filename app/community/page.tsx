import Link from "next/link";
import { getContent, getTestimonials } from "@/lib/content";
import ThemeToggle from "@/components/ThemeToggle";
import RevealInit from "@/components/RevealInit";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const content = await getContent();
  const testimonials = await getTestimonials();

  return (
    <>
      <RevealInit />

      {/* HEADER */}
      <header>
        <div className="wrap nav">
          <Link className="brand" href="/">
            <span className="dot" />
            {content.brand}
          </Link>
          <div className="tools">
            <ThemeToggle />
            <Link className="btn ghost" href="/" style={{ height: 38, padding: "0 1rem", fontSize: ".85rem" }}>
              ← Back to homepage
            </Link>
          </div>
        </div>
      </header>

      <main style={{ minHeight: "70vh", paddingBottom: "4rem" }}>
        <section style={{ background: "var(--soft)" }}>
          <div className="wrap">
            <div className="head" style={{ marginBottom: "3rem" }}>
              <span className="eyebrow">Community support</span>
              <h2>What people are saying! 💖</h2>
              <p>Audrey&apos;s beaded bracelets loved and worn by friends, teachers, and market visitors.</p>
            </div>

            {testimonials.length === 0 ? (
              <div className="empty" style={{ background: "var(--card)", borderRadius: "var(--r-xl)", padding: "4rem 2rem", boxShadow: "var(--clay-sm)" }}>
                No testimonials added yet. Keep sharing the love! ✨
              </div>
            ) : (
              <div className="grid g3">
                {testimonials.map((t, idx) => (
                  <article className="product reveal" key={t.id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                    <div>
                      <div className="thumb" style={{ background: "var(--soft)", display: "grid", placeItems: "center", aspectRatio: "4/3", overflow: "hidden", position: "relative" }}>
                        {t.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.image_url} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ fontSize: "3rem", filter: "grayscale(0.3)", userSelect: "none" }}>🗣️</div>
                        )}
                      </div>
                      <p style={{ fontStyle: "italic", fontSize: "0.96rem", color: "var(--body)", margin: "0.8rem 0 1.2rem", lineHeight: "1.6" }}>
                        “{t.text}”
                      </p>
                    </div>
                    <div style={{ borderTop: "1px solid var(--hairline)", paddingTop: "0.8rem", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "auto" }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: idx % 3 === 0 ? "var(--pink)" : idx % 3 === 1 ? "var(--mint)" : "var(--lavender)" }} />
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)" }}>{t.name}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <Link className="brand" href="/"><span className="dot" />{content.brand}</Link>
          <p>Handmade beaded bracelets · Online &amp; at the stall in {content.stallSociety}</p>
          <p style={{ fontSize: ".85rem" }}>Made with 💜 by Audrey, age 11</p>
        </div>
      </footer>
    </>
  );
}

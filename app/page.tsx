import Link from "next/link";
import { getContent, getProducts, getTestimonials } from "@/lib/content";
import ThemeToggle from "@/components/ThemeToggle";
import RevealInit from "@/components/RevealInit";
import OrderForm from "@/components/OrderForm";
import { HeroStrand, MiniStrand } from "@/components/Beads";

// Always render the latest content/products (admin edits show immediately).
export const dynamic = "force-dynamic";

const wordStyles = [
  { top: "15%", left: "10%", transform: "rotate(-5deg)", color: "var(--pink)" },
  { top: "10%", right: "15%", transform: "rotate(7deg)", color: "var(--lavender)" },
  { top: "40%", left: "30%", transform: "rotate(10deg)", color: "var(--ochre)" },
  { top: "25%", right: "35%", transform: "rotate(-8deg)", color: "var(--mint)" },
  { bottom: "20%", left: "12%", transform: "rotate(6deg)", color: "var(--peach)" },
  { bottom: "15%", right: "12%", transform: "rotate(-12deg)", color: "var(--pink)" },
  { bottom: "40%", right: "28%", transform: "rotate(4deg)", color: "var(--lavender)" },
  { top: "50%", left: "8%", transform: "rotate(-15deg)", color: "var(--mint)" },
  { top: "50%", right: "8%", transform: "rotate(12deg)", color: "var(--ochre)" },
  { bottom: "45%", left: "45%", transform: "rotate(-4deg)", color: "var(--peach)" },
];

function getWordCloud(testimonials: any[]) {
  const allText = testimonials.map(t => (t.text || "") + " " + (t.name || "")).join(" ").toLowerCase();
  const words = allText.match(/\b[a-z]{4,}\b/g) || [];
  const stopwords = new Set([
    "with", "this", "that", "from", "your", "have", "they", "their", "them", 
    "some", "here", "were", "there", "about", "would", "could", "should", "will",
    "designed", "custom", "matching", "bracelet", "bracelets", "handcrafted",
    "making", "visited", "bought", "three", "first", "market", "school", "also",
    "these"
  ]);
  const freq: Record<string, number> = {};
  for (const w of words) {
    if (!stopwords.has(w)) {
      freq[w] = (freq[w] || 0) + 1;
    }
  }
  const list = Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({ word, weight: count }));

  const defaultWords = ["love", "beautiful", "handmade", "friendship", "happy", "colorful", "gift", "quality", "maker", "special", "creative", "joy"];
  if (list.length < 8) {
    const existing = new Set(list.map(item => item.word));
    for (const word of defaultWords) {
      if (!existing.has(word)) {
        list.push({ word, weight: 1 });
        if (list.length >= 10) break;
      }
    }
  }
  return list;
}

export default async function Home() {
  const content = await getContent();
  const products = await getProducts();
  const testimonials = await getTestimonials();
  const wordCloud = getWordCloud(testimonials);

  const collageImages = testimonials.map(t => t.image_url).filter(Boolean);
  const fallbackCollage = [
    { url: "", bg: "var(--pink)", emoji: "🌸", label: "Friendship" },
    { url: "", bg: "var(--lavender)", emoji: "🧒🏻", label: "Handmade" },
    { url: "", bg: "var(--mint)", emoji: "🏡", label: "Local Market" },
    { url: "", bg: "var(--peach)", emoji: "💖", label: "Community" }
  ];

  const collageItems: { url: string; bg: string; emoji: string; label: string }[] = [];
  collageImages.forEach((url) => {
    collageItems.push({ url, bg: "", emoji: "", label: "" });
  });
  for (let i = collageItems.length; i < 4; i++) {
    collageItems.push(fallbackCollage[i % 4]);
  }

  return (
    <>
      <RevealInit />

      {/* HEADER */}
      <header>
        <div className="wrap nav">
          <a className="brand" href="#top">
            <span className="dot" />
            {content.brand}
          </a>
          <nav className="links" aria-label="Main">
            <a href="#why">Why handmade</a>
            <a href="#gallery">Creations</a>
            <a href="#community">Community</a>
            <a href="#facts">Bead facts</a>
            <a href="#buy">How to buy</a>
            <a href="#order">Order</a>
          </nav>
          <div className="tools">
            <ThemeToggle />
            <Link className="icon-btn" href="/admin" title="Admin" aria-label="Admin">
              🔑
            </Link>
          </div>
        </div>
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="wrap hero-grid">
            <div>
              <span className="eyebrow">Handmade · Custom colors · One of a kind</span>
              <h1>
                Little bracelets, <span className="grad">big happiness</span> ✨
              </h1>
              <p className="lead">{content.heroLead}</p>
              <div className="hero-cta">
                <a className="btn" href="#order">💌 Order yours</a>
                <a className="btn ghost" href="#gallery">🌈 See my creations</a>
              </div>
              <div className="badges">
                <span className="badge">{content.badge1}</span>
                <span className="badge">{content.badge2}</span>
                <span className="badge">{content.badge3}</span>
              </div>
            </div>
            <div className="hero-art">
              <span className="float" style={{ width: 46, height: 46, top: "4%", left: "6%", background: "radial-gradient(circle at 35% 30%,#ffd98a,var(--ochre))" }} />
              <span className="float" style={{ width: 34, height: 34, top: "14%", right: "2%", background: "radial-gradient(circle at 35% 30%,#cdeee3,var(--mint))", animationDelay: "-2s" }} />
              <span className="float" style={{ width: 40, height: 40, bottom: "6%", left: "1%", background: "radial-gradient(circle at 35% 30%,#ffc0d6,var(--pink))", animationDelay: "-4s" }} />
              <div className="clay-card">
                <HeroStrand />
              </div>
            </div>
          </div>
        </section>

        {/* WHY HANDMADE */}
        <section id="why">
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow">Why you&apos;ll love them</span>
              <h2>Made by hand, made for you 💖</h2>
              <p>Every bracelet is created from scratch — no two are ever exactly alike.</p>
            </div>
            <div className="grid g4">
              <div className="feature f-pink reveal"><div className="fi">✋</div><h3>Handmade with love</h3><p>Each piece is threaded bead by bead by Audrey herself.</p></div>
              <div className="feature f-lav reveal"><div className="fi">🎨</div><h3>Your colors</h3><p>Tell me your favorite shades and I&apos;ll design it just for you.</p></div>
              <div className="feature f-peach reveal"><div className="fi">💎</div><h3>One of a kind</h3><p>No two bracelets are the same — yours is truly unique.</p></div>
              <div className="feature f-teal reveal"><div className="fi">🎁</div><h3>Perfect gifts</h3><p>A handmade bracelet is a little gift of friendship to share.</p></div>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="gallery" style={{ background: "var(--soft)" }}>
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow">The collection</span>
              <h2>My latest creations 🌟</h2>
              <p>Browse the styles — then order your favorite or ask for custom colors!</p>
            </div>
            <div className="grid g3">
              {products.length === 0 && (
                <p className="empty">New creations coming soon! ✨</p>
              )}
              {products.map((p, idx) => (
                <article className="product reveal" key={p.id}>
                  <div className="thumb">
                    {p.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image_url} alt={p.name} />
                    ) : (
                      <MiniStrand seed={idx} />
                    )}
                  </div>
                  {p.tag ? <span className="tag">{p.tag}</span> : null}
                  <h3>{p.name}</h3>
                  <p className="desc">{p.description}</p>
                  <div className="prow">
                    <span style={{ color: "var(--muted)", fontSize: ".85rem" }}>✨ Handmade</span>
                    <a className="btn" href="#order" style={{ height: 38, fontSize: ".85rem" }}>Order</a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* COMMUNITY / TESTIMONIALS */}
        <section id="community" style={{ background: "var(--soft)" }}>
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow">Community Love</span>
              <h2>Supported by you! 💖</h2>
              <p>Click on the photo collage below to read comments and stories from our amazing customers!</p>
            </div>
            
            <Link href="/community" className="collage-link-wrapper reveal">
              <div className="collage-container">
                {/* Collage Grid */}
                <div className="collage-grid">
                  {collageItems.slice(0, 4).map((item, idx) => (
                    <div
                      key={idx}
                      className={`collage-cell cell-${idx}`}
                      style={item.bg ? { background: item.bg } : undefined}
                    >
                      {item.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt="Community moment" className="collage-img" />
                      ) : (
                        <div className="collage-fallback">
                          <span className="collage-fallback-emoji">{item.emoji}</span>
                          <span className="collage-fallback-label">{item.label}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Word Cloud Overlay */}
                <div className="collage-overlay">
                  {wordCloud.map((item, idx) => {
                    const pos = wordStyles[idx % wordStyles.length];
                    const fontSize = Math.max(1.1, Math.min(2.8, 1.0 + item.weight * 0.45));
                    return (
                      <span
                        key={idx}
                        className="word-cloud-tag"
                        style={{
                          position: "absolute",
                          top: pos.top,
                          left: pos.left,
                          right: pos.right,
                          transform: pos.transform,
                          color: pos.color,
                          fontSize: `${fontSize}rem`,
                          fontWeight: 700,
                        }}
                      >
                        {item.word}
                      </span>
                    );
                  })}
                  <div className="collage-click-prompt">
                    <span>✨ Click to read all testimonials ✨</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* BEAD FACTS */}
        <section id="facts">
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow">Did you know?</span>
              <h2>Beads have an amazing story 📜</h2>
              <p>A few true, fascinating facts about the tiny treasures I work with.</p>
            </div>
            <div className="grid g4">
              <div className="fact reveal">
                <div className="fi">🐚</div>
                <h3>Older than almost everything</h3>
                <p>Beads are some of the oldest jewelry on Earth — shell beads found by scientists are about <strong>100,000 years old</strong>!</p>
                <a className="src" href="https://en.wikipedia.org/wiki/Bead" target="_blank" rel="noopener">Source: Wikipedia</a>
              </div>
              <div className="fact reveal">
                <div className="fi">🙏</div>
                <h3>&quot;Bead&quot; once meant &quot;prayer&quot;</h3>
                <p>Long ago people slid beads along a string to count their prayers, so the little beads took the name from the word for <strong>prayer</strong>.</p>
                <a className="src" href="https://www.etymonline.com/word/bead" target="_blank" rel="noopener">Source: Etymonline</a>
              </div>
              <div className="fact reveal">
                <div className="fi">💰</div>
                <h3>Beads were money!</h3>
                <p>Native American shell beads called <strong>wampum</strong> were so prized that settlers used them as real currency back in the 1600s.</p>
                <a className="src" href="https://www.britannica.com/money/wampum" target="_blank" rel="noopener">Source: Britannica</a>
              </div>
              <div className="fact reveal">
                <div className="fi">🤝</div>
                <h3>A promise you can wear</h3>
                <p>A handmade <strong>friendship bracelet</strong> is given to mean a friendship that&apos;s strong and lasts forever.</p>
                <a className="src" href="https://en.wikipedia.org/wiki/Friendship_bracelet" target="_blank" rel="noopener">Source: Wikipedia</a>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO BUY */}
        <section id="buy" style={{ background: "var(--soft)" }}>
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow">Two easy ways</span>
              <h2>Get your bracelet 🛍️</h2>
              <p>Order online from anywhere, or come say hi at the stall!</p>
            </div>
            <div className="grid g2">
              <div className="buy reveal">
                <div className="ic">💻</div>
                <h3>Order online</h3>
                <p>{content.onlineText}</p>
                <a className="btn" href="#order">Order online</a>
              </div>
              <div className="buy reveal">
                <div className="ic">🏡</div>
                <h3>Visit the stall</h3>
                <p>
                  Find me at my stall in <strong>{content.stallSociety}</strong> on{" "}
                  <strong>{content.stallTime}</strong>. Try them on and take one home the same day!
                </p>
                <a className="btn ghost" href="#order">Get stall details</a>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about">
          <div className="wrap about">
            <div className="avatar reveal">🧒🏻</div>
            <div className="reveal">
              <span className="eyebrow">Meet the maker</span>
              <h2>Hi, I&apos;m Audrey! 👋</h2>
              <p dangerouslySetInnerHTML={{ __html: content.about1 }} />
              <p dangerouslySetInnerHTML={{ __html: content.about2 }} />
            </div>
          </div>
        </section>

        {/* ORDER */}
        <section id="order" style={{ background: "var(--soft)" }}>
          <div className="wrap">
            <div className="head reveal">
              <span className="eyebrow">Let&apos;s make yours</span>
              <h2>Order a bracelet 💌</h2>
              <p>Send me the details and I&apos;ll get back to you super soon!</p>
            </div>
            <OrderForm />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <a className="brand" href="#top"><span className="dot" />{content.brand}</a>
          <p>Handmade beaded bracelets · Online &amp; at the stall in {content.stallSociety}</p>
          <p style={{ fontSize: ".85rem" }}>Made with 💜 by Audrey, age 11</p>
        </div>
      </footer>
    </>
  );
}

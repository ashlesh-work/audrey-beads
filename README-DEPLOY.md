# Audrey's Beads — Local Hosted App

A self-contained bracelet website. **No cloud, no external services.** Everything runs in **one
Docker container** with a single **SQLite** data file and local photo storage. Your existing
reverse proxy / tunnel maps a subdomain to it.

What's inside:
- **Public site** — server-rendered, claymorphic design, Light/Dark/System, gentle animation.
- **Central orders** — visitors' orders are saved locally; Audrey manages them in the dashboard
  (New → Making → Ready → Delivered).
- **Secure admin** — email + password login (set in `.env`); server-side sessions; the order email is never shown publicly.
- **Smart photo uploads** — each image is auto-improved: background cleanup, brightness/colour
  enhance, denoise + sharpen, smart 4:3 crop, WebP. Stored on the local data volume.

---

## Run it (Docker)

```bash
cp .env.example .env
# edit .env: set ADMIN_EMAIL and a strong ADMIN_PASSWORD
docker compose up -d --build
```

- App listens on **port 8493** (non-standard, to avoid clashing with your other containers).
- Your proxy/tunnel should route your subdomain → the `app` service at **`http://app:8493`**
  (same docker network). The compose file also publishes `8493` on the host for direct testing —
  remove that `ports:` block if your proxy handles everything.
- Open your subdomain → public site. Go to **`/admin`** and sign in with the email + password from `.env`.

**Data & backups:** the SQLite database and all uploaded photos live in the `beads_data` volume
(`/app/data` → `app.db` + `uploads/`). Back up by copying that volume; restore by putting it back.

> **Cookie note:** `COOKIE_SECURE=true` (default) requires HTTPS — which you get through your
> proxy/tunnel. If you test over plain `http://host:8493`, set `COOKIE_SECURE=false` in `.env`
> or the login cookie won't be saved.

---

## Photo improvement
On upload (`/api/upload`, admin-only) the image runs through `lib/imageProcessing.ts`:
1. **Clean background** (optional, default on) — local AI removal, composited onto an on-brand cream backdrop.
2. **Auto-enhance** — auto-levels, brightness +, saturation +, mild gamma.
3. **Sharpen + clean up** — light denoise + sharpen.
4. **Consistent framing** — smart-crop to 1200×900 (4:3).
5. **Web-optimize** — WebP (quality 82).
The dashboard shows a **before → after** preview, with a per-upload toggle.

> The background-removal model (`@imgly/background-removal-node`) downloads its weights **once** on
> first use. To stay 100% offline / keep the image lean, set `REMOVE_BG=off` (photos are still
> enhanced, sharpened, cropped, and WebP-optimized) — and you may remove that dependency from
> `package.json` if you never want it.

---

## Security summary
- Admin pages require a valid server-side **session cookie** (httpOnly); every admin action and the
  upload route re-check it. Credentials are checked **constant-time** against `.env` and never stored in the DB.
- The order form has a **honeypot + length limits**. The order email is private (env only) — never rendered to visitors.
- TLS is provided by your reverse proxy / tunnel.

---

## Local development (without Docker)
```bash
npm install
cp .env.example .env   # set ADMIN_EMAIL, ADMIN_PASSWORD, and COOKIE_SECURE=false for http
npm run dev            # http://localhost:3000
```
(`DATA_DIR` defaults to `./data` when not set, so a local `data/` folder is created automatically.)

---

## Project map
```
app/
  page.tsx              # public landing (server-rendered from SQLite)
  actions.ts            # placeOrder (public)
  admin/                # login, dashboard, server actions, auth-actions (session)
  api/upload/route.ts   # admin-only: process image + save to /app/data/uploads
  media/[file]/route.ts # serves uploaded photos from the data volume
lib/
  db.ts                 # SQLite connection + schema + seed
  store.ts              # all data access (content, products, orders, sessions)
  auth.ts               # session check / admin gate
  imageProcessing.ts    # sharp + background-removal pipeline
Dockerfile, docker-compose.yml, .env.example
```

> The simple single-file version still lives at `../index.html` if you ever want the no-server option.

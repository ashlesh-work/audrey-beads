import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DEFAULT_CONTENT, SAMPLE_PRODUCTS, SAMPLE_TESTIMONIALS } from "./defaults";

// Everything lives in one local SQLite file on a mounted volume (DATA_DIR).
// No external services. Easy to back up — just copy the data folder.
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");

function init(): Database.Database {
  fs.mkdirSync(path.join(DATA_DIR, "uploads"), { recursive: true });
  const db = new Database(path.join(DATA_DIR, "app.db"), { timeout: 10000 });
  db.pragma("journal_mode = WAL");

  db.exec(`
    create table if not exists site_content (id text primary key, data text not null);
    create table if not exists products (
      id text primary key, name text not null, tag text default '',
      description text default '', image_url text default '', sort integer default 0,
      created_at text not null
    );
    create table if not exists orders (
      id text primary key, name text not null, style text not null,
      message text default '', status text not null default 'New', created_at text not null
    );
    create table if not exists sessions (id text primary key, expires_at integer not null);
    create table if not exists testimonials (
      id text primary key, name text not null, text text default '',
      image_url text default '', sort integer default 0, created_at text not null
    );
  `);

  // seed content once
  const hasContent = db.prepare("select 1 from site_content where id = 'main'").get();
  if (!hasContent) {
    db.prepare("insert into site_content (id, data) values ('main', ?)").run(
      JSON.stringify(DEFAULT_CONTENT)
    );
  }
  // seed sample products once
  const count = db.prepare("select count(*) as n from products").get() as { n: number };
  if (count.n === 0) {
    const insert = db.prepare(
      "insert into products (id, name, tag, description, sort, created_at) values (?,?,?,?,?,?)"
    );
    SAMPLE_PRODUCTS.forEach((p, i) =>
      insert.run(crypto.randomUUID(), p.name, p.tag, p.description, i + 1, new Date().toISOString())
    );
  }
  // seed sample testimonials once
  const testimonialCount = db.prepare("select count(*) as n from testimonials").get() as { n: number };
  if (testimonialCount.n === 0) {
    const insertTestimonial = db.prepare(
      "insert into testimonials (id, name, text, image_url, sort, created_at) values (?,?,?,?,?,?)"
    );
    SAMPLE_TESTIMONIALS.forEach((t, i) =>
      insertTestimonial.run(crypto.randomUUID(), t.name, t.text, "", i + 1, new Date().toISOString())
    );
  }
  return db;
}

// Reuse a single connection across hot reloads / requests.
const g = globalThis as unknown as { __beadsDb?: Database.Database };
const db: Database.Database = g.__beadsDb ?? (g.__beadsDb = init());
export default db;

import fs from "node:fs";
import path from "node:path";

export const runtime = "nodejs";

// Serves processed bracelet photos from the local data volume.
const DIR = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "uploads");

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file } = await ctx.params;
  const safe = path.basename(file); // prevent path traversal
  const full = path.join(DIR, safe);
  if (!full.startsWith(DIR) || !fs.existsSync(full)) {
    return new Response("Not found", { status: 404 });
  }
  const data = await fs.promises.readFile(full);
  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

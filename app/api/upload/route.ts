import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { processImage } from "@/lib/imageProcessing";

export const runtime = "nodejs";
export const maxDuration = 120; // background removal + sharp can take a few seconds

const DIR = path.join(process.env.DATA_DIR || path.join(process.cwd(), "data"), "uploads");

export async function POST(req: Request) {
  if (!(await getAdminUser())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const cleanBg = form.get("cleanBg") !== "false";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No image provided" }, { status: 400 });
  }

  let processed: Buffer;
  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    processed = await processImage(bytes, { cleanBg });
  } catch {
    return NextResponse.json({ error: "Could not process that image" }, { status: 500 });
  }

  fs.mkdirSync(DIR, { recursive: true });
  const name = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;
  fs.writeFileSync(path.join(DIR, name), processed);

  return NextResponse.json({ url: `/media/${name}` });
}

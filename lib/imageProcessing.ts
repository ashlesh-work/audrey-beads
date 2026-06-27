import sharp from "sharp";

// On-brand backdrop (matches the site's cream --canvas) used behind background-removed photos.
const CREAM = { r: 255, g: 250, b: 240, alpha: 1 } as const;

// Final framing — consistent 4:3 so the gallery looks tidy.
const W = 1200;
const H = 900;

export type ProcessOptions = { cleanBg?: boolean };

/**
 * Improves an uploaded bracelet photo so it matches the website:
 *  1. (optional) remove the background and place it on a clean cream backdrop
 *  2. auto-enhance brightness / contrast / colour
 *  3. gentle denoise + sharpen
 *  4. smart-crop to a consistent 4:3 frame
 *  5. encode to web-optimized WebP
 */
export async function processImage(
  input: Buffer,
  opts: ProcessOptions = {}
): Promise<Buffer> {
  let working: Buffer = input;

  const wantBg = opts.cleanBg !== false && process.env.REMOVE_BG !== "off";
  if (wantBg) {
    try {
      working = await removeBackground(input);
    } catch (err) {
      // If the model isn't available or fails, fall back to the original photo
      // (the enhance steps below still run, so we never block an upload).
      console.warn("[imageProcessing] background removal skipped:", err);
      working = input;
    }
  }

  const pipeline = sharp(working)
    .rotate() // honour EXIF orientation
    .flatten({ background: CREAM }) // composite any transparency onto the cream backdrop
    .normalise() // stretch contrast (auto levels)
    .modulate({ brightness: 1.04, saturation: 1.12 }) // brighten + richer colour
    .gamma(1.05)
    .median(1) // light denoise
    .sharpen() // crisp edges
    .resize(W, H, { fit: "cover", position: sharp.strategy.attention }) // smart 4:3 crop
    .webp({ quality: 82 });

  return pipeline.toBuffer();
}

// Generates a tiny blurred placeholder (data URL) for nice progressive loading.
export async function blurPlaceholder(processed: Buffer): Promise<string> {
  const buf = await sharp(processed).resize(16, 12, { fit: "cover" }).webp({ quality: 40 }).toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

async function removeBackground(input: Buffer): Promise<Buffer> {
  // Local ONNX model — no API key. Returns a PNG Blob with transparency.
  const mod: any = await import("@imgly/background-removal-node");
  const remove = mod.removeBackground ?? mod.default?.removeBackground ?? mod.default;
  if (typeof remove !== "function") throw new Error("background-removal module not available");
  const blob = await remove(input);
  const arrayBuf = await blob.arrayBuffer();
  return Buffer.from(arrayBuf);
}

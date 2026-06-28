import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const cwd = process.cwd();
const sourceRoot = path.join(cwd, "public/images");
const outputRoot = path.join(sourceRoot, "upscaled-2x");
const scale = Number(process.env.UPSCALE_FACTOR ?? "2");
const overwrite = process.argv.includes("--overwrite");
const rasterExtensions = new Set([".png", ".jpg", ".jpeg", ".webp"]);

if (!Number.isFinite(scale) || scale <= 1) {
  throw new Error("UPSCALE_FACTOR must be a number greater than 1.");
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (fullPath.startsWith(outputRoot)) continue;
      files.push(...await walk(fullPath));
      continue;
    }

    if (entry.isFile() && rasterExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function outputPathFor(filePath) {
  return path.join(outputRoot, path.relative(sourceRoot, filePath));
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function upscaleImage(filePath) {
  const relativePath = path.relative(sourceRoot, filePath);
  const outPath = outputPathFor(filePath);

  if (!overwrite && await exists(outPath)) {
    return { relativePath, status: "skipped" };
  }

  const image = sharp(filePath, { failOn: "none", limitInputPixels: false });
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    return { relativePath, status: "ignored" };
  }

  const width = Math.round(metadata.width * scale);
  const height = Math.round(metadata.height * scale);
  const extension = path.extname(filePath).toLowerCase();

  await fs.mkdir(path.dirname(outPath), { recursive: true });

  let pipeline = image.resize({
    width,
    height,
    fit: "fill",
    kernel: sharp.kernel.lanczos3,
    fastShrinkOnLoad: false,
  });

  if (extension === ".png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      adaptiveFiltering: true,
      palette: false,
    });
  } else if (extension === ".webp") {
    pipeline = pipeline.webp({
      lossless: true,
      effort: 6,
      smartSubsample: false,
    });
  } else {
    pipeline = pipeline.jpeg({
      quality: 100,
      mozjpeg: true,
      chromaSubsampling: "4:4:4",
    });
  }

  await pipeline.toFile(outPath);

  return {
    relativePath,
    status: "upscaled",
    from: `${metadata.width}x${metadata.height}`,
    to: `${width}x${height}`,
  };
}

const files = (await walk(sourceRoot)).sort((a, b) => a.localeCompare(b));
let upscaled = 0;
let skipped = 0;

console.log(`Upscaling ${files.length} raster image(s) from public/images -> public/images/upscaled-2x at ${scale}x`);

for (const filePath of files) {
  const result = await upscaleImage(filePath);

  if (result.status === "upscaled") {
    upscaled += 1;
    console.log(`upscaled  ${result.relativePath}  ${result.from} -> ${result.to}`);
  } else if (result.status === "skipped") {
    skipped += 1;
    console.log(`skipped   ${result.relativePath}`);
  } else {
    console.log(`ignored   ${result.relativePath}`);
  }
}

console.log(`Done. ${upscaled} upscaled, ${skipped} skipped.`);

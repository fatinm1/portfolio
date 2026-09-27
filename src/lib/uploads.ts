import { readFile } from "fs/promises";
import path from "path";

/**
 * Single source of truth for where project photos are stored (must match upload + serve).
 */
export function getUploadsRoot(): string {
  if (process.env.UPLOADS_ROOT) {
    return path.resolve(process.env.UPLOADS_ROOT);
  }
  if (process.env.RAILWAY_VOLUME_MOUNT_PATH) {
    return path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, "uploads");
  }
  return path.join(process.cwd(), "public", "uploads");
}

/**
 * Resolve a safe path under uploads; returns null if traversal is attempted.
 */
export function resolveUploadFile(relativePath: string): string | null {
  const root = path.normalize(getUploadsRoot());
  const joined = path.normalize(path.join(root, relativePath));
  const rel = path.relative(root, joined);
  if (rel.startsWith("..") || path.isAbsolute(rel)) {
    return null;
  }
  return joined;
}

export async function readUploadFileBuffer(relativePath: string): Promise<Buffer | null> {
  const fullPath = resolveUploadFile(relativePath);
  if (!fullPath) return null;
  try {
    return await readFile(fullPath);
  } catch {
    return null;
  }
}

/** Content type for servable uploads; null means the file type is not served. */
export function contentTypeForExtension(ext: string): string | null {
  const e = ext.toLowerCase();
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  if (e === ".pdf") return "application/pdf";
  return null;
}

/**
 * Detect an allowed image type from the file's magic bytes. The browser-supplied
 * MIME type and filename are client-controlled, so they are never trusted.
 */
export function detectImageExtension(buf: Buffer): ".jpg" | ".png" | ".gif" | ".webp" | null {
  if (buf.length >= 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return ".jpg";
  if (buf.length >= 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return ".png";
  if (buf.length >= 6 && (buf.subarray(0, 6).toString("ascii") === "GIF87a" || buf.subarray(0, 6).toString("ascii") === "GIF89a"))
    return ".gif";
  if (buf.length >= 12 && buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return ".webp";
  return null;
}

export function isPdf(buf: Buffer): boolean {
  return buf.length >= 5 && buf.subarray(0, 5).toString("ascii") === "%PDF-";
}

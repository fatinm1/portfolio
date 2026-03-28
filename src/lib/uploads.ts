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

export function contentTypeForExtension(ext: string): string {
  const e = ext.toLowerCase();
  if (e === ".jpg" || e === ".jpeg") return "image/jpeg";
  if (e === ".png") return "image/png";
  if (e === ".webp") return "image/webp";
  if (e === ".gif") return "image/gif";
  if (e === ".pdf") return "application/pdf";
  if (e === ".mp4") return "video/mp4";
  if (e === ".webm") return "video/webm";
  return "application/octet-stream";
}

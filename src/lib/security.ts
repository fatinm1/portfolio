import { NextRequest, NextResponse } from "next/server";

/**
 * Simple in-memory fixed-window rate limiter. Per-instance only, which is enough
 * to blunt brute force and spam on a single-instance deployment.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: NextRequest): string {
  // Prefer the proxy-set header; the first X-Forwarded-For entry is client-controlled,
  // so fall back to the last one (appended by the nearest proxy).
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",").pop()!.trim();
  return "unknown";
}

/** Returns a 429 response when the limit is exceeded, otherwise null. */
export function rateLimit(
  req: NextRequest,
  name: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const now = Date.now();
  const key = `${name}:${getClientIp(req)}`;

  if (buckets.size > 10_000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return null;
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    const retryAfter = Math.ceil((bucket.resetAt - now) / 1000);
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }
  return null;
}

/** True for absolute http(s) URLs; blocks javascript:, data:, etc. in stored links. */
export function isHttpUrl(value: unknown): boolean {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function isStringArray(value: unknown, maxItems: number, maxLen: number): value is string[] {
  return (
    Array.isArray(value) &&
    value.length <= maxItems &&
    value.every((v) => typeof v === "string" && v.length <= maxLen)
  );
}

/** Validates a project payload. Returns an error message, or null when valid. */
export function validateProjectInput(body: unknown): string | null {
  if (!body || typeof body !== "object") return "Invalid request body";
  const p = body as Record<string, unknown>;

  if (typeof p.name !== "string" || !p.name.trim() || p.name.length > 255) return "Invalid project name";
  if (typeof p.description !== "string" || !p.description.trim() || p.description.length > 10000)
    return "Invalid description";
  if (!isStringArray(p.technologies, 50, 100) || p.technologies.length === 0) return "Invalid technologies";
  if (!isHttpUrl(p.github) || (p.github as string).length > 500) return "GitHub link must be an http(s) URL";

  if (p.tags !== undefined && p.tags !== null && !isStringArray(p.tags, 50, 100)) return "Invalid tags";

  if (p.live_url !== undefined && p.live_url !== null && p.live_url !== "") {
    if (!isHttpUrl(p.live_url) || (p.live_url as string).length > 500) return "Live demo URL must be an http(s) URL";
  }

  if (p.status !== undefined && p.status !== null && (typeof p.status !== "string" || p.status.length > 50))
    return "Status must be 50 characters or fewer";
  if (p.featured !== undefined && typeof p.featured !== "boolean") return "Invalid featured flag";

  if (p.photo !== undefined && p.photo !== null && p.photo !== "") {
    const photo = p.photo;
    const isLocalUpload =
      typeof photo === "string" && /^\/(api\/)?uploads\/[A-Za-z0-9._-]+$/.test(photo);
    if (!(isLocalUpload || isHttpUrl(photo)) || (photo as string).length > 500)
      return "Photo must be an uploaded file or an http(s) image URL";
  }

  return null;
}

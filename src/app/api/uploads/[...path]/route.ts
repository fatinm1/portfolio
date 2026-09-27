import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readUploadFileBuffer, contentTypeForExtension } from "@/lib/uploads";

export const runtime = "nodejs";

/** Same files as GET /uploads/* — kept for DB URLs stored as /api/uploads/... */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: segments } = await params;
    if (!segments?.length) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const relative = segments.join("/");
    const contentType = contentTypeForExtension(path.extname(relative));
    if (!contentType) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = await readUploadFileBuffer(relative);
    if (!buffer) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "X-Content-Type-Options": "nosniff",
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("API uploads GET error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readUploadFileBuffer, contentTypeForExtension } from "@/lib/uploads";

export const runtime = "nodejs";

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
    const buffer = await readUploadFileBuffer(relative);
    if (!buffer) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const ext = path.extname(relative);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentTypeForExtension(ext),
        "Content-Disposition": "inline",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Uploads GET error:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}

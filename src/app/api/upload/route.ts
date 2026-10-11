import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { randomBytes } from 'crypto';
import path from 'path';
import { getUploadsRoot, detectImageExtension } from '@/lib/uploads';
import { requireAdmin } from '@/lib/auth';

export const runtime = 'nodejs';

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const formData = await req.formData();
    const file = formData.get('photo');

    // Blob, not File: the global File class only exists from Node 20, and uploads are File (a Blob subclass).
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size too large (max 10MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = detectImageExtension(buffer);
    if (!extension) {
      return NextResponse.json({ error: 'Only JPEG, PNG, GIF or WebP images are allowed' }, { status: 400 });
    }

    const uploadsDir = getUploadsRoot();
    await mkdir(uploadsDir, { recursive: true });

    const filename = `photo-${Date.now()}-${randomBytes(8).toString('hex')}${extension}`;
    await writeFile(path.join(uploadsDir, filename), buffer);

    return NextResponse.json({
      success: true,
      filename: filename,
      url: `/uploads/${filename}`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

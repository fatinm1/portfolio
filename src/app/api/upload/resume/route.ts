import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { initDatabase, saveResume } from '@/lib/database';
import { getUploadsRoot, isPdf } from '@/lib/uploads';
import { requireAdmin } from '@/lib/auth';

let dbInitialized = false;

const ensureDatabase = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

export async function POST(req: NextRequest) {
  const unauthorized = await requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const formData = await req.formData();
    const file = formData.get('resume');
    
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    const uploadsDir = getUploadsRoot();
    
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `resume_${timestamp}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    // Validate the actual file contents, not the client-supplied MIME type
    const buffer = Buffer.from(await file.arrayBuffer());
    if (!isPdf(buffer)) {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }
    await ensureDatabase();
    await writeFile(filepath, buffer);

    // Return the public URL
    const publicUrl = `/uploads/${filename}`;

    // Save resume info to database
    try {
      await saveResume({ filename, url: publicUrl });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database save fails
    }

    return NextResponse.json({ 
      success: true,
      url: publicUrl,
      filename: filename,
      message: 'Resume uploaded successfully'
    });

  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json({ 
      error: 'Failed to upload resume' 
    }, { status: 500 });
  }
} 
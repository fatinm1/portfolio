import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { saveResume } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `resume_${timestamp}.pdf`;
    const filepath = path.join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
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
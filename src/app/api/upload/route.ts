import { NextRequest, NextResponse } from 'next/server';
import { upload } from '@/lib/upload';

export async function POST(req: NextRequest) {
  try {
    // Handle file upload using multer
    const formData = await req.formData();
    const file = formData.get('video') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('video/')) {
      return NextResponse.json({ error: 'Only video files are allowed' }, { status: 400 });
    }

    // Validate file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size too large (max 100MB)' }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.round(Math.random() * 1E9);
    const extension = file.name.split('.').pop();
    const filename = `video-${timestamp}-${randomSuffix}.${extension}`;
    
    // Save file to uploads directory
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fs = require('fs').promises;
    const path = require('path');
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', filename);
    
    await fs.writeFile(uploadPath, buffer);
    
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
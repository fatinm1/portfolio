import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const filePath = params.path.join('/');
    
    // Use Railway volume storage or fallback to local
    const uploadsDir = process.env.RAILWAY_VOLUME_MOUNT_PATH 
      ? path.join(process.env.RAILWAY_VOLUME_MOUNT_PATH, 'uploads')
      : path.join(process.cwd(), 'public', 'uploads');
    
    const fullPath = path.join(uploadsDir, filePath);
    
    // Security check - ensure the path is within uploads directory
    const normalizedPath = path.normalize(fullPath);
    const normalizedUploadsDir = path.normalize(uploadsDir);
    
    if (!normalizedPath.startsWith(normalizedUploadsDir)) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    
    const fileBuffer = await readFile(fullPath);
    
    // Determine content type based on file extension
    const ext = path.extname(filePath).toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (ext === '.pdf') {
      contentType = 'application/pdf';
    } else if (ext === '.mp4') {
      contentType = 'video/mp4';
    } else if (ext === '.avi') {
      contentType = 'video/x-msvideo';
    } else if (ext === '.mov') {
      contentType = 'video/quicktime';
    } else if (ext === '.webm') {
      contentType = 'video/webm';
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': 'inline',
      },
    });
  } catch (error) {
    console.error('File serving error:', error);
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
} 
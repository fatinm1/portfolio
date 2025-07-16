import multer from 'multer';
import path from 'path';
import { NextRequest } from 'next/server';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'public', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Allow video files only
  if (file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only video files are allowed'));
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  }
});

// Helper function to handle file upload in API routes
export const handleFileUpload = (req: NextRequest): Promise<{ file?: Express.Multer.File; error?: string }> => {
  return new Promise((resolve) => {
    upload.single('video')(req as any, {} as any, (err: any, file?: Express.Multer.File) => {
      if (err) {
        resolve({ error: err.message });
      } else if (file) {
        resolve({ file });
      } else {
        resolve({});
      }
    });
  });
}; 
import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getCurrentResume } from '@/lib/database';

let dbInitialized = false;

const ensureDatabase = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

export async function GET(req: NextRequest) {
  try {
    await ensureDatabase();
    
    const resume = await getCurrentResume();
    
    return NextResponse.json({ 
      resume,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch resume',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentResume } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
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
import { NextRequest, NextResponse } from 'next/server';
import { getContacts } from '@/lib/database';

export async function GET(req: NextRequest) {
  try {
    const contacts = await getContacts();
    
    return NextResponse.json({ 
      contacts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch contacts',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
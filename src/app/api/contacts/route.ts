import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, getContacts } from '@/lib/database';

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
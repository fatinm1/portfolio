import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, verifyAdmin } from '@/lib/database';
import { cookies } from 'next/headers';

let dbInitialized = false;

const ensureDatabase = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

export async function POST(req: NextRequest) {
  try {
    await ensureDatabase();
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    const isValid = await verifyAdmin(username, password);
    
    if (isValid) {
      // Set session cookie
      const response = NextResponse.json({ success: true });
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  // Logout - clear session cookie
  const response = NextResponse.json({ success: true });
  response.cookies.delete('admin_session');
  
  return response;
} 
import { NextRequest, NextResponse } from 'next/server;
import { verifyAdmin } from '@/lib/database';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required },{ status: 400;
    }

    const isValid = await verifyAdmin(username, password);
    
    if (isValid) {
      const response = NextResponse.json({ success: true });
      response.cookies.set(admin_session', 'authenticated', [object Object]
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite:strict,
        maxAge: 600 * 24 // 24rs
      });
      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials },{ status:401);
    }
  } catch {
    return NextResponse.json({ error: 'Authentication failed },[object Object] status: 500 });
  }
}

export async function DELETE() [object Object]  const response = NextResponse.json({ success: true });
  response.cookies.delete(admin_session');
  return response;
} 
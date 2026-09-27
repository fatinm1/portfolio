import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, verifyAdmin } from '@/lib/database';
import { createSessionToken, isAdminRequest, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/auth';
import { rateLimit } from '@/lib/security';

let dbInitialized = false;

const ensureDatabase = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

export async function GET(req: NextRequest) {
  return NextResponse.json({ authenticated: await isAdminRequest(req) });
}

export async function POST(req: NextRequest) {
  // 5 login attempts per IP per 15 minutes
  const limited = rateLimit(req, 'login', 5, 15 * 60 * 1000);
  if (limited) return limited;

  try {
    await ensureDatabase();
    const { username, password } = await req.json();
    if (typeof username !== 'string' || typeof password !== 'string' || !username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    if (username.length > 100 || password.length > 200) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await verifyAdmin(username, password);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await createSessionToken(username);
    if (!token) {
      return NextResponse.json({ error: 'Login is not configured on the server' }, { status: 500 });
    }

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 });
  return response;
}

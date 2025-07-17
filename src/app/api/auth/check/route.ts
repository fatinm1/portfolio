import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export function GET() {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('admin_session');
    if (!sessionToken) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }
    return NextResponse.json({ authenticated: true });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
} 
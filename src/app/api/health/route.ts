import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Public health check: reports status only, never configuration or error details.
export async function GET() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      connectTimeout: 5000,
    });
    await connection.ping();
    await connection.end();
    return NextResponse.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check database error:', error);
    return NextResponse.json({ status: 'error', database: 'unavailable' }, { status: 503 });
  }
}

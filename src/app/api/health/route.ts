import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET() {
  const health = {
    timestamp: new Date().toISOString(),
    environment: {
      NODE_ENV: process.env.NODE_ENV,
      DB_HOST: process.env.DB_HOST || 'NOT SET',
      DB_USER: process.env.DB_USER || 'NOT SET',
      DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
      DB_NAME: process.env.DB_NAME || 'NOT SET',
      DB_PORT: process.env.DB_PORT || 'NOT SET',
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET'
    },
    database: {
      status: 'unknown',
      error: null as string | null
    }
  };

  // Test database connection
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306', 10)
    });
    
    await connection.ping();
    await connection.end();
    
    health.database.status = 'connected';
  } catch (error) {
    health.database.status = 'failed';
    health.database.error = error instanceof Error ? error.message : 'Unknown error';
  }

  return NextResponse.json(health);
} 
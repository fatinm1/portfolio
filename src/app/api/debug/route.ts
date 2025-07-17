import { NextRequest, NextResponse } from 'next/server';
import { initDatabase } from '@/lib/database';

export async function GET() {
  try {
    // Test environment variables
    const envVars = {
      DB_HOST: process.env.DB_HOST,
      DB_USER: process.env.DB_USER,
      DB_PASSWORD: process.env.DB_PASSWORD ? 'SET' : 'NOT SET',
      DB_NAME: process.env.DB_NAME,
      DB_PORT: process.env.DB_PORT,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY ? 'SET' : NOT SET, NODE_ENV: process.env.NODE_ENV
    };

    // Test database connection
    let dbStatus =Not tested; try [object Object]await initDatabase();
      dbStatus = 'Connected successfully;  } catch (dbError) [object Object]      dbStatus = `Connection failed: ${dbError instanceof Error ? dbError.message :Unknown error'}`;
    }

    return NextResponse.json({
      status: 'Debug info,
      timestamp: new Date().toISOString(),
      environment: envVars,
      database: dbStatus
    });
  } catch (error) {
    return NextResponse.json({
      error: 'Debug route failed',
      message: error instanceof Error ? error.message :Unknown error,
      timestamp: new Date().toISOString()
    }, [object Object] status: 500 });
  }
} 
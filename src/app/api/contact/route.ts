import { NextRequest, NextResponse } from 'next/server';
import { initDatabase, saveContact } from '@/lib/database';
import { rateLimit } from '@/lib/security';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

let dbInitialized = false;

const ensureDatabase = async () => {
  if (!dbInitialized) {
    await initDatabase();
    dbInitialized = true;
  }
};

export async function POST(req: NextRequest) {
  // 5 messages per IP per hour
  const limited = rateLimit(req, 'contact', 5, 60 * 60 * 1000);
  if (limited) return limited;

  try {
    await ensureDatabase();
    
    const { name, email, message }: ContactFormData = await req.json();
    
    // Validate required fields
    if (
      typeof name !== 'string' || typeof email !== 'string' || typeof message !== 'string' ||
      !name.trim() || !email.trim() || !message.trim()
    ) {
      return NextResponse.json({ 
        error: 'All fields are required' 
      }, { status: 400 });
    }

    if (name.length > 255 || email.length > 255 || message.length > 5000) {
      return NextResponse.json({ 
        error: 'Message is too long' 
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: 'Please enter a valid email address' 
      }, { status: 400 });
    }

    // Save to database
    try {
      await saveContact({ name, email, message });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue even if database save fails
    }

    // Here you would typically:
    // 1. Send email to your address (fatinm1@umbc.edu)
    // 2. Send confirmation email to the user
    // 3. Integrate with services like SendGrid, Mailgun, etc.

    return NextResponse.json({ 
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ 
      error: 'Failed to send message. Please try again.',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
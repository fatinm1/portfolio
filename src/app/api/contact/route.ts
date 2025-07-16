import { NextRequest, NextResponse } from 'next/server';
import { saveContact } from '@/lib/database';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, message }: ContactFormData = await req.json();
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({ 
        error: 'All fields are required' 
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

    // Log the contact form data
    console.log('Contact Form Submission:', {
      name,
      email,
      message,
      timestamp: new Date().toISOString()
    });

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
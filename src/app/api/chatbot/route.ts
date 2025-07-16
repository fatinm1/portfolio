import { NextRequest, NextResponse } from 'next/server';
import { ChatbotService } from '@/lib/openai';

export async function POST(req: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await req.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const response = await ChatbotService.generateResponse(message, conversationHistory);
    
    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString(),
      usingFallback: !process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here'
    });
  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({ 
      error: 'Failed to process message',
      response: "I'm having trouble responding right now. Please try again later.",
      timestamp: new Date().toISOString(),
      usingFallback: true
    }, { status: 500 });
  }
} 
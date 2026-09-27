import { NextRequest, NextResponse } from 'next/server';
import { ChatbotService } from '@/lib/chatbot';
import { rateLimit } from '@/lib/security';

const MAX_MESSAGE_LENGTH = 1000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_HISTORY_ENTRY_LENGTH = 2000;

type HistoryMessage = { role: 'user' | 'assistant'; content: string };

// Only accept user/assistant turns from the client so callers cannot inject system prompts.
function sanitizeHistory(history: unknown): HistoryMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m): m is HistoryMessage =>
        !!m &&
        typeof m === 'object' &&
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string'
    )
    .slice(-MAX_HISTORY_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_ENTRY_LENGTH) }));
}

export async function POST(req: NextRequest) {
  // 20 messages per IP per 10 minutes, to protect the OpenAI key from abuse
  const limited = rateLimit(req, 'chatbot', 20, 10 * 60 * 1000);
  if (limited) return limited;

  try {
    const { message, conversationHistory } = await req.json();
    
    if (typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Message must be under ${MAX_MESSAGE_LENGTH} characters` }, { status: 400 });
    }

    const { response, usingFallback } = await ChatbotService.generateResponse(
      message,
      sanitizeHistory(conversationHistory)
    );
    
    return NextResponse.json({ 
      response,
      timestamp: new Date().toISOString(),
      usingFallback
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

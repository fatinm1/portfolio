"use client";
import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  usingFallback?: boolean;
}

interface ConversationHistory {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  "What are Fatin's skills?",
  "Tell me about Fatin's projects",
  "What is Fatin's experience?",
  "How can I contact Fatin?",
  "What are Fatin's goals?"
];

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages on client side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: "1",
        text: "Hi! I'm Fatin's AI assistant. Ask me anything about Fatin or his projects. You can also try one of the suggested questions below!",
        isUser: false,
        timestamp: new Date()
      }
    ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    // Update conversation history for context
    const updatedHistory = [
      ...conversationHistory,
      { role: 'user' as const, content: messageText.trim() }
    ];

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: messageText.trim(),
          conversationHistory: updatedHistory.slice(-10) // Keep last 10 messages for context
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(),
          usingFallback: data.usingFallback
        };
        setMessages(prev => [...prev, botMessage]);
        
        // Update conversation history
        setConversationHistory([
          ...updatedHistory,
          { role: 'assistant', content: data.response }
        ]);
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I'm having trouble responding right now. Please try again later.",
          isUser: false,
          timestamp: new Date(),
          usingFallback: true
        };
        setMessages(prev => [...prev, errorMessage]);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting. Please check your internet connection.",
        isUser: false,
        timestamp: new Date(),
        usingFallback: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const clearChat = () => {
    setMessages([
      {
        id: "1",
        text: "Hi! I'm Fatin's AI assistant. Ask me anything about Fatin or his projects. You can also try one of the suggested questions below!",
        isUser: false,
        timestamp: new Date()
      }
    ]);
    setConversationHistory([]);
  };

  // Don't render until client-side to prevent hydration issues
  if (!isClient) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">AI Chatbot</h1>
        <div className="glass p-6 min-h-[600px] flex items-center justify-center">
          <div className="text-center">
            <div className="flex space-x-1 mb-4">
              <div className="w-2 h-2 bg-[#C8FF00] rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-[#C8FF00] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-[#C8FF00] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-white/70">Loading chatbot...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">AI Chatbot</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <div className="glass p-6 min-h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/20">
              <h2 className="text-xl font-semibold">Chat with Fatin's AI</h2>
              <button
                onClick={clearChat}
                className="px-3 py-1 rounded-lg bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors"
              >
                Clear Chat
              </button>
            </div>

            {/* Chat messages */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto max-h-[400px] mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      message.isUser
                        ? 'bg-[#C8FF00] text-black text-white'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      {message.usingFallback && (
                        <p className="text-xs opacity-50">(Fallback Mode)</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 text-white px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-lg px-4 py-2 bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#C8FF00]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-2 rounded-lg bg-[#C8FF00] text-black font-bold shadow hover:bg-[#C8FF00]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Suggestions Sidebar */}
        <div className="lg:col-span-1">
          <div className="glass p-6">
            <h3 className="text-lg font-semibold mb-4">Suggested Questions</h3>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  disabled={loading}
                  className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-[#C8FF00]/10 rounded-lg">
              <h4 className="font-semibold text-[#C8FF00] mb-2">💡 Tips</h4>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• Ask about specific projects</li>
                <li>• Inquire about skills and experience</li>
                <li>• Learn about Fatin's goals</li>
                <li>• Get contact information</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
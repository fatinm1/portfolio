"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What are Fatin's skills?",
  "Tell me about Fatin's projects",
  "How can I contact Fatin?",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: "1",
        text: "Hi! I'm Fatin's AI assistant. Ask me anything!",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText.trim(),
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const updatedHistory = [...conversationHistory, { role: "user" as const, content: messageText.trim() }];

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText.trim(),
          conversationHistory: updatedHistory.slice(-10),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          { id: (Date.now() + 1).toString(), text: data.response, isUser: false, timestamp: new Date() },
        ]);
        setConversationHistory([...updatedHistory, { role: "assistant", content: data.response }]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            text: "Sorry, I'm having trouble. Please try again.",
            isUser: false,
            timestamp: new Date(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Connection error. Please try again.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  if (!isClient) return null;

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#C8FF00] text-black shadow-lg hover:bg-[#C8FF00]/90 transition-all hover:scale-105 flex items-center justify-center"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-7 h-7" />
      </button>

      {/* Chat popup */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] flex flex-col bg-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <span className="font-medium text-white">Chat with Fatin&apos;s AI</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    msg.isUser ? "bg-[#C8FF00] text-black" : "bg-white/10 text-white"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 px-3 py-2 rounded-lg flex gap-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested questions */}
          <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
            {SUGGESTED_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                disabled={loading}
                className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 text-white/80 text-xs hover:bg-white/10 transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 rounded-lg px-4 py-2.5 bg-white/10 border border-white/20 text-white text-sm placeholder-white/40 focus:outline-none focus:border-[#C8FF00]"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="btn-green text-sm px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

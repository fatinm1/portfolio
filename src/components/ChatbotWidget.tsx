"use client";

import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  "What has Fatin built?",
  "Tell me about the LLM Engine",
  "What are Fatin's skills?",
  "How can I contact Fatin?",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isClient, setIsClient] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setIsClient(true);
    setMessages([
      {
        id: "1",
        text: "Hi! I'm Fatin's AI assistant. Ask me about his projects, experience or how to reach him.",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "end" });
  }, [messages, loading, isOpen, reduceMotion]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

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

  const hasAskedSomething = messages.some((m) => m.isUser);
  const duration = reduceMotion ? 0 : 0.25;

  return (
    <>
      {/* Floating button */}
      <button
        ref={toggleRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="chatbot-panel"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="chatbot-fab fixed bottom-5 right-5 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-[#0a0a0a] transition-transform duration-300 ease-silk hover:scale-105"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            role="dialog"
            aria-label="Chat with Fatin's AI assistant"
            className="fixed bottom-[84px] right-4 z-50 flex h-[min(520px,calc(100dvh-120px))] w-[380px] max-w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden rounded-2xl border border-[#26262b] bg-[#0a0a0d]/95 shadow-[0_24px_80px_rgba(0,0,0,.6)] backdrop-blur-md sm:right-5"
            initial={{ opacity: 0, scale: 0.98, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 8 }}
            transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => inputRef.current?.focus()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]" aria-hidden="true" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground">Ask about Fatin</span>
                  <span className="font-mono text-[11px] text-faint">AI assistant</span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  toggleRef.current?.focus();
                }}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-white/[.06] hover:text-foreground"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] whitespace-pre-line px-3.5 py-2.5 text-sm leading-[1.55] ${
                      msg.isUser
                        ? "rounded-2xl rounded-br-md bg-accent text-[#0a0a0a]"
                        : "rounded-2xl rounded-bl-md border border-border bg-white/[.04] text-foreground/90"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start" aria-label="Assistant is typing">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-border bg-white/[.04] px-3.5 py-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-muted motion-safe:animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted motion-safe:animate-bounce [animation-delay:.1s]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-muted motion-safe:animate-bounce [animation-delay:.2s]" />
                  </div>
                </div>
              )}
              {!hasAskedSomething && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      disabled={loading}
                      className="rounded-full border border-[#26262b] bg-white/[.02] px-3 py-1.5 text-xs text-muted transition-colors hover:border-[#3a3a42] hover:text-foreground disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-border p-3">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  aria-label="Your question"
                  maxLength={1000}
                  className="flex-1 rounded-xl border border-border bg-white/[.03] px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint focus:border-accent focus:outline-none"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-xl bg-accent px-4 text-sm font-medium text-[#0a0a0a] transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

'use client';

// AI Coach chat page - available for PRO/ELITE subscribers
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { LockedFeature } from '@/components/paywall/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { COACH } from '@/constants/copy';
import { AI_LIMITS } from '@/lib/openai';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function CoachPage() {
  const { profile } = useAuth();
  const { canAccess, isProOrAbove } = useSubscription();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasAccess = canAccess('ai_coach');
  const dailyLimit = isProOrAbove ? AI_LIMITS.PRO_DAILY : AI_LIMITS.ELITE_DAILY;

  // Initialize with welcome message
  useEffect(() => {
    if (hasAccess) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: COACH.welcomeMessage,
          timestamp: new Date(),
        },
      ]);
      // Load remaining messages for today
      loadRemainingMessages();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadRemainingMessages = async () => {
    try {
      const response = await fetch('/api/coach?remaining=true');
      if (response.ok) {
        const data = await response.json();
        setRemainingMessages(data.remaining ?? dailyLimit);
      } else {
        setRemainingMessages(dailyLimit);
      }
    } catch {
      setRemainingMessages(dailyLimit);
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;
    if (remainingMessages !== null && remainingMessages <= 0) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setSending(true);

    // Add typing indicator
    const typingId = 'typing';
    setMessages((prev) => [
      ...prev,
      { id: typingId, role: 'assistant', content: '...', timestamp: new Date() },
    ]);

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages
            .filter((m) => m.id !== 'welcome')
            .slice(-10)
            .map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await response.json();

      // Replace typing indicator with real response
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.ok ? data.reply : data.error || 'Nastala chyba. Zkus to znovu.',
          timestamp: new Date(),
        },
      ]);

      if (data.remainingToday !== undefined) {
        setRemainingMessages(data.remainingToday);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Omlouváme se, nastala chyba připojení. Zkus to prosím znovu.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Locked state for non-PRO users
  if (!hasAccess) {
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h1 className="text-2xl font-black text-text-primary">{COACH.title}</h1>
          <p className="text-text-secondary text-sm mt-1">{COACH.subtitle}</p>
        </div>

        <LockedFeature
          feature="ai_coach"
          title={COACH.lockedTitle}
          description={COACH.lockedDescription}
          ctaText={COACH.lockedCta}
          blurContent={false}
        >
          <div className="bg-surface2 border border-border rounded-2xl p-6 text-center py-16">
            <div className="text-4xl mb-4">🤖</div>
            <p className="text-text-secondary">Kouč je odemknut v PRO</p>
          </div>
        </LockedFeature>

        {/* Feature preview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: '⚡', text: 'Okamžité odpovědi 24/7' },
            { icon: '🎯', text: 'Rady šité na míru' },
            { icon: '💡', text: '10+ otázek denně' },
          ].map((item) => (
            <div key={item.text} className="bg-surface border border-border rounded-2xl p-4 text-center">
              <span className="text-2xl">{item.icon}</span>
              <p className="text-sm text-text-secondary mt-2">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      {/* Header with daily usage badge */}
      <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
        <div>
          <h1 className="text-xl font-black text-text-primary">{COACH.title}</h1>
          <p className="text-xs text-text-secondary mt-0.5">{COACH.subtitle}</p>
        </div>
        {remainingMessages !== null && (
          <div className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${
            remainingMessages <= 2
              ? 'bg-red-950/30 border-red-800/50 text-red-400'
              : 'bg-cta/10 border-cta/30 text-cta'
          }`}>
            {remainingMessages} zpráv zbývá
          </div>
        )}
      </div>

      {/* Medical disclaimer */}
      <div className="flex items-start gap-2 p-3 bg-surface2 border border-border/50 rounded-xl mb-4">
        <svg className="w-3.5 h-3.5 text-text-secondary/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-text-secondary/60 leading-relaxed">{COACH.disclaimer}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 -mr-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-cta/20 border border-cta/40 flex items-center justify-center text-sm mr-2 shrink-0 mt-1">
                🤖
              </div>
            )}
            <div
              className={[
                'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                message.role === 'user'
                  ? 'bg-[#8B1E2D] border border-[#B3263E]/40 text-[#F5F5F5] rounded-tr-sm'
                  : 'bg-surface2 border border-border text-text-primary rounded-tl-sm',
                message.content === '...' ? 'animate-pulse' : '',
              ].join(' ')}
            >
              {message.content === '...' ? (
                <span className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Daily limit reached */}
      {remainingMessages !== null && remainingMessages <= 0 && (
        <div className="py-3 px-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 text-center my-3">
          {COACH.limitReached}
        </div>
      )}

      {/* Input area */}
      <div className="pt-4 border-t border-border">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={COACH.placeholder}
            rows={1}
            disabled={sending || (remainingMessages !== null && remainingMessages <= 0)}
            className="flex-1 px-4 py-3 bg-surface2 text-text-primary border border-border rounded-xl placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60 transition-all resize-none text-base max-h-32 disabled:opacity-50"
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending || (remainingMessages !== null && remainingMessages <= 0)}
            className="shrink-0 w-11 h-11 bg-[#B3263E] hover:bg-[#D13A52] disabled:opacity-40 disabled:cursor-not-allowed rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-[0_0_15px_rgba(179,38,62,0.4)]"
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

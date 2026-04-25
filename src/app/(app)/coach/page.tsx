'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
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

// ── Suggested questions by goal track ──────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  'Jak mám postupovat, když trénuji sám doma?',
  'Co jíst před a po tréninku?',
  'Jak zvýšit motivaci, když se mi nechce?',
  'Kolik bílkovin denně potřebuji?',
  'Jak postupovat při plató v hubnutí?',
  'Vysvětli mi techniku dřepu krok za krokem',
];

// ── Locked state preview data ──────────────────────────────────────────────

const COACH_CAPABILITIES = [
  {
    icon: '🎯',
    title: 'Plán na míru',
    desc: 'Odpovídá na otázky přesně k tvému plánu a cíli',
  },
  {
    icon: '🥗',
    title: 'Výživa v praxi',
    desc: 'Makra, načasování, jídlo před/po tréninku',
  },
  {
    icon: '💪',
    title: 'Technika cviků',
    desc: 'Vysvětlí správné provedení každého pohybu',
  },
  {
    icon: '🔥',
    title: 'Motivace & konzistence',
    desc: 'Pomůže přes výzvy, plató a ztrátu motivace',
  },
  {
    icon: '⚡',
    title: 'Okamžité odpovědi',
    desc: 'Dostupný 24/7, reaguje v sekundách',
  },
  {
    icon: '📈',
    title: 'Analýza pokroku',
    desc: 'Hodnotí výsledky a navrhuje úpravy',
  },
];

const SAMPLE_CONVERSATION = [
  {
    role: 'user' as const,
    content: 'Zasekl jsem se na váze 3 týdny. Co dělat?',
  },
  {
    role: 'assistant' as const,
    content:
      'Třídenní plató je normální — tělo se adaptuje. Zkontroluj tři věci: 1) Opravdu jíš v deficitu? Kalorie se snadno podhodnotí. 2) Spíš aspoň 7 hodin? Špatný spánek zvyšuje kortizol a zadržuje vodu. 3) Kde jsi byl před 3 týdny silově? Pokud jdeš nahoru ve vahách, progres probíhá i bez úbytku na váze.',
  },
];

// ── Main page ──────────────────────────────────────────────────────────────

export default function CoachPage() {
  const { profile } = useAuth();
  const { canAccess, isElite, tier } = useSubscription();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const hasAccess = canAccess('ai_coach');
  const dailyLimit = isElite ? AI_LIMITS.ELITE_DAILY : AI_LIMITS.PRO_DAILY;
  const showSuggestions = messages.length <= 1; // show after welcome only

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
      loadRemainingMessages();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasAccess]);

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

  const handleSend = async (text?: string) => {
    const trimmed = (text ?? input).trim();
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

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== typingId),
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: response.ok ? data.reply : data.error || 'Nastala chyba. Zkus to znovu.',
          timestamp: new Date(),
        },
      ]);

      if (data.remainingToday !== undefined) setRemainingMessages(data.remainingToday);
    } catch {
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

  // ── Locked state ──────────────────────────────────────────────────────────

  if (!hasAccess) {
    return (
      <div className="flex flex-col gap-6">

        {/* Coach identity hero */}
        <div className="relative overflow-hidden bg-surface border border-cta/25 rounded-2xl p-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-cta/5 to-highlight/5 pointer-events-none" />
          <div className="relative flex items-center gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-gradient-cta rounded-2xl flex items-center justify-center shadow-glow-blue">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-surface" />
            </div>
            {/* Identity */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-black text-text-primary">AI Kouč</h1>
                <span className="px-1.5 py-0.5 bg-cta/20 border border-cta/30 rounded text-[10px] font-bold text-cta uppercase tracking-wide">PRO</span>
              </div>
              <p className="text-sm text-text-secondary">Tvůj osobní transformační asistent</p>
              <p className="text-xs text-green-400 mt-0.5">● Online · Odpovídá v sekundách</p>
            </div>
          </div>
        </div>

        {/* Capability grid */}
        <div>
          <p className="text-xs font-bold text-text-secondary/50 uppercase tracking-wider mb-3">
            Co AI Kouč umí
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {COACH_CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="bg-surface border border-border rounded-2xl p-3.5 hover:border-cta/20 transition-colors"
              >
                <span className="text-xl">{cap.icon}</span>
                <p className="text-sm font-semibold text-text-primary mt-2 mb-0.5">{cap.title}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{cap.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sample conversation */}
        <div>
          <p className="text-xs font-bold text-text-secondary/50 uppercase tracking-wider mb-3">
            Ukázka rozhovoru
          </p>
          <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
            {SAMPLE_CONVERSATION.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-cta flex items-center justify-center text-white shrink-0 mr-2 mt-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div className={[
                  'max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed',
                  msg.role === 'user'
                    ? 'bg-primary border border-cta/40 text-text-primary rounded-tr-sm'
                    : 'bg-surface2 border border-border text-text-primary rounded-tl-sm',
                ].join(' ')}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade CTA */}
        <div className="relative overflow-hidden bg-surface border border-cta/30 rounded-2xl p-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-cta/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 bg-cta/20 border border-cta/30 rounded-full text-xs font-bold text-cta">
                PRO · {10} zpráv/den
              </span>
              <span className="text-xs text-text-secondary/60">nebo Elite · 50 zpráv/den</span>
            </div>
            <h3 className="text-base font-black text-text-primary mb-1">Odemkni AI Kouče</h3>
            <p className="text-sm text-text-secondary mb-4 leading-relaxed">
              Dostupný 24/7. Odpovídá k tvému konkrétnímu plánu, cvikům a výsledkům — ne obecně.
            </p>
            <Link href="/paywall">
              <Button variant="primary" fullWidth size="lg">
                Odemknout AI Kouče →
              </Button>
            </Link>
            <p className="text-xs text-text-secondary/40 text-center mt-2">14denní garance vrácení peněz</p>
          </div>
        </div>

      </div>
    );
  }

  // ── Active chat state ──────────────────────────────────────────────────────

  const limitReached = remainingMessages !== null && remainingMessages <= 0;

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">

      {/* ── Chat header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 pb-4 border-b border-border mb-3">
        <div className="relative shrink-0">
          <div className="w-9 h-9 bg-gradient-cta rounded-xl flex items-center justify-center shadow-glow-blue">
            <svg className="w-4.5 h-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black text-text-primary">{COACH.title}</h1>
            <span className="px-1.5 py-0.5 bg-cta/15 border border-cta/25 rounded text-[9px] font-bold text-cta uppercase tracking-wide">
              {tier?.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-green-400">● Online — {COACH.subtitle}</p>
        </div>
        {remainingMessages !== null && (
          <div className={[
            'px-2.5 py-1 rounded-full border text-xs font-semibold shrink-0',
            remainingMessages <= 2
              ? 'bg-red-950/30 border-red-800/50 text-red-400'
              : 'bg-cta/10 border-cta/25 text-cta',
          ].join(' ')}>
            {remainingMessages}/{dailyLimit}
          </div>
        )}
      </div>

      {/* ── Medical disclaimer ───────────────────────────────────────────────── */}
      <div className="flex items-start gap-2 p-3 bg-surface2 border border-border/50 rounded-xl mb-3">
        <svg className="w-3.5 h-3.5 text-text-secondary/50 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-text-secondary/50 leading-relaxed">{COACH.disclaimer}</p>
      </div>

      {/* ── Messages ────────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-1 -mr-1">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            {message.role === 'assistant' && (
              <div className="w-7 h-7 rounded-xl bg-gradient-cta flex items-center justify-center shrink-0 mr-2 mt-1 shadow-glow-blue">
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
            )}
            <div className={[
              'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
              message.role === 'user'
                ? 'bg-primary border border-cta/30 text-text-primary rounded-tr-sm'
                : 'bg-surface2 border border-border text-text-primary rounded-tl-sm',
              message.content === '...' ? 'animate-pulse' : '',
            ].join(' ')}>
              {message.content === '...' ? (
                <span className="flex gap-1 items-center py-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cta/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cta/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-cta/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}

        {/* Suggested questions — shown after welcome only */}
        {showSuggestions && !sending && (
          <div className="flex flex-col gap-2 animate-fade-in">
            <p className="text-xs text-text-secondary/50 font-semibold uppercase tracking-wide ml-9">
              Časté otázky
            </p>
            <div className="flex flex-col gap-1.5 ml-9">
              {SUGGESTED_QUESTIONS.slice(0, 4).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleSend(q)}
                  className="text-left text-xs px-3 py-2 rounded-xl bg-surface border border-border hover:border-cta/30 hover:bg-surface2 text-text-secondary hover:text-text-primary transition-all duration-150"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* ── Daily limit reached ──────────────────────────────────────────────── */}
      {limitReached && (
        <div className="py-3 px-4 bg-surface border border-border rounded-xl text-sm text-text-secondary text-center my-3">
          {COACH.limitReached}
        </div>
      )}

      {/* ── Input area ──────────────────────────────────────────────────────── */}
      <div className="pt-3 border-t border-border">
        <div className="flex gap-2.5 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={COACH.placeholder}
            rows={1}
            disabled={sending || limitReached}
            className="flex-1 px-4 py-3 bg-surface2 text-text-primary border border-border rounded-xl placeholder:text-text-secondary/40 focus:outline-none focus:ring-2 focus:ring-cta/30 focus:border-cta/50 transition-all resize-none text-sm max-h-32 disabled:opacity-50"
            style={{ minHeight: '48px' }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || sending || limitReached}
            className={[
              'shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200',
              'disabled:opacity-40 disabled:cursor-not-allowed',
              input.trim() && !sending && !limitReached
                ? 'bg-cta hover:bg-highlight shadow-glow-blue hover:shadow-glow-blue-lg'
                : 'bg-surface2 border border-border',
            ].join(' ')}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        <p className="text-[10px] text-text-secondary/30 text-center mt-2">
          Enter pro odeslat · Shift+Enter pro nový řádek
        </p>
      </div>
    </div>
  );
}

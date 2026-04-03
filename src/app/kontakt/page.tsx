'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Contact page — Kontaktuj nás
export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('obecne');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mailto fallback — opens email client
    const subject = encodeURIComponent(`Shapio kontakt: ${category === 'technicke' ? 'Technický problém' : category === 'fakturace' ? 'Fakturace' : 'Obecný dotaz'}`);
    const body = encodeURIComponent(`Jméno: ${name}\nE-mail: ${email}\n\nZpráva:\n${message}`);
    window.location.href = `mailto:jedlicekm@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      {/* Header */}
      <header className="border-b border-[#2A2A31] bg-[#151518]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B1E2D] to-[#D13A52] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-lg font-black text-[#F5F5F5]">Shapio</span>
          </Link>
          <Link href="/" className="text-sm text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">
            ← Zpět
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#F5F5F5] mb-3">Kontaktuj nás</h1>
          <p className="text-[#A1A1AA]">
            Máš otázku nebo potřebuješ pomoc? Napiš nám a ozveme se zpět.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
              title: 'E-mail',
              text: 'jedlicekm@gmail.com',
              href: 'mailto:jedlicekm@gmail.com',
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'Doba odpovědi',
              text: 'Obvykle 24–48 hodin',
              href: null,
            },
            {
              icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
              title: 'FAQ',
              text: 'Jak to funguje →',
              href: '/jak-to-funguje',
            },
          ].map((item, i) => (
            <div key={i} className="bg-[#151518] border border-[#2A2A31] rounded-2xl p-5">
              <div className="w-10 h-10 bg-[#B3263E]/10 border border-[#B3263E]/20 rounded-xl flex items-center justify-center text-[#B3263E] mb-3">
                {item.icon}
              </div>
              <p className="text-sm font-semibold text-[#F5F5F5] mb-1">{item.title}</p>
              {item.href ? (
                <a href={item.href} className="text-sm text-[#B3263E] hover:text-[#D13A52] transition-colors">
                  {item.text}
                </a>
              ) : (
                <p className="text-sm text-[#A1A1AA]">{item.text}</p>
              )}
            </div>
          ))}
        </div>

        {/* Support categories */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-[#F5F5F5] mb-4">Kategorie podpory</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: 'technicke', label: 'Technické problémy', desc: 'Chyby, přihlášení, výkon' },
              { id: 'fakturace', label: 'Fakturace a předplatné', desc: 'Platby, zrušení, vrácení' },
              { id: 'obecne', label: 'Obecné dotazy', desc: 'Jak to funguje, plány' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  category === cat.id
                    ? 'border-[#B3263E] bg-[#B3263E]/10'
                    : 'border-[#2A2A31] bg-[#151518] hover:border-[#B3263E]/40'
                }`}
              >
                <p className="text-sm font-semibold text-[#F5F5F5]">{cat.label}</p>
                <p className="text-xs text-[#A1A1AA] mt-1">{cat.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Contact form */}
        {!submitted ? (
          <div className="bg-[#151518] border border-[#2A2A31] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-5">Napsat zprávu</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#F5F5F5]">Jméno</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jan Novák"
                    required
                    className="px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-[#2A2A31] rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-[#F5F5F5]">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tvuj@email.cz"
                    required
                    className="px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-[#2A2A31] rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-[#F5F5F5]">Zpráva</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Popiš svůj dotaz nebo problém..."
                  required
                  rows={5}
                  className="px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-[#2A2A31] rounded-xl placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="py-3.5 bg-[#B3263E] hover:bg-[#D13A52] text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(179,38,62,0.4)]"
              >
                Odeslat zprávu
              </button>

              <p className="text-xs text-[#A1A1AA]/60 text-center">
                Kliknutím na odeslat se otevře váš e-mailový klient s předvyplněnou zprávou.
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-[#151518] border border-[#B3263E]/30 rounded-2xl p-8 text-center">
            <div className="w-12 h-12 bg-[#B3263E]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#B3263E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-[#F5F5F5] mb-2">Zpráva připravena</h3>
            <p className="text-[#A1A1AA] text-sm">
              Tvůj e-mailový klient by se měl otevřít s předvyplněnou zprávou. Pokud se nespustil, pošli nám e-mail přímo na{' '}
              <a href="mailto:jedlicekm@gmail.com" className="text-[#B3263E]">jedlicekm@gmail.com</a>.
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-[#2A2A31] flex gap-4 text-sm text-[#A1A1AA]">
          <Link href="/podminky-pouziti" className="hover:text-[#F5F5F5] transition-colors">
            Podmínky použití
          </Link>
          <Link href="/ochrana-osobnich-udaju" className="hover:text-[#F5F5F5] transition-colors">
            Ochrana osobních údajů
          </Link>
          <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
            Domů
          </Link>
        </div>
      </main>
    </div>
  );
}

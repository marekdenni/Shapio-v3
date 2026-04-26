'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { PricingSection } from '@/components/paywall/PricingSection';

function useScrollAnimation() {
  useEffect(() => {
    const handled = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            entry.target.classList.remove('section-hidden');
          }
        });
      },
      { threshold: 0.06, rootMargin: '0px 0px -40px 0px' }
    );

    // Staggered grid reveals — direct children animate in sequence
    document.querySelectorAll('.scroll-stagger').forEach((container) => {
      Array.from(container.children).forEach((child, i) => {
        (child as HTMLElement).style.transitionDelay = `${i * 85}ms`;
        child.classList.add('section-hidden');
        observer.observe(child);
        handled.add(child);
      });
    });

    // Individual reveals — skip anything already handled by stagger
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      if (!handled.has(el)) {
        el.classList.add('section-hidden');
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden scroll-animate">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface2/40 transition-colors"
      >
        <span className="text-sm font-semibold text-text-primary pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-text-secondary/60 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-border">
          <p className="text-sm text-text-secondary leading-relaxed pt-4">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── HERO ───────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 sm:pt-28 sm:pb-36">
        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-dot-grid opacity-40" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-cta/8 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cta/5 rounded-full blur-3xl" />
          <div className="absolute top-60 left-20 w-[300px] h-[300px] bg-highlight/8 rounded-full blur-[80px]" />
          {/* Animated gradient line at very top */}
          <div className="absolute top-0 left-0 right-0 h-px animate-gradient-border" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-cta/10 border border-cta/25 rounded-full text-sm text-cta mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-cta animate-pulse shrink-0" />
              <span className="font-medium">Více než 2 400 uživatelů transformuje své tělo</span>
            </div>

            {/* Wordmark */}
            <p className="text-xs font-bold tracking-[0.4em] text-text-secondary/50 uppercase mb-5">
              GET BETER
            </p>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[1.02] mb-7 animate-fade-in-up">
              Nahraj fotku.{' '}
              <br className="hidden sm:block" />
              Získej plán.{' '}
              <br />
              <span className="text-gradient-blue">
                Transformuj se.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
              AI analyzuje tvé tělo a vytvoří personalizovaný tréninkový a výživový plán — přímo pro tebe. Žádné generické cvičení. Jen to, co funguje.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-gradient-cta hover:opacity-90 text-white text-lg font-black rounded-2xl transition-all duration-200 shadow-glow-blue hover:shadow-glow-blue-lg hover:scale-[1.02] active:scale-100 animate-cta-pulse btn-shimmer"
              >
                Začni svou transformaci →
              </Link>
              <Link
                href="#jak-to-funguje"
                className="w-full sm:w-auto px-8 py-4 bg-surface hover:bg-surface2 text-text-primary text-lg font-semibold rounded-2xl border border-border hover:border-cta/40 transition-all duration-200 active:scale-[0.98]"
              >
                Jak to funguje?
              </Link>
            </div>

            {/* Trust micro-badges */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-secondary/60">
              {['Zdarma', 'Bez kreditní karty', 'Výsledky do 90 dní'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-cta/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Hero mockup */}
          <div className="mt-16 max-w-2xl mx-auto scroll-animate relative">
            {/* Floating stat card — left */}
            <div className="hidden lg:flex absolute -left-28 top-10 items-center gap-2.5 bg-surface border border-border rounded-xl px-3 py-2.5 shadow-card animate-float-slow z-10">
              <div className="w-8 h-8 rounded-lg bg-cta/20 border border-cta/30 flex items-center justify-center text-sm shrink-0">💪</div>
              <div>
                <p className="text-xs font-bold text-text-primary">+8.3 kg svalů</p>
                <p className="text-[10px] text-text-secondary/55">průměrně za 20 týdnů</p>
              </div>
            </div>

            {/* Floating stat card — right */}
            <div className="hidden lg:flex absolute -right-24 top-28 items-center gap-2.5 bg-surface border border-border rounded-xl px-3 py-2.5 shadow-card animate-float z-10">
              <div className="w-8 h-8 rounded-lg bg-highlight/20 border border-highlight/30 flex items-center justify-center text-sm shrink-0">🔥</div>
              <div>
                <p className="text-xs font-bold text-text-primary">−10.1 kg tuku</p>
                <p className="text-[10px] text-text-secondary/55">průměrně za 12 týdnů</p>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-3xl p-6 shadow-[0_4px_60px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_80px_rgba(59,130,246,0.14)] transition-shadow duration-500 relative overflow-hidden animate-float-slow">
              {/* Top gradient accent line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/50 to-transparent" />

              {/* Mock header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-gradient-cta flex items-center justify-center text-white font-black text-sm shadow-glow-blue shrink-0">
                  JN
                </div>
                <div>
                  <p className="font-bold text-text-primary text-sm">Jan Novák • AI analýza</p>
                  <p className="text-xs text-text-secondary/70">Dokončeno před chvílí</p>
                </div>
                <div className="ml-auto px-3 py-1 bg-cta/10 border border-cta/30 rounded-full text-xs text-cta font-semibold shrink-0">
                  PRO
                </div>
              </div>

              {/* Assessment */}
              <p className="text-text-secondary text-sm mb-5 leading-relaxed">
                Na základě tvého profilu jsem identifikoval klíčové oblasti pro transformaci.
                Tvůj 90denní program cílí na maximální spalování tuku při zachování svalové hmoty...
              </p>

              {/* Progress bars */}
              <div className="flex flex-col gap-3 mb-5">
                {[
                  { label: 'Spalování tuku', value: 87, cls: 'bg-cta' },
                  { label: 'Svalový rozvoj', value: 74, cls: 'bg-cta' },
                  { label: 'Celková kondice', value: 61, cls: 'bg-green-500' },
                ].map((stat, si) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-text-secondary">{stat.label}</span>
                      <span className="text-text-primary font-semibold">{stat.value}%</span>
                    </div>
                    <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${stat.cls} rounded-full hero-bar`}
                        style={{ '--bar-w': `${stat.value}%`, animationDelay: `${0.9 + si * 0.18}s` } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Locked sections */}
              <div className="flex flex-col gap-2">
                {['Kompletní tréninkový plán (90 dní)', 'Výživa a makronutrienty', 'AI Kouč 24/7'].map((item) => (
                  <div key={item} className="flex items-center gap-2 py-2 px-3 bg-surface2 rounded-xl border border-border">
                    <svg className="w-4 h-4 text-cta/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm text-text-secondary/45 blur-sm select-none flex-1">{item}</span>
                    <span className="text-xs text-cta font-semibold shrink-0">PRO</span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="mt-4 block w-full text-center py-3 bg-gradient-cta hover:opacity-90 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-glow-blue text-sm active:scale-[0.99]"
              >
                Odemknout PRO →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ────────────────────────────────────────────────────────── */}
      <section className="py-10 border-y border-border bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 scroll-animate">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '2 400+', label: 'aktivních uživatelů', icon: '👥' },
              { value: '89%', label: 'vidí změny do 60 dní', icon: '📈' },
              { value: '4.8/5', label: 'průměrné hodnocení', icon: '⭐' },
              { value: '12+', label: 'týdnů průměrný program', icon: '🗓️' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
                <span className="text-2xl mb-1">{stat.icon}</span>
                <p className="text-3xl sm:text-4xl font-black text-gradient-blue">{stat.value}</p>
                <p className="text-sm text-text-secondary">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-text-secondary/30 mt-4">* ilustrativní data</p>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────────────────────── */}
      <section id="jak-to-funguje" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Jak to funguje
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Tři kroky k tvé transformaci
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Od registrace po první viditelné výsledky — vše za méně než 5 minut nastavení
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
            {[
              {
                number: '01',
                icon: (
                  <svg className="w-7 h-7 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
                title: 'Nahraj fotku + vyplň dotazník',
                description: 'Stačí jedno selfie a pár otázek. AI analyzuje tvou postavu, cíle a životní styl. Celé nastavení zabere méně než 5 minut.',
              },
              {
                number: '02',
                icon: (
                  <svg className="w-7 h-7 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
                  </svg>
                ),
                title: 'AI vytvoří tvůj osobní plán',
                description: 'Na základě analýzy AI sestaví kompletní tréninkový a výživový plán šitý přesně na tebe — ne generické šablony.',
              },
              {
                number: '03',
                icon: (
                  <svg className="w-7 h-7 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: 'Sleduj pokrok a adaptuj se',
                description: 'Plnit plán, sledovat pokrok a AI kouč průběžně upravuje trénink podle toho, jak se tvé tělo mění a zlepšuje.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="scroll-animate relative bg-surface border border-border rounded-2xl p-6 hover:border-cta/40 transition-all duration-300 group card-hover overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl font-black text-cta/20 group-hover:text-cta/35 transition-colors leading-none">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 bg-cta/10 border border-cta/20 rounded-xl flex items-center justify-center shrink-0">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{step.title}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{step.description}</p>
                {i < 2 && <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-border" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHO IS THIS FOR ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Pro koho
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Pro koho je getbeter?
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Ať chceš nabrat svaly nebo zpevnit postavu — getbeter funguje pro každého
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 scroll-stagger">
            {[
              {
                photo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
                alt: 'Muž v posilovně',
                label: 'Pro muže',
                title: 'Nabrat svaly a definovat postavu',
                desc: 'Chceš vypadat lépe, mít více energie a cítit se silnější? AI sestaví plán zaměřený na budování svalové hmoty a snižování tělesného tuku — přesně podle tvého těla a cíle.',
              },
              {
                photo: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
                alt: 'Žena cvičí',
                label: 'Pro ženy',
                title: 'Zpevnit tělo, zhubnout a cítit se lépe',
                desc: 'Chceš zpevnit postavu, mít více energie a cítit se komfortně ve svém těle? Program kombinuje silový trénink a výživu pro trvalé výsledky bez extrémních diet.',
              },
            ].map((card) => (
              <div
                key={card.label}
                className="scroll-animate relative overflow-hidden rounded-2xl border border-border hover:border-cta/40 transition-all duration-300 group card-hover"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.photo} alt={card.alt} className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-700 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>
                <div className="p-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-cta/10 border border-cta/30 rounded-full text-xs text-cta font-semibold mb-3">
                    {card.label}
                  </div>
                  <h3 className="text-xl font-black text-text-primary mb-2">{card.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RESULTS PREVIEW ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Tvůj výsledek
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Ukázka toho, co dostaneš
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Ihned po registraci — ještě dnes
            </p>
          </div>

          <div className="max-w-2xl mx-auto scroll-animate">
            <div className="relative bg-surface border border-cta/25 rounded-3xl p-6 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/50 to-transparent rounded-t-3xl" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-black text-text-primary">Tvoje osobní hodnocení</h3>
                  <p className="text-xs text-text-secondary/65">Vygenerováno AI na základě tvého profilu</p>
                </div>
                <span className="px-3 py-1 bg-cta/10 border border-cta/30 rounded-full text-xs text-cta font-semibold shrink-0">
                  PRO PLAN
                </span>
              </div>

              <p className="text-text-secondary text-sm leading-relaxed mb-5 border-l-2 border-cta pl-4">
                Tvůj profil ukazuje skvělý potenciál pro rychlou transformaci. Doporučuji zaměřit se na kombinaci silového tréninku 4× týdně s kalorickým deficitem 15%. Při dodržení plánu lze očekávat viditelné výsledky do 6–8 týdnů.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Spalování tuku', value: '87%', cls: 'text-cta' },
                  { label: 'Svalový rozvoj', value: '74%', cls: 'text-blue-400' },
                  { label: 'Kondice', value: '61%', cls: 'text-green-400' },
                ].map((s) => (
                  <div key={s.label} className="bg-surface2 rounded-xl p-3 text-center border border-border">
                    <p className={`text-xl font-black ${s.cls}`}>{s.value}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-text-secondary/55 uppercase tracking-wider mb-3">
                  Ukázka tréninku — Den 1
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Bench press', sets: '4×8', rest: '90s' },
                    { name: 'Tlak s činkami', sets: '3×12', rest: '60s' },
                    { name: 'Kabel přetahy', sets: '3×15', rest: '45s' },
                  ].map((ex) => (
                    <div key={ex.name} className="flex items-center gap-3 p-2.5 bg-surface2 rounded-xl border border-border text-sm">
                      <div className="w-5 h-5 rounded bg-cta/20 border border-cta/30 flex items-center justify-center shrink-0">
                        <span className="text-cta text-xs">✓</span>
                      </div>
                      <span className="text-text-primary flex-1">{ex.name}</span>
                      <span className="text-text-secondary text-xs font-mono">{ex.sets}</span>
                      <span className="text-text-secondary text-xs">{ex.rest}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-5">
                {['Plný 90denní tréninkový plán', 'Výživa a personalizovaná makra', 'AI Kouč 24/7', 'Adaptivní přeplánování'].map((item) => (
                  <div key={item} className="flex items-center gap-2 py-2 px-3 bg-surface2/60 rounded-xl border border-border">
                    <svg className="w-4 h-4 text-cta/50 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm text-text-secondary/45 blur-sm select-none flex-1">{item}</span>
                    <span className="text-xs text-cta font-semibold shrink-0">PRO</span>
                  </div>
                ))}
              </div>

              <Link href="/register" className="block w-full text-center py-3.5 bg-gradient-cta hover:opacity-90 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-glow-blue active:scale-[0.99]">
                Odemknout PRO →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ──────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Funkce
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Vše, co potřebuješ
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Komplexní nástroje pro tvou transformaci na jednom místě
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 scroll-stagger">
            {[
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>,
                title: 'Personalizovaný tréninkový plán',
                description: 'Každý plán je unikátní — sestavený přesně pro tvoje tělo, cíl, vybavení a časové možnosti.',
                badge: 'Zdarma',
                badgeCls: 'bg-surface2 text-text-secondary border-border',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
                title: 'Výživa a stravovací doporučení',
                description: 'Kompletní výživový plán s recepty přizpůsobený tvým cílům, preferencím a alergím.',
                badge: 'Starter+',
                badgeCls: 'bg-blue-900/40 text-blue-400 border-blue-700/30',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                title: 'Sledování makroživin',
                description: 'Přesné makronutrienty, kalorické cíle a denní tracking pro maximální výsledky.',
                badge: 'Starter+',
                badgeCls: 'bg-blue-900/40 text-blue-400 border-blue-700/30',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>,
                title: 'Pokrok a srovnání fotek',
                description: 'Vizualizuj svou transformaci v čase. Nahraj fotky a sleduj, jak se tvé tělo mění týden po týdnu.',
                badge: 'PRO',
                badgeCls: 'bg-cta/20 text-cta border-cta/30',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
                title: 'AI kouč k dispozici',
                description: 'Osobní AI asistent odpovídá na tvé otázky o tréninku a výživě kdykoli — ve dne i v noci.',
                badge: 'PRO',
                badgeCls: 'bg-cta/20 text-cta border-cta/30',
              },
              {
                icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>,
                title: 'Adaptivní přeplánování',
                description: 'Plán se automaticky přizpůsobuje tvým výsledkům a pokroku — každý týden optimalizovaný pro tebe.',
                badge: 'PRO',
                badgeCls: 'bg-cta/20 text-cta border-cta/30',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="scroll-animate relative bg-background border border-border rounded-2xl p-6 transition-all duration-300 group hover-blue-glow overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-cta/10 border border-cta/20 rounded-xl flex items-center justify-center text-cta">
                    {feature.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${feature.badgeCls}`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-text-primary mb-2">{feature.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY IT WORKS ───────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Věda za výsledky
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Proč to funguje?
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Personalizace je klíč. Obecné plány selhávají proto, že ignorují individualitu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
            {[
              {
                number: '1',
                title: 'Personalizace na základě tvého těla',
                text: 'Každý člověk reaguje jinak na trénink a výživu. getbeter vytváří plán pro tvoje specifické tělo, metabolismus, úroveň kondice a cíle — ne pro průměrného uživatele.',
              },
              {
                number: '2',
                title: 'AI se učí z tvojí zpětné vazby',
                text: 'Jak plníš trénink a zaznamenáváš pokrok, AI vyhodnocuje data a upravuje plán. Tvůj program se stává chytřejším každý týden.',
              },
              {
                number: '3',
                title: 'Kombinace tréninku, výživy a konzistence',
                text: 'Výsledky přichází ze synergii správného tréninku, výživy a konzistentního sledování. getbeter integruje vše na jedno místo pro maximální efekt.',
              },
            ].map((reason, i) => (
              <div key={i} className="scroll-animate bg-surface border border-border rounded-2xl p-6 hover:border-cta/30 transition-all duration-300 hover:-translate-y-1">
                <div className="w-10 h-10 rounded-xl bg-cta/10 border border-cta/20 flex items-center justify-center text-cta font-black text-lg mb-4">
                  {reason.number}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{reason.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MENTAL TRANSFORMATION ──────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-highlight/10 border border-highlight/25 rounded-full text-xs text-highlight font-semibold uppercase tracking-wider mb-5">
              Mindset
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Není to jen o těle
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Fitness transformace mění nejen fyzičku — mění způsob, jakým přistupuješ k životu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
            {[
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
                title: 'Sebedůvěra',
                text: 'Viditelný pokrok v zrcadle a v číslech buduje sebedůvěru, která se přelévá do všech oblastí tvého života.',
                iconCls: 'text-cta bg-cta/10 border-cta/20',
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>,
                title: 'Disciplína',
                text: 'Pravidelné plnění tréninkového plánu trénuje mentální pevnost. To, co začíná v posilovně, se stává součástí tvého charakteru.',
                iconCls: 'text-highlight bg-highlight/10 border-highlight/20',
              },
              {
                icon: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
                title: 'Struktura',
                text: 'Jasný plán tréninku a výživy přináší strukturu do dne. Lidé se strukturou jsou produktivnější a mají méně stresu.',
                iconCls: 'text-cta bg-cta/10 border-cta/20',
              },
            ].map((pillar, i) => (
              <div key={i} className="scroll-animate bg-background border border-border rounded-2xl p-6 text-center hover:border-cta/30 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center mx-auto mb-4 ${pillar.iconCls}`}>
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{pillar.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRANSFORMATION STORIES ─────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Příběhy
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Příklady výsledků
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Reálné příběhy transformace
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 scroll-stagger">
            {[
              {
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
                name: 'Jakub', age: 28, role: 'IT konzultant',
                story: 'Sedavé zaměstnání, málo pohybu. Za 12 týdnů jsem zhubl 9 kg tuku a nabrál viditelné svaly. Plán mi šetřil čas a fungoval kolem mého rozvrhu.',
                result: '−9 kg tuku za 12 týdnů',
              },
              {
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
                name: 'Tereza', age: 24, role: 'studentka',
                story: 'Chtěla jsem zpevnit tělo, ale neměla jsem čas ani peníze na trenéra. getbeter mi dal přesný plán a AI kouč odpovídal na všechny otázky.',
                result: 'Výrazné zpevnění za 10 týdnů',
              },
              {
                photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
                name: 'Martin', age: 35, role: 'manažer',
                story: 'Po 5 letech bez pohybu jsem potřeboval návrat. getbeter sestavil plán pro moji úroveň a postupně mě vedl zpět do formy bez přetížení.',
                result: '+7 kg svalů za 20 týdnů',
              },
              {
                photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
                name: 'Klára', age: 30, role: 'podnikatelka',
                story: 'Chtěla jsem rekompozici těla a více energie. Díky personalizovanému plánu výživy a tréninku jsem dosáhla výsledků, o kterých jsem nevěřila.',
                result: 'Rekompozice za 16 týdnů',
              },
            ].map((story, i) => (
              <div key={i} className="scroll-animate bg-surface border border-border rounded-2xl p-5 flex flex-col hover-blue-glow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-border shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.photo} alt={story.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-sm">{story.name}, {story.age}</p>
                    <p className="text-xs text-text-secondary">{story.role}</p>
                  </div>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">&ldquo;{story.story}&rdquo;</p>
                <div className="px-3 py-2 bg-cta/10 border border-cta/30 rounded-xl text-xs text-cta font-semibold text-center">
                  {story.result}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-text-secondary/30 mt-6">* Ilustrativní příběhy. Výsledky se individuálně liší.</p>
        </div>
      </section>

      {/* ── TRANSFORMATION RESULTS 90 DAYS ─────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              90 dní
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Co čekat za 90 dní
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Ilustrativní přehled typických výsledků podle cíle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                emoji: '💪', name: 'Jakub, 28 let', sub: 'Spalování tuku · IT konzultant', weeks: '12 týdnů',
                stats: [
                  { label: 'Tělesná hmotnost', before: '94 kg', after: '83 kg', delta: '−11 kg', progress: 78 },
                  { label: 'Obvod pasu', before: '98 cm', after: '87 cm', delta: '−11 cm', progress: 72 },
                  { label: 'Týdenní tréninky', before: '0×', after: '4×', delta: '+4×', progress: 100 },
                  { label: 'Energie (1–10)', before: '4', after: '8', delta: '+4', progress: 80 },
                ],
                quote: 'Sedavé zaměstnání, málo pohybu. Za 12 týdnů jsem zhubl 11 kg tuku a nabrál viditelné svaly.',
              },
              {
                emoji: '🔥', name: 'Tereza, 24 let', sub: 'Zpevnění postavy · studentka', weeks: '10 týdnů',
                stats: [
                  { label: 'Tělesná hmotnost', before: '68 kg', after: '63 kg', delta: '−5 kg', progress: 65 },
                  { label: 'Svalová pevnost', before: 'nízká', after: 'střední+', delta: '+výrazná', progress: 85 },
                  { label: 'Týdenní tréninky', before: '0×', after: '3×', delta: '+3×', progress: 90 },
                  { label: 'Sebedůvěra (1–10)', before: '5', after: '9', delta: '+4', progress: 90 },
                ],
                quote: 'Neměla jsem čas ani peníze na trenéra. getbeter mi dal přesný plán a výsledky jsou vidět.',
              },
            ].map((profile, idx) => (
              <div key={idx} className="scroll-animate rounded-2xl overflow-hidden border border-border bg-background">
                <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
                  <div className="w-9 h-9 rounded-full bg-surface2 border border-border flex items-center justify-center text-base shrink-0">{profile.emoji}</div>
                  <div>
                    <p className="text-sm font-bold text-text-primary">{profile.name}</p>
                    <p className="text-xs text-text-secondary">{profile.sub}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs px-2 py-1 bg-primary/30 border border-cta/30 rounded-lg text-highlight font-semibold">{profile.weeks}</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-4">
                  {profile.stats.map((stat) => (
                    <div key={stat.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-text-secondary">{stat.label}</span>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-text-secondary/50 line-through">{stat.before}</span>
                          <span className="font-bold text-text-primary">{stat.after}</span>
                          <span className="text-highlight font-bold">{stat.delta}</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-cta rounded-full" style={{ width: `${stat.progress}%` }} />
                      </div>
                    </div>
                  ))}
                  <div className="mt-1 p-3 bg-surface2 rounded-xl border border-border">
                    <p className="text-xs text-text-secondary/75 italic leading-relaxed">&ldquo;{profile.quote}&rdquo;</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-text-secondary/30 mt-8">
            * Ilustrativní příklady. Výsledky se individuálně liší. getbeter není zdravotnickým prostředkem.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ───────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Recenze
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Co říkají uživatelé
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Přidej se k tisícům spokojených uživatelů
            </p>
          </div>

          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible scroll-stagger">
            {[
              {
                initials: 'MK', name: 'Martin K.', city: 'Praha', stars: 5,
                review: 'Za 3 měsíce jsem shodil 12 kg. Plán byl přesně na míru a AI kouč odpovídal na všechny dotazy. Žádná jiná aplikace tohle nedokáže.',
                goal: 'Spalování tuku',
                avatarCls: 'bg-cta/20 border-cta/30 text-cta',
              },
              {
                initials: 'TH', name: 'Tomáš H.', city: 'Brno', stars: 5,
                review: 'AI kouč je parádní. Plán se přizpůsobil, když jsem si poranil koleno. Výsledky jsou vidět.',
                goal: 'Nabírání svalů',
                avatarCls: 'bg-highlight/20 border-highlight/30 text-highlight',
              },
              {
                initials: 'JP', name: 'Jana P.', city: 'Ostrava', stars: 5,
                review: 'Konečně plán, který respektuje moje časové možnosti. 3× týdně 45 minut a po 2 měsících mám pevnější tělo a více energie.',
                goal: 'Zpevnění postavy',
                avatarCls: 'bg-primary/30 border-primary/40 text-blue-300',
              },
              {
                initials: 'LN', name: 'Lukáš N.', city: 'Plzeň', stars: 4,
                review: 'Skvělá personalizace. Výživa je detailně propočítaná a recepty jsou praktické.',
                goal: 'Rekompozice',
                avatarCls: 'bg-cta/20 border-cta/30 text-cta',
              },
            ].map((review, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-5 hover-blue-glow shrink-0 w-72 md:w-auto flex flex-col">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className={`w-4 h-4 ${j < review.stars ? 'text-yellow-400' : 'text-border'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed mb-4 flex-1">&ldquo;{review.review}&rdquo;</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-xs font-bold ${review.avatarCls}`}>
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-text-primary">{review.name}</p>
                      <p className="text-xs text-text-secondary/50">{review.city}</p>
                    </div>
                  </div>
                  <span className="text-xs text-text-secondary/50 bg-surface2 px-2 py-1 rounded-lg">{review.goal}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-text-secondary/30 mt-4">* Ilustrativní recenze. Výsledky se individuálně liší.</p>
        </div>
      </section>

      {/* ── SYSTEM VS CHAOS ────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-dot-grid opacity-30" />
        </div>
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cta/10 border border-cta/25 rounded-full text-sm text-cta mb-6">
              <span className="w-2 h-2 rounded-full bg-cta shrink-0" />
              Pro lidi, kteří to zkusili, ale nevydrželi
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Konečně systém místo chaosu
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Dost bylo hledání videí na YouTube a obecných plánů z internetu. getbeter ti řekne přesně co, kdy a proč.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <div className="scroll-animate bg-surface border border-border rounded-2xl p-6">
              <p className="text-xs font-semibold text-text-secondary/40 uppercase tracking-wider mb-4">Bez systému</p>
              {[
                'Každý týden jiný plán z jiného zdroje',
                'Nevíš, jestli cvičíš dost nebo moc',
                'Po 2 týdnech motivace zmizí',
                'Výživa? Buď přísná dieta nebo nic',
                'Nevidíš výsledky → vzdáváš to',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 mb-3 last:mb-0">
                  <div className="w-5 h-5 rounded-full bg-red-900/30 border border-red-800/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>

            <div className="scroll-animate relative bg-surface border border-cta/35 rounded-2xl p-6 shadow-[0_0_30px_rgba(59,130,246,0.07)] overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/50 to-transparent" />
              <p className="text-xs font-semibold text-cta uppercase tracking-wider mb-4">Se getbeter</p>
              {[
                'Jeden jasný plán šitý na tebe — hned první den',
                'Přesně víš, co dělat a proč to funguje',
                'Systém, který tě drží konzistentní',
                'Výživa přizpůsobená tvému cíli a preferencím',
                'Vidíš pokrok → chceš pokračovat',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 mb-3 last:mb-0">
                  <div className="w-5 h-5 rounded-full bg-cta/20 border border-cta/40 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-primary">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FIRST DAY TIMELINE ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              První den
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Co dostaneš hned první den
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Žádné čekání, žádné zbytečné intro. getbeter tě nastaví za méně než 5 minut.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {[
              { step: '01', time: 'Za 2 minuty', title: 'Vyplníš dotazník', desc: 'Cíl, váha, výška, úroveň, vybavení. Pár kliknutí — žádné složité formuláře.' },
              { step: '02', time: 'Za 3 minuty', title: 'AI sestaví tvůj plán', desc: 'getbeter zpracuje tvůj profil a vygeneruje tréninkový i výživový plán přesně pro tebe.' },
              { step: '03', time: 'Ihned', title: 'Vidíš svou první analýzu', desc: 'Dostaneš osobní hodnocení: kde začínáš, co tě brzdí a na co se zaměřit v prvním týdnu.' },
              { step: '04', time: 'Dnes', title: 'Máš první trénink připravený', desc: 'Dnešní trénink, cviky, sety a opakování. Víš přesně, co dělat ještě dnes večer.' },
            ].map((item, i) => (
              <div key={i} className="scroll-animate flex gap-4 mb-6 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl bg-cta/10 border border-cta/30 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-cta">{item.step}</span>
                  </div>
                  {i < 3 && <div className="w-px flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-6">
                  <span className="text-xs font-semibold text-cta uppercase tracking-wider">{item.time}</span>
                  <h3 className="text-base font-bold text-text-primary mt-1 mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 scroll-animate">
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-cta hover:opacity-90 text-white font-black rounded-2xl transition-all duration-200 hover:shadow-glow-blue hover:scale-[1.02] active:scale-100 btn-shimmer">
              Začít hned →
            </Link>
            <p className="text-xs text-text-secondary/50 mt-3">Zdarma · Bez kreditní karty</p>
          </div>
        </div>
      </section>

      {/* ── WHY YOU'LL PERSIST ─────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Konzistence
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Proč to tentokrát vydržíš
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Přestat není selhání tvé vůle. Je to selhání systému. getbeter to mění.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 scroll-stagger">
            {[
              { icon: '🎯', title: 'Víš přesně, co dělat', desc: 'Nejistota je největší nepřítel konzistentnosti. getbeter odstraní otázku „co dnes cvičit?" jednou provždy.' },
              { icon: '📈', title: 'Vidíš, že to funguje', desc: 'Sleduješ pokrok v číslech i vizuálně. Když vidíš výsledky, chceš pokračovat. Motivace přichází sama.' },
              { icon: '🤝', title: 'Plán se přizpůsobuje tobě', desc: 'Nestíháš 5 tréninků? Plán se upraví. Máš zranění? getbeter ví. Nejsi vězněm rigidního plánu.' },
            ].map((card, i) => (
              <div key={i} className="scroll-animate bg-surface border border-border rounded-2xl p-6 hover:border-cta/40 transition-all duration-300 hover:-translate-y-1">
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-text-primary mb-3">{card.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI COACH DEMO ──────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cta/10 border border-cta/25 rounded-full text-sm text-cta mb-6">
                <span className="text-base">🧠</span>
                Osobní průvodce, ne jen seznam cviků
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-5">
                getbeter ti neřekne jen co cvičit, ale co dělat dál
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                Každý druhý plán ti dá seznam cviků. Jenže cviky samotné nestačí — potřebuješ vědět, proč cvičíš právě tohle, co jíst po tréninku a jak reagovat, když tě to přestane bavit.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Dnes: víš, co cvičit a co jíst',
                  'Za týden: vidíš první změny v energii',
                  'Za měsíc: vidíš výsledky v zrcadle',
                  'Za 3 měsíce: vybudoval sis návyk, který drží',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-cta shrink-0" />
                    <span className="text-sm text-text-primary">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-animate">
              <div className="bg-background border border-border rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-gradient-cta rounded-lg flex items-center justify-center shadow-glow-blue shrink-0">
                    <span className="text-white font-black text-xs">G</span>
                  </div>
                  <span className="text-sm font-semibold text-text-primary">Get Beter AI Kouč</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-green-500" />
                </div>
                {[
                  { from: 'user', text: 'Mám bolavé rameno — mám dnes vynechat?' },
                  { from: 'ai', text: 'Ne, nevynechávej. Upravím dnešní plán — přeskočíme tlaky nad hlavou a nahradím je izolačními cviky na jinou partii. Rameno si odpočine, aniž by ses zastavil.' },
                  { from: 'user', text: 'A co jídlo — mám jíst méně, protože jsem necvičil plně?' },
                  { from: 'ai', text: 'Bílkoviny nesnižuj — tělo je potřebuje na regeneraci. Sacharidy sníž o 15–20 %. Dám ti přesné číslo podle tvého dnešního plánu.' },
                ].map((msg, i) => (
                  <div key={i} className={`mb-3 last:mb-0 flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] px-3.5 py-2.5 rounded-xl text-sm leading-relaxed ${msg.from === 'user' ? 'bg-cta/20 border border-cta/30 text-text-primary' : 'bg-surface2 border border-border text-text-secondary'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <p className="text-xs text-text-secondary/35 text-center mt-4">Ilustrativní ukázka AI kouče (PRO plán)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── NO GYM NEEDED ──────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="scroll-animate order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: '🏠', title: 'Doma', desc: 'Plán s vlastní vahou. Stačí 2 m² podlahy.' },
                  { icon: '🪢', title: 'Doma s vybavením', desc: 'Gumy, jednoručky, hrazda? Plán to využije naplno.' },
                  { icon: '🏋️', title: 'Posilovna', desc: 'Plný přístup ke vybavení = maximum výsledků.' },
                  { icon: '🌳', title: 'Venku', desc: 'Parkoury, lavičky, příroda. Kardio i silový trénink.' },
                ].map((opt) => (
                  <div key={opt.icon} className="bg-surface border border-border rounded-2xl p-4 hover:border-cta/40 transition-all duration-200 hover:-translate-y-0.5">
                    <div className="text-2xl mb-2">{opt.icon}</div>
                    <p className="text-sm font-bold text-text-primary mb-1">{opt.title}</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{opt.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-animate order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cta/10 border border-cta/25 rounded-full text-sm text-cta mb-6">
                <span>🏠</span>
                Posilovna není podmínka
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-5">
                I bez posilovny můžeš začít správně
              </h2>
              <p className="text-text-secondary leading-relaxed mb-5">
                Nemáš přístup do posilovny? Nevadí. getbeter vytvoří plán přesně pro vybavení, které máš. Nic víc nepotřebuješ.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8">
                Doma, v parku nebo v plně vybavené posilovně — plán se přizpůsobí. Správný systém nezávisí na místě, kde cvičíš.
              </p>
              <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-cta hover:opacity-90 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-glow-blue active:scale-[0.98] btn-shimmer">
                Začít hned zdarma →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-surface">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Rich section header */}
          <div className="text-center mb-12 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Plány & Ceník
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Vyber svou úroveň transformace
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto mb-10">
              Každý plán obsahuje osobní AI analýzu a tréninkový plán. Prémiové plány odemknou výživu s makry, AI kouče 24/7 a adaptivní přeplánování.
            </p>

            {/* Plan hierarchy axis */}
            <div className="flex flex-wrap items-start justify-center gap-3">
              {[
                { icon: '🆓', label: 'Free', sub: 'AI analýza + 30denní plán', border: 'border-border', text: 'text-text-secondary/60' },
                { icon: '📈', label: 'Starter', sub: 'Výživa s makry + check-iny', border: 'border-green-500/30', text: 'text-green-400' },
                { icon: '⚡', label: 'Pro', sub: 'AI kouč + adaptivní plán', border: 'border-cta/40', text: 'text-cta', popular: true },
                { icon: '👑', label: 'Elite', sub: '6 měsíců + neomezený kouč', border: 'border-highlight/40', text: 'text-highlight' },
              ].map((item) => (
                <div key={item.label} className={`relative flex items-center gap-2.5 px-4 py-2.5 bg-surface2 border rounded-xl ${item.border}`}>
                  {item.popular && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-cta border border-cta/60 rounded text-[9px] font-black text-white whitespace-nowrap">
                      NEJOBLÍBENĚJŠÍ
                    </span>
                  )}
                  <span className="text-base">{item.icon}</span>
                  <div className="text-left">
                    <span className={`text-xs font-black block ${item.text}`}>{item.label}</span>
                    <span className="text-[10px] text-text-secondary/50">{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-animate">
            <PricingSection showTitle={false} />
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 scroll-animate">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-cta/10 border border-cta/25 rounded-full text-xs text-cta font-semibold uppercase tracking-wider mb-5">
              Časté otázky
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-text-primary mb-4">
              Máš otázky? Máme odpovědi.
            </h2>
            <p className="text-text-secondary text-lg">
              Vše, co potřebuješ vědět předtím, než začneš.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {[
              {
                q: 'Potřebuji kreditní kartu pro Free plán?',
                a: 'Ne. Free plán je skutečně zdarma — bez jakýchkoli platebních údajů. Zaregistruj se emailem a okamžitě začni. Platební karta je potřeba pouze pro prémiové plány Starter, Pro nebo Elite.',
              },
              {
                q: 'Co obsahuje AI analýza mého profilu?',
                a: 'AI analyzuje tvůj věk, pohlaví, výšku, váhu, úroveň aktivity, cíle, dostupné vybavení a preference. Na základě toho dostaneš hodnocení výchozího stavu, identifikaci klíčových oblastí a první tréninkový plán — ještě před prvním tréninkem.',
              },
              {
                q: 'Potřebuji posilovnu nebo speciální vybavení?',
                a: 'Vůbec ne. Při registraci zadáš dostupné vybavení — a plán se přizpůsobí. Funguje pro domácí trénink s vlastní vahou, s gumy nebo jednoručkami, i pro plně vybavenou posilovnu. Výsledky závisí na tvém úsilí, ne na vybavení.',
              },
              {
                q: 'Jak se liší getbeter od YouTube videí nebo generických plánů?',
                a: 'YouTube videa jsou pro průměrného uživatele, ne pro tebe. getbeter sestaví plán přesně podle tvého těla, cíle, úrovně a vybavení. Navíc sleduje tvůj pokrok a mění se s tebou — takže nikdy necvičíš zbytečně nebo příliš málo.',
              },
              {
                q: 'Jak funguje AI kouč a kolik zpráv mám denně?',
                a: 'AI kouč je personalizovaný asistent trénovaný na tvém profilu a plánu. Odpovídá na otázky o tréninku, výživě, regeneraci a motivaci — v kontextu tvého konkrétního programu. V Pro plánu máš 10 zpráv denně, v Elite 50 zpráv denně.',
              },
              {
                q: 'Co je adaptivní plánování?',
                a: 'Adaptivní plánování znamená, že se tvůj program každý týden přehodnocuje podle reálných výsledků. Nestíháš 5 tréninků? Plán se upraví. Stagnuješ? Intenzita se zvýší. AI vyhodnotí pokrok a navrhne změny — nemusíš být expert.',
              },
              {
                q: 'Mohu kdykoliv zrušit předplatné?',
                a: 'Ano, kdykoliv a bez podmínek. Přejdi do nastavení účtu a zrušíš jedním kliknutím. Přístup ti zůstane do konce aktuálního fakturačního období. Nabízíme také 14denní garanci vrácení peněz bez otázek.',
              },
              {
                q: 'Jsou moje data a fotky v bezpečí?',
                a: 'Ano. Všechna data jsou šifrována a uložena v zabezpečené databázi (Supabase, EU region). Tvoje fotky jsou přístupné výhradně tobě. Nikdy neprodáváme ani nesdílíme tvoje osobní údaje třetím stranám. Více najdeš v podmínkách ochrany osobních údajů.',
              },
            ].map((item, i) => (
              <FaqItem key={i} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-dot-grid opacity-25" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-cta/8 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-highlight/6 rounded-full blur-[80px]" />
          <div className="absolute top-0 left-0 right-0 h-px animate-gradient-border" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center scroll-animate">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cta/10 border border-cta/25 rounded-full text-sm text-cta mb-8">
            <span className="w-2 h-2 rounded-full bg-cta animate-pulse shrink-0" />
            Připoj se k tisícům uživatelů
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-text-primary mb-6">
            Začni svou transformaci{' '}
            <span className="text-gradient-blue">dnes</span>
          </h2>
          <p className="text-text-secondary text-lg mb-10 leading-relaxed">
            Prvních 30 dní zdarma. Žádná kreditní karta potřeba.
            Přidej se a začni svou transformaci ještě dnes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-cta hover:opacity-90 text-white text-xl font-black rounded-2xl transition-all duration-200 shadow-glow-blue hover:shadow-glow-blue-lg hover:scale-[1.03] active:scale-100 animate-cta-pulse btn-shimmer"
          >
            Začít svou transformaci
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-sm text-text-secondary/40 mt-5">
            30 dní zdarma · Bez platební karty · Zrušení kdykoliv
          </p>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4 group w-fit">
                <div className="w-9 h-9 bg-gradient-cta rounded-xl flex items-center justify-center shadow-glow-blue shrink-0">
                  <span className="text-white font-black text-sm">G</span>
                </div>
                <span className="text-xl font-black text-text-primary group-hover:text-white transition-colors">Get Beter</span>
              </Link>
              <p className="text-sm text-text-secondary/55 leading-relaxed max-w-xs">
                AI-powered transformace těla. Personalizovaný trénink a výživa pro každého.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-bold text-text-secondary/35 uppercase tracking-wider mb-4">Produkt</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: '/#jak-to-funguje', label: 'Jak to funguje' },
                  { href: '/#pricing', label: 'Ceník' },
                  { href: '/jak-to-funguje', label: 'Průvodce' },
                  { href: '/register', label: 'Začít zdarma' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-text-secondary/55 hover:text-text-primary transition-colors w-fit">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-bold text-text-secondary/35 uppercase tracking-wider mb-4">Právní</p>
              <div className="flex flex-col gap-2.5">
                {[
                  { href: '/kontakt', label: 'Kontakt' },
                  { href: '/podminky-pouziti', label: 'Podmínky použití' },
                  { href: '/ochrana-osobnich-udaju', label: 'Ochrana osobních údajů' },
                ].map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm text-text-secondary/55 hover:text-text-primary transition-colors w-fit">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-secondary/35">
            <p>© 2026 getbeter. Všechna práva vyhrazena.</p>
            <p>Tato aplikace není zdravotnickým prostředkem. Výsledky se individuálně liší.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

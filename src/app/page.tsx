'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { PricingSection } from '@/components/paywall/PricingSection';

// Hook for intersection observer based entrance animations
function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible');
            entry.target.classList.remove('section-hidden');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      el.classList.add('section-hidden');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}

export default function LandingPage() {
  useScrollAnimation();

  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Navbar />

      {/* ── SECTION 1: HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#B3263E]/6 rounded-full blur-3xl" />
          <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-[#8B1E2D]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#B3263E]/4 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-full text-sm text-[#D13A52] mb-8 animate-fade-in-up">
              <span className="w-2 h-2 rounded-full bg-[#B3263E] animate-pulse" />
              Více než 2 400 uživatelů transformuje své tělo
            </div>

            {/* Wordmark */}
            <p className="text-sm font-semibold tracking-[0.3em] text-[#A1A1AA] uppercase mb-4">
              SHAPIO
            </p>

            {/* Main headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-[#F5F5F5] leading-[1.05] mb-6 animate-fade-in-up">
              Nahraj fotku.{' '}
              <br className="hidden sm:block" />
              Získej plán.{' '}
              <br />
              <span className="bg-gradient-to-r from-[#B3263E] to-[#D13A52] bg-clip-text text-transparent">
                Transformuj se.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-[#A1A1AA] max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up">
              AI analyzuje tvé tělo a vytvoří personalizovaný tréninkový a výživový plán — přímo pro tebe. Žádné generické cvičení. Jen to, co funguje.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-[#B3263E] hover:bg-[#D13A52] text-white text-lg font-black rounded-2xl transition-all duration-200 shadow-[0_0_30px_rgba(179,38,62,0.4)] hover:shadow-[0_0_40px_rgba(179,38,62,0.6)] hover:scale-105 active:scale-100 animate-cta-pulse"
              >
                Začni svou transformaci →
              </Link>
              <Link
                href="#jak-to-funguje"
                className="w-full sm:w-auto px-8 py-4 bg-[#151518] hover:bg-[#1D1D22] text-[#F5F5F5] text-lg font-semibold rounded-2xl border border-[#2A2A31] hover:border-[#B3263E]/40 transition-all duration-200"
              >
                Jak to funguje?
              </Link>
            </div>

            {/* Trust line */}
            <p className="text-sm text-[#A1A1AA]/60">
              Zdarma · Bez kreditní karty · Výsledky do 90 dní
            </p>
          </div>

          {/* Hero app mockup — styled preview card */}
          <div className="mt-16 max-w-2xl mx-auto scroll-animate">
            <div className="bg-[#151518] border border-[#2A2A31] rounded-3xl p-6 shadow-[0_4px_40px_rgba(0,0,0,0.5)] relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B3263E]/40 to-transparent" />

              {/* Mock header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8B1E2D] to-[#D13A52] flex items-center justify-center text-white font-black text-sm">
                  JN
                </div>
                <div>
                  <p className="font-bold text-[#F5F5F5] text-sm">Jan Novák • AI analýza</p>
                  <p className="text-xs text-[#A1A1AA]">Dokončeno před chvílí</p>
                </div>
                <div className="ml-auto px-3 py-1 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-full text-xs text-[#B3263E] font-semibold">
                  PRO
                </div>
              </div>

              {/* Assessment summary */}
              <p className="text-[#A1A1AA] text-sm mb-5 leading-relaxed">
                Na základě tvého profilu a fotky jsem identifikoval klíčové oblasti pro transformaci.
                Tvůj 90denní program cílí na maximální spalování tuku při zachování svalové hmoty...
              </p>

              {/* Stats bars */}
              <div className="flex flex-col gap-3 mb-5">
                {[
                  { label: 'Spalování tuku', value: 87, color: '#B3263E' },
                  { label: 'Svalový rozvoj', value: 74, color: '#3B82F6' },
                  { label: 'Celková kondice', value: 61, color: '#10B981' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#A1A1AA]">{stat.label}</span>
                      <span className="text-[#F5F5F5] font-semibold">{stat.value}%</span>
                    </div>
                    <div className="h-2 bg-[#1D1D22] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Locked sections */}
              <div className="flex flex-col gap-2">
                {['Kompletní tréninkový plán (90 dní)', 'Výživa a makronutrienty', 'AI Kouč 24/7'].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 py-2 px-3 bg-[#1D1D22] rounded-xl border border-[#2A2A31]"
                  >
                    <svg className="w-4 h-4 text-[#B3263E]/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm text-[#A1A1AA]/60 blur-sm select-none flex-1">{item}</span>
                    <span className="text-xs text-[#B3263E] font-semibold shrink-0">PRO</span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="mt-4 block w-full text-center py-3 bg-[#B3263E] hover:bg-[#D13A52] text-white font-bold rounded-xl transition-all duration-200 text-sm"
              >
                Odemknout PRO →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: SOCIAL PROOF NUMBERS ────────────────────────────────── */}
      <section className="py-12 border-y border-[#2A2A31] bg-[#151518]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 scroll-animate">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '2 400+', label: 'aktivních uživatelů' },
              { value: '89%', label: 'vidí změny do 60 dní' },
              { value: '4.8/5', label: 'průměrné hodnocení' },
              { value: '12+', label: 'týdnů průměrný program' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <p className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-[#B3263E] to-[#D13A52] bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-[#A1A1AA] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#A1A1AA]/40 mt-4">* ilustrativní data</p>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="jak-to-funguje" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Jak Shapio funguje?
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Tři jednoduché kroky k tvé transformaci
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: '01',
                icon: (
                  <svg className="w-7 h-7 text-[#B3263E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg className="w-7 h-7 text-[#B3263E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-1" />
                  </svg>
                ),
                title: 'AI vytvoří tvůj osobní plán',
                description: 'Na základě analýzy AI sestaví kompletní tréninkový a výživový plán šitý přesně na tebe — ne generické šablony.',
              },
              {
                number: '03',
                icon: (
                  <svg className="w-7 h-7 text-[#B3263E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ),
                title: 'Sleduj pokrok a adaptuj se',
                description: 'Plnit plán, sledovat pokrok a AI kouč průběžně upravuje trénink podle toho, jak se tvé tělo mění a zlepšuje.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="scroll-animate relative bg-[#151518] border border-[#2A2A31] rounded-2xl p-6 hover:border-[#B3263E]/40 transition-all duration-300 group card-hover"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl font-black text-[#B3263E]/20 group-hover:text-[#B3263E]/30 transition-colors leading-none">
                    {step.number}
                  </span>
                  <div className="w-12 h-12 bg-[#B3263E]/10 border border-[#B3263E]/20 rounded-xl flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">{step.title}</h3>
                <p className="text-[#A1A1AA] leading-relaxed text-sm">{step.description}</p>

                {/* Connector */}
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-px bg-[#2A2A31]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHO IS THIS FOR (UNISEX) ────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#151518]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Pro koho je Shapio?
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Ať chceš nabrat svaly nebo zpevnit postavu — Shapio funguje pro každého
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pro muže */}
            <div className="scroll-animate relative overflow-hidden rounded-2xl border border-[#2A2A31] hover:border-[#B3263E]/40 transition-all duration-300 group card-hover">
              <div className="aspect-[4/3] relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80"
                  alt="Muž v posilovně"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/40 to-transparent" />
              </div>
              <div className="p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-full text-xs text-[#B3263E] font-semibold mb-3">
                  Pro muže
                </div>
                <h3 className="text-xl font-black text-[#F5F5F5] mb-2">
                  Nabrat svaly a definovat postavu
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  Chceš vypadat lépe, mít více energie a cítit se silnější? AI sestaví plán zaměřený na budování svalové hmoty a snižování tělesného tuku — přesně podle tvého těla a cíle.
                </p>
              </div>
            </div>

            {/* Pro ženy */}
            <div className="scroll-animate relative overflow-hidden rounded-2xl border border-[#2A2A31] hover:border-[#B3263E]/40 transition-all duration-300 group card-hover">
              <div className="aspect-[4/3] relative overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80"
                  alt="Žena cvičí"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/40 to-transparent" />
              </div>
              <div className="p-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-full text-xs text-[#B3263E] font-semibold mb-3">
                  Pro ženy
                </div>
                <h3 className="text-xl font-black text-[#F5F5F5] mb-2">
                  Zpevnit tělo, zhubnout a cítit se lépe
                </h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">
                  Chceš zpevnit postavu, mít více energie a cítit se komfortně ve svém těle? Program kombinuje silový trénink a výživu pro trvalé výsledky bez extrémních diet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: TRANSFORMATION RESULTS PREVIEW ──────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Tvůj výsledek vypadá takto
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Ukázka toho, co dostaneš ihned po registraci
            </p>
          </div>

          <div className="max-w-2xl mx-auto scroll-animate">
            <div className="bg-[#151518] border border-[#B3263E]/30 rounded-3xl p-6 shadow-[0_0_40px_rgba(179,38,62,0.1)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#B3263E]/40 to-transparent rounded-t-3xl" />

              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="font-black text-[#F5F5F5]">Tvoje osobní hodnocení</h3>
                  <p className="text-xs text-[#A1A1AA]">Vygenerováno AI na základě tvého profilu</p>
                </div>
                <span className="px-3 py-1 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-full text-xs text-[#B3263E] font-semibold">
                  PRO PLAN
                </span>
              </div>

              <p className="text-[#A1A1AA] text-sm leading-relaxed mb-5 border-l-2 border-[#B3263E] pl-4">
                Tvůj profil ukazuje skvělý potenciál pro rychlou transformaci. Doporučuji zaměřit se na kombinaci silového tréninku 4× týdně s kalorickým deficitem 15%. Při dodržení plánu lze očekávat viditelné výsledky do 6–8 týdnů.
              </p>

              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Spalování tuku', value: '87%', color: 'text-[#B3263E]' },
                  { label: 'Svalový rozvoj', value: '74%', color: 'text-blue-400' },
                  { label: 'Kondice', value: '61%', color: 'text-green-400' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#1D1D22] rounded-xl p-3 text-center border border-[#2A2A31]">
                    <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                    <p className="text-xs text-[#A1A1AA] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Sample workout */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-3">
                  Ukázka tréninku — Den 1
                </p>
                <div className="flex flex-col gap-2">
                  {[
                    { name: 'Bench press', sets: '4×8', rest: '90s' },
                    { name: 'Tlak s činkami', sets: '3×12', rest: '60s' },
                    { name: 'Kabel přetahy', sets: '3×15', rest: '45s' },
                  ].map((ex) => (
                    <div key={ex.name} className="flex items-center gap-3 p-2.5 bg-[#1D1D22] rounded-xl border border-[#2A2A31] text-sm">
                      <div className="w-5 h-5 rounded bg-[#B3263E]/20 border border-[#B3263E]/30 flex items-center justify-center">
                        <span className="text-[#B3263E] text-xs">✓</span>
                      </div>
                      <span className="text-[#F5F5F5] flex-1">{ex.name}</span>
                      <span className="text-[#A1A1AA] text-xs font-mono">{ex.sets}</span>
                      <span className="text-[#A1A1AA] text-xs">{ex.rest}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Locked premium sections */}
              <div className="flex flex-col gap-2 mb-5">
                {[
                  'Plný 90denní tréninkový plán',
                  'Výživa a personalizovaná makra',
                  'AI Kouč 24/7',
                  'Adaptivní přeplánování',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 py-2 px-3 bg-[#1D1D22]/60 rounded-xl border border-[#2A2A31]">
                    <svg className="w-4 h-4 text-[#B3263E]/60 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-sm text-[#A1A1AA]/50 blur-sm select-none flex-1">{item}</span>
                    <span className="text-xs text-[#B3263E] font-semibold shrink-0">PRO</span>
                  </div>
                ))}
              </div>

              <Link
                href="/register"
                className="block w-full text-center py-3.5 bg-[#B3263E] hover:bg-[#D13A52] text-white font-bold rounded-xl transition-all duration-200 hover:shadow-[0_0_20px_rgba(179,38,62,0.4)]"
              >
                Odemknout PRO →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: FEATURE CARDS ────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#151518]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Vše, co potřebuješ
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Komplexní nástroje pro tvou transformaci na jednom místě
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: 'Personalizovaný tréninkový plán',
                description: 'Každý plán je unikátní — sestavený přesně pro tvoje tělo, cíl, vybavení a časové možnosti.',
                badge: 'Zdarma',
                badgeClass: 'bg-[#1D1D22] text-[#A1A1AA]',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: 'Výživa a stravovací doporučení',
                description: 'Kompletní výživový plán s recepty přizpůsobený tvým cílům, preferencím a alergím.',
                badge: 'Starter+',
                badgeClass: 'bg-blue-900/40 text-blue-400',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Sledování makroživin',
                description: 'Přesné makronutrienty, kalorické cíle a denní tracking pro maximální a rychlé výsledky.',
                badge: 'Starter+',
                badgeClass: 'bg-blue-900/40 text-blue-400',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                ),
                title: 'Pokrok a srovnání fotek',
                description: 'Vizualizuj svou transformaci v čase. Nahraj fotky a sleduj, jak se tvé tělo mění týden po týdnu.',
                badge: 'PRO',
                badgeClass: 'bg-[#B3263E]/20 text-[#B3263E]',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                ),
                title: 'AI kouč k dispozici',
                description: 'Osobní AI asistent odpovídá na tvé otázky o tréninku a výživě kdykoli — ve dne i v noci.',
                badge: 'PRO',
                badgeClass: 'bg-[#B3263E]/20 text-[#B3263E]',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ),
                title: 'Adaptivní přeplánování',
                description: 'Plán se automaticky přizpůsobuje tvým výsledkům a pokroku — každý týden je optimalizovaný pro tebe.',
                badge: 'PRO',
                badgeClass: 'bg-[#B3263E]/20 text-[#B3263E]',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="scroll-animate bg-[#0B0B0D] border border-[#2A2A31] rounded-2xl p-6 transition-all duration-300 group hover-red-glow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-[#B3263E]/10 border border-[#B3263E]/20 rounded-xl flex items-center justify-center text-[#B3263E]">
                    {feature.icon}
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${feature.badgeClass}`}>
                    {feature.badge}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#F5F5F5] mb-2">{feature.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: WHY IT WORKS ─────────────────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Proč to funguje?
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Personalizace je klíč. Obecné plány selhávají proto, že ignorují individualitu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                number: '1',
                title: 'Personalizace na základě tvého těla',
                text: 'Každý člověk reaguje jinak na trénink a výživu. Shapio vytváří plán pro tvoje specifické tělo, metabolismus, úroveň kondice a cíle — ne pro průměrného uživatele.',
              },
              {
                number: '2',
                title: 'AI se učí z tvojí zpětné vazby',
                text: 'Jak plníš trénink a zaznamenáváš pokrok, AI vyhodnocuje data a upravuje plán. Tvůj program se stává chytřejším každý týden.',
              },
              {
                number: '3',
                title: 'Kombinace tréninku, výživy a konzistencí',
                text: 'Výsledky přichází ze synergii správného tréninku, výživy a konzistentního sledování. Shapio integruje vše na jedno místo pro maximální efekt.',
              },
            ].map((reason, i) => (
              <div
                key={i}
                className="scroll-animate bg-[#151518] border border-[#2A2A31] rounded-2xl p-6 hover:border-[#B3263E]/30 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-[#B3263E]/10 border border-[#B3263E]/20 flex items-center justify-center text-[#B3263E] font-black text-lg mb-4">
                  {reason.number}
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">{reason.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 8: MENTAL TRANSFORMATION ───────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#151518]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Není to jen o těle
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Fitness transformace mění nejen fyzičku — mění způsob, jakým přistupuješ k životu.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: 'Sebedůvěra',
                text: 'Viditelný pokrok v zrcadle a v číslech buduje sebedůvěru, která se přelévá do všech oblastí tvého života — v práci, ve vztazích i v každodenních výzvách.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Disciplína',
                text: 'Pravidelné plnění tréninkového plánu trénuje mentální pevnost a disciplínu. To, co začíná v posilovně, se stává součástí tvého charakteru.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                ),
                title: 'Struktura',
                text: 'Jasný plán tréninku a výživy přináší strukturu do dne. Lidé se strukturou jsou produktivnější, mají méně stresu a lepší spánek.',
              },
            ].map((pillar, i) => (
              <div
                key={i}
                className="scroll-animate bg-[#0B0B0D] border border-[#2A2A31] rounded-2xl p-6 text-center hover:border-[#B3263E]/30 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#B3263E]/10 border border-[#B3263E]/20 rounded-2xl flex items-center justify-center text-[#B3263E] mx-auto mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">{pillar.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 9: TRANSFORMATION STORIES ──────────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Příklady výsledků
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Reálné příběhy transformace
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
                name: 'Jakub',
                age: 28,
                role: 'IT konzultant',
                story: 'Sedavé zaměstnání, málo pohybu. Za 12 týdnů jsem zhubl 9 kg tuku a nabrál viditelné svaly. Plán mi šetřil čas a fungoval kolem mého rozvrhu.',
                result: '−9 kg tuku za 12 týdnů',
              },
              {
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
                name: 'Tereza',
                age: 24,
                role: 'studentka',
                story: 'Chtěla jsem zpevnit tělo, ale neměla jsem čas ani peníze na trenéra. Shapio mi dal přesný plán a AI kouč odpovídal na všechny otázky.',
                result: 'Výrazné zpevnění za 10 týdnů',
              },
              {
                photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
                name: 'Martin',
                age: 35,
                role: 'manažer',
                story: 'Po 5 letech bez pohybu jsem potřeboval návrat. Shapio sestavil plán pro moji úroveň a postupně mě vedl zpět do formy bez přetížení.',
                result: '+7 kg svalů za 20 týdnů',
              },
              {
                photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
                name: 'Klára',
                age: 30,
                role: 'podnikatelka',
                story: 'Chtěla jsem rekompozici těla a více energie. Díky personalizovanému plánu výživy a tréninku jsem dosáhla výsledků, o kterých jsem nevěřila.',
                result: 'Rekompozice za 16 týdnů',
              },
            ].map((story, i) => (
              <div
                key={i}
                className="scroll-animate bg-[#151518] border border-[#2A2A31] rounded-2xl p-5 flex flex-col hover-red-glow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#2A2A31] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={story.photo} alt={story.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[#F5F5F5] text-sm">{story.name}, {story.age}</p>
                    <p className="text-xs text-[#A1A1AA]">{story.role}</p>
                  </div>
                </div>

                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4 flex-1">
                  &ldquo;{story.story}&rdquo;
                </p>

                <div className="px-3 py-2 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-xl text-xs text-[#B3263E] font-semibold text-center">
                  {story.result}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#A1A1AA]/40 mt-6">
            * Ilustrativní příběhy. Výsledky se individuálně liší.
          </p>
        </div>
      </section>

      {/* ── SECTION 10: TRANSFORMATION RESULTS ──────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#151518]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Co čekat za 90 dní
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Ilustrativní přehled typických výsledků uživatelů podle jejich cíle.
            </p>
          </div>

          {/* Two transformation profiles side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Male — fat loss */}
            <div className="scroll-animate rounded-2xl overflow-hidden border border-[#2A2A31] bg-[#0B0B0D]">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2A2A31]">
                <div className="w-9 h-9 rounded-full bg-[#1D1D22] border border-[#2A2A31] flex items-center justify-center text-base">💪</div>
                <div>
                  <p className="text-sm font-bold text-[#F5F5F5]">Jakub, 28 let</p>
                  <p className="text-xs text-[#A1A1AA]">Spalování tuku · IT konzultant</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 bg-[#8B1E2D]/30 border border-[#B3263E]/30 rounded-lg text-[#D13A52] font-semibold">12 týdnů</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="p-5 flex flex-col gap-4">
                {[
                  { label: 'Tělesná hmotnost', before: '94 kg', after: '83 kg', delta: '−11 kg', progress: 78 },
                  { label: 'Obvod pasu', before: '98 cm', after: '87 cm', delta: '−11 cm', progress: 72 },
                  { label: 'Týdenní tréninky', before: '0×', after: '4×', delta: '+4×', progress: 100 },
                  { label: 'Energie (1–10)', before: '4', after: '8', delta: '+4', progress: 80 },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#A1A1AA]">{stat.label}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#A1A1AA]/60 line-through">{stat.before}</span>
                        <span className="font-bold text-[#F5F5F5]">{stat.after}</span>
                        <span className="text-[#D13A52] font-bold">{stat.delta}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1D1D22] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B1E2D] to-[#D13A52] rounded-full"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-1 p-3 bg-[#1D1D22] rounded-xl border border-[#2A2A31]">
                  <p className="text-xs text-[#A1A1AA] italic leading-relaxed">
                    &ldquo;Sedavé zaměstnání, málo pohybu. Za 12 týdnů jsem zhubl 11 kg tuku a nabrál viditelné svaly.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            {/* Female — toning */}
            <div className="scroll-animate rounded-2xl overflow-hidden border border-[#2A2A31] bg-[#0B0B0D]">
              {/* Header */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-[#2A2A31]">
                <div className="w-9 h-9 rounded-full bg-[#1D1D22] border border-[#2A2A31] flex items-center justify-center text-base">🔥</div>
                <div>
                  <p className="text-sm font-bold text-[#F5F5F5]">Tereza, 24 let</p>
                  <p className="text-xs text-[#A1A1AA]">Zpevnění postavy · studentka</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 bg-[#8B1E2D]/30 border border-[#B3263E]/30 rounded-lg text-[#D13A52] font-semibold">10 týdnů</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="p-5 flex flex-col gap-4">
                {[
                  { label: 'Tělesná hmotnost', before: '68 kg', after: '63 kg', delta: '−5 kg', progress: 65 },
                  { label: 'Svalová pevnost', before: 'nízká', after: 'střední+', delta: '+výrazná', progress: 85 },
                  { label: 'Týdenní tréninky', before: '0×', after: '3×', delta: '+3×', progress: 90 },
                  { label: 'Sebedůvěra (1–10)', before: '5', after: '9', delta: '+4', progress: 90 },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-[#A1A1AA]">{stat.label}</span>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#A1A1AA]/60 line-through">{stat.before}</span>
                        <span className="font-bold text-[#F5F5F5]">{stat.after}</span>
                        <span className="text-[#D13A52] font-bold">{stat.delta}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#1D1D22] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#8B1E2D] to-[#D13A52] rounded-full"
                        style={{ width: `${stat.progress}%` }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-1 p-3 bg-[#1D1D22] rounded-xl border border-[#2A2A31]">
                  <p className="text-xs text-[#A1A1AA] italic leading-relaxed">
                    &ldquo;Neměla jsem čas ani peníze na trenéra. Shapio mi dal přesný plán a výsledky jsou vidět.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-[#A1A1AA]/40 mt-8">
            * Ilustrativní příklady výsledků. Výsledky se individuálně liší. Shapio není zdravotnický prostředek.
          </p>
        </div>
      </section>

      {/* ── SECTION 11: TESTIMONIALS / REVIEW CARDS ─────────────────────────── */}
      <section className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14 scroll-animate">
            <h2 className="text-3xl sm:text-4xl font-black text-[#F5F5F5] mb-4">
              Co říkají uživatelé
            </h2>
            <p className="text-[#A1A1AA] text-lg max-w-xl mx-auto">
              Přidej se k tisícům spokojených uživatelů
            </p>
          </div>

          {/* Horizontal scroll on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible">
            {[
              {
                initials: 'MK',
                name: 'Martin K.',
                city: 'Praha',
                stars: 5,
                review: 'Za 3 měsíce jsem shodil 12 kg. Plán byl přesně na míru a AI kouč odpovídal na všechny dotazy. Žádná jiná aplikace tohle nedokáže.',
                goal: 'Spalování tuku',
              },
              {
                initials: 'TH',
                name: 'Tomáš H.',
                city: 'Brno',
                stars: 5,
                review: 'AI kouč je parádní. Plán se přizpůsobil, když jsem si poranil koleno. Nemusel jsem přestávat, jen upravit tréninky. Výsledky jsou vidět.',
                goal: 'Nabírání svalů',
              },
              {
                initials: 'JP',
                name: 'Jana P.',
                city: 'Ostrava',
                stars: 5,
                review: 'Konečně plán, který respektuje moje časové možnosti. 3× týdně 45 minut a po 2 měsících mám pevnější tělo a více energie. Doporučuji.',
                goal: 'Zpevnění postavy',
              },
              {
                initials: 'LN',
                name: 'Lukáš N.',
                city: 'Plzeň',
                stars: 4,
                review: 'Skvělá personalizace. Výživa je detailně propočítaná a recepty jsou praktické. Jediný mínus — chtěl bych více variability ve cvicích.',
                goal: 'Rekompozice těla',
              },
            ].map((review, i) => (
              <div
                key={i}
                className="bg-[#151518] border border-[#2A2A31] rounded-2xl p-5 hover-red-glow shrink-0 w-72 md:w-auto"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg
                      key={j}
                      className={`w-4 h-4 ${j < review.stars ? 'text-yellow-400' : 'text-[#2A2A31]'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">
                  &ldquo;{review.review}&rdquo;
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[#2A2A31]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#B3263E]/20 border border-[#B3263E]/30 flex items-center justify-center text-[#B3263E] text-xs font-bold">
                      {review.initials}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#F5F5F5]">{review.name}</p>
                      <p className="text-xs text-[#A1A1AA]/60">{review.city}</p>
                    </div>
                  </div>
                  <span className="text-xs text-[#A1A1AA]/60 bg-[#1D1D22] px-2 py-1 rounded-lg">
                    {review.goal}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#A1A1AA]/40 mt-4">
            * Ilustrativní recenze. Výsledky se individuálně liší.
          </p>
        </div>
      </section>

      {/* ── SECTION 12: PRICING ─────────────────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 bg-[#151518]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="scroll-animate">
            <PricingSection showTitle={true} />
          </div>
        </div>
      </section>

      {/* ── SECTION 13: FINAL CTA ───────────────────────────────────────────── */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#B3263E]/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center scroll-animate">
          <h2 className="text-4xl sm:text-5xl font-black text-[#F5F5F5] mb-6">
            Začni svou transformaci{' '}
            <span className="bg-gradient-to-r from-[#B3263E] to-[#D13A52] bg-clip-text text-transparent">
              dnes
            </span>
          </h2>
          <p className="text-[#A1A1AA] text-lg mb-10 leading-relaxed">
            Prvních 30 dní zdarma. Žádná kreditní karta potřeba.
            Přidej se a začni svou transformaci ještě dnes.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 bg-[#B3263E] hover:bg-[#D13A52] text-white text-xl font-black rounded-2xl transition-all duration-200 shadow-[0_0_30px_rgba(179,38,62,0.4)] hover:shadow-[0_0_50px_rgba(179,38,62,0.6)] hover:scale-105 active:scale-100 animate-cta-pulse"
          >
            Začít svou transformaci
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <p className="text-sm text-[#A1A1AA]/50 mt-5">
            30 dní zdarma · Bez platební karty · Zrušení kdykoliv
          </p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-[#2A2A31] bg-[#0B0B0D] py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-[#8B1E2D] to-[#D13A52] rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">S</span>
              </div>
              <span className="text-lg font-black text-[#F5F5F5]">Shapio</span>
            </Link>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-[#A1A1AA]">
              <Link href="/#jak-to-funguje" className="hover:text-[#F5F5F5] transition-colors">Jak to funguje</Link>
              <Link href="/#pricing" className="hover:text-[#F5F5F5] transition-colors">Ceník</Link>
              <Link href="/jak-to-funguje" className="hover:text-[#F5F5F5] transition-colors">Průvodce</Link>
              <Link href="/kontakt" className="hover:text-[#F5F5F5] transition-colors">Kontakt</Link>
              <Link href="/podminky-pouziti" className="hover:text-[#F5F5F5] transition-colors">Podmínky</Link>
              <Link href="/ochrana-osobnich-udaju" className="hover:text-[#F5F5F5] transition-colors">Ochrana osobních údajů</Link>
            </nav>
          </div>

          <div className="mt-8 pt-6 border-t border-[#2A2A31] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#A1A1AA]/50">
            <p>© 2025 Shapio. Všechna práva vyhrazena.</p>
            <p>Tato aplikace není zdravotnickým prostředkem. Výsledky se individuálně liší.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

const FILTER_CHIPS = ['Vše', 'Silový trénink', 'Hubnutí', 'Výživa', 'Ženy', 'Online'];

const COACHES = [
  {
    initials: 'MP',
    name: 'Martin P.',
    title: 'Osobní trenér & Nutriční poradce',
    spec: ['Hubnutí', 'Svalový růst'],
    rating: 4.9,
    reviews: 87,
    price: 1200,
    years: 8,
    accentBg: 'bg-cta',
    verified: true,
  },
  {
    initials: 'LN',
    name: 'Lucie N.',
    title: 'Nutriční koučka',
    spec: ['Výživa', 'Ženy', 'Rekompozice'],
    rating: 4.8,
    reviews: 64,
    price: 900,
    years: 5,
    accentBg: 'bg-highlight',
    verified: true,
  },
  {
    initials: 'JK',
    name: 'Jakub K.',
    title: 'Silový & výkonnostní trenér',
    spec: ['Silový trénink', 'Atletika'],
    rating: 4.7,
    reviews: 42,
    price: 1500,
    years: 12,
    accentBg: 'bg-primary',
    verified: true,
  },
];

const HOW_IT_WORKS = [
  { step: '1', icon: '🎯', title: 'Filtr & výběr', desc: 'Nastav specializaci a cíl — ukážeme ti koučy, kteří přesně odpovídají.' },
  { step: '2', icon: '📋', title: 'Kouč vidí tvůj plán', desc: 'Po výběru dostane trenér přístup k tvému AI plánu a pokroku.' },
  { step: '3', icon: '📞', title: 'Rezervace konzultace', desc: 'Online nebo osobní schůzka přímo přes aplikaci — bez zbytečné administrativy.' },
];

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} className={`w-2.5 h-2.5 ${i <= Math.floor(value) ? 'text-yellow-400' : 'text-surface2'}`} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function CoachesPage() {
  const [activeFilter, setActiveFilter] = useState('Vše');

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-cta/4 to-highlight/4 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-black text-text-primary mb-1">Koučové</h1>
          <p className="text-text-secondary text-sm">
            Prověření živí trenéři a nutriční specialisté, kteří vidí tvůj AI plán.
          </p>
          <span className="inline-flex mt-2 px-2 py-0.5 bg-surface2 border border-border rounded-full text-[10px] font-bold text-text-secondary/50 uppercase tracking-wide">
            Marketplace brzy
          </span>
        </div>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
        {FILTER_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveFilter(chip)}
            className={[
              'shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
              activeFilter === chip
                ? 'bg-cta/15 border-cta/30 text-cta'
                : 'bg-surface border-border text-text-secondary hover:border-cta/20',
            ].join(' ')}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Coach cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-gradient-to-b from-cta to-highlight rounded-full" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Ověření koučové
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {COACHES.map((coach) => (
            <div key={coach.initials} className="relative bg-surface border border-border rounded-2xl p-4 opacity-85">
              {/* PRO overlay badge */}
              <div className="absolute top-3 right-3">
                <span className="px-1.5 py-0.5 bg-cta/10 border border-cta/20 rounded text-[9px] font-bold text-cta uppercase">
                  PRO+
                </span>
              </div>

              <div className="flex items-start gap-3.5 pr-14">
                {/* Avatar */}
                <div className={`w-12 h-12 ${coach.accentBg} rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0 shadow-glow-blue`}>
                  {coach.initials}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name + verified */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="font-bold text-sm text-text-primary">{coach.name}</p>
                    {coach.verified && (
                      <svg className="w-3.5 h-3.5 text-cta shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary/70 mb-2">{coach.title}</p>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1 mb-2.5">
                    {coach.spec.map((s) => (
                      <span key={s} className="px-1.5 py-0.5 bg-surface2 border border-border rounded text-[10px] text-text-secondary font-medium">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Rating + price + years */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <StarRating value={coach.rating} />
                      <span className="text-xs font-semibold text-text-primary">{coach.rating}</span>
                      <span className="text-[10px] text-text-secondary/50">({coach.reviews})</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-black text-text-primary">{coach.price.toLocaleString('cs-CZ')} Kč</span>
                      <span className="text-[10px] text-text-secondary/60">/hod</span>
                    </div>
                  </div>
                  <p className="text-[10px] text-text-secondary/40 mt-0.5">{coach.years} let zkušeností</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-secondary/40 text-center mt-3">
          Rezervace konzultací se spustí s PRO a ELITE plány.
        </p>
      </div>

      {/* How it works */}
      <div>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">Jak to funguje</h2>
        <div className="flex flex-col gap-2">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="flex items-start gap-4 bg-surface border border-border rounded-2xl p-4">
              <div className="w-9 h-9 bg-cta/10 border border-cta/20 rounded-xl flex items-center justify-center text-lg shrink-0">
                {step.icon}
              </div>
              <div>
                <span className="text-[10px] font-black text-cta/60 uppercase tracking-wider">Krok {step.step}</span>
                <p className="text-sm font-bold text-text-primary">{step.title}</p>
                <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

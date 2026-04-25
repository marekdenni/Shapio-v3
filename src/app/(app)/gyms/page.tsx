'use client';

import React from 'react';

const GYMS = [
  {
    name: 'FitLife Centrum',
    address: 'Holešovice, Praha 7',
    distance: '1.2 km',
    matchPct: 95,
    equipment: ['Volné váhy', 'Kabely', 'Kardio', 'Sauna'],
    tags: ['Otevřeno 24/7', 'Parkování'],
    rating: 4.8,
    reviews: 124,
  },
  {
    name: 'Iron Club Smíchov',
    address: 'Smíchov, Praha 5',
    distance: '2.8 km',
    matchPct: 87,
    equipment: ['Volné váhy', 'Stroje', 'CrossFit'],
    tags: ['Sprchy', 'Bar'],
    rating: 4.6,
    reviews: 89,
  },
  {
    name: 'Sport City Prague',
    address: 'Žižkov, Praha 3',
    distance: '3.5 km',
    matchPct: 78,
    equipment: ['Kardio', 'Stroje', 'Skupinové lekce'],
    tags: ['Bazén', 'Sauna'],
    rating: 4.4,
    reviews: 203,
  },
];

const HOW_IT_WORKS = [
  { step: '1', icon: '📍', title: 'Sdílíš polohu', desc: 'Jednou, pouze pro doporučení. Nikdy ji neukládáme.' },
  { step: '2', icon: '🤖', title: 'AI porovná vybavení', desc: 'Systém zkontroluje, která fitcentra mají stroje z tvého plánu.' },
  { step: '3', icon: '✅', title: 'Dostaneš shody', desc: 'Seřazené podle vzdálenosti a % shody s tvým tréninkem.' },
];

function MatchBadge({ pct }: { pct: number }) {
  const color = pct >= 90 ? 'text-green-400 bg-green-400/10 border-green-400/20'
    : pct >= 75 ? 'text-cta bg-cta/10 border-cta/20'
    : 'text-text-secondary bg-surface2 border-border';
  return (
    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${color}`}>
      {pct}% shoda
    </span>
  );
}

export default function GymsPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-cta/4 to-highlight/4 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-black text-text-primary mb-1">Posilovny</h1>
          <p className="text-text-secondary text-sm">
            Fitcentra v okolí s vybavením, které tvůj plán skutečně potřebuje.
          </p>
          <span className="inline-flex mt-2 px-2 py-0.5 bg-surface2 border border-border rounded-full text-[10px] font-bold text-text-secondary/50 uppercase tracking-wide">
            Lokace brzy
          </span>
        </div>
      </div>

      {/* Location permission card */}
      <div className="bg-surface border border-border rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-cta/10 border border-cta/20 rounded-xl flex items-center justify-center text-xl shrink-0">
            📍
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text-primary mb-0.5">Povolení polohy</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Abychom mohli najít posilovny v okolí, budeme potřebovat přístup k tvé poloze.
            </p>
          </div>
          <div className="shrink-0 opacity-50 pointer-events-none">
            <div className="px-3 py-1.5 bg-cta text-white text-xs font-bold rounded-xl">
              Sdílet
            </div>
          </div>
        </div>
        <p className="text-[10px] text-text-secondary/40 mt-3 text-center">
          Poloha bude aktivní po spuštění funkce — nyní zobrazujeme ukázková data.
        </p>
      </div>

      {/* Gym cards */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-gradient-to-b from-cta to-highlight rounded-full" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Doporučené v okolí
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {GYMS.map((gym, i) => (
            <div key={gym.name} className="relative bg-surface border border-border rounded-2xl p-4 opacity-80">
              {/* Top right badge */}
              <div className="absolute top-3 right-3">
                <span className="px-1.5 py-0.5 bg-surface2 border border-border/60 rounded text-[9px] font-bold text-text-secondary/40 uppercase">
                  Brzy
                </span>
              </div>

              <div className="pr-10">
                {/* Name + rating */}
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-text-primary">{gym.name}</p>
                      {i === 0 && (
                        <span className="px-1.5 py-0.5 bg-green-400/10 border border-green-400/20 rounded text-[9px] font-bold text-green-400 uppercase">Nejbližší</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-text-secondary/60">{gym.address}</span>
                      <span className="text-[10px] text-text-secondary/40">·</span>
                      <span className="text-xs text-cta font-semibold">{gym.distance}</span>
                    </div>
                  </div>
                </div>

                {/* Match + rating row */}
                <div className="flex items-center gap-2 mb-3">
                  <MatchBadge pct={gym.matchPct} />
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                    <span className="text-xs font-semibold text-text-primary">{gym.rating}</span>
                    <span className="text-[10px] text-text-secondary/50">({gym.reviews})</span>
                  </div>
                </div>

                {/* Equipment badges */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {gym.equipment.map((eq) => (
                    <span key={eq} className="px-2 py-0.5 bg-surface2 border border-border rounded-lg text-[10px] text-text-secondary font-medium">
                      {eq}
                    </span>
                  ))}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {gym.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-cta/8 border border-cta/15 rounded-lg text-[10px] text-cta font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-secondary/40 text-center mt-3">
          Ukázková data — skutečná doporučení se načtou po povolení polohy.
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
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-black text-cta/60 uppercase tracking-wider">Krok {step.step}</span>
                </div>
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

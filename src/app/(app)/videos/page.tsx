'use client';

import React from 'react';

const VIDEO_CATEGORIES = [
  { icon: '🏋️', label: 'Technika cviků', count: 48, duration: '5–15 min' },
  { icon: '🥗', label: 'Výživa', count: 32, duration: '8–20 min' },
  { icon: '🧠', label: 'Mindset', count: 24, duration: '10–25 min' },
  { icon: '💤', label: 'Regenerace', count: 19, duration: '5–12 min' },
  { icon: '🏃', label: 'Kardio & běh', count: 27, duration: '5–30 min' },
  { icon: '🧘', label: 'Mobilita', count: 15, duration: '8–20 min' },
];

const FEATURED_VIDEOS = [
  {
    title: 'Jak správně dřepovat — kompletní průvodce',
    trainer: 'Martin P.',
    trainerInitials: 'MP',
    trainerBg: 'bg-cta',
    duration: '12 min',
    category: 'Technika',
    thumbnail: '🏋️',
    views: '1.2k',
  },
  {
    title: 'Makra za 5 minut: co jíst pro výsledky',
    trainer: 'Lucie N.',
    trainerInitials: 'LN',
    trainerBg: 'bg-highlight',
    duration: '8 min',
    category: 'Výživa',
    thumbnail: '🥗',
    views: '847',
  },
];

const EXPERTS = [
  { initials: 'MP', name: 'Martin P.', role: 'Trenér', count: 18, bg: 'bg-cta' },
  { initials: 'LN', name: 'Lucie N.', role: 'Výživa', count: 12, bg: 'bg-highlight' },
  { initials: 'JK', name: 'Jakub K.', role: 'Síla', count: 9, bg: 'bg-primary' },
];

export default function VideosPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-cta/4 to-highlight/4 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-black text-text-primary mb-1">Videa</h1>
          <p className="text-text-secondary text-sm">
            Krátká expertní videa přesně ke cvikům, výživě a mentalitě z tvého plánu.
          </p>
          <span className="inline-flex mt-2 px-2 py-0.5 bg-surface2 border border-border rounded-full text-[10px] font-bold text-text-secondary/50 uppercase tracking-wide">
            Knihovna brzy
          </span>
        </div>
      </div>

      {/* Category grid */}
      <div>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">Kategorie</h2>
        <div className="grid grid-cols-3 gap-2">
          {VIDEO_CATEGORIES.map((cat) => (
            <div key={cat.label} className="bg-surface border border-border rounded-2xl p-3 opacity-60">
              <div className="text-xl mb-1.5">{cat.icon}</div>
              <p className="text-xs font-bold text-text-primary leading-tight mb-0.5">{cat.label}</p>
              <p className="text-[10px] text-cta font-semibold">{cat.count} videí</p>
              <p className="text-[9px] text-text-secondary/50 mt-0.5">{cat.duration}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured videos */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-gradient-to-b from-cta to-highlight rounded-full" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Doporučené
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {FEATURED_VIDEOS.map((video) => (
            <div key={video.title} className="relative bg-surface border border-border rounded-2xl overflow-hidden opacity-80">
              {/* Thumbnail area */}
              <div className="relative bg-surface2 border-b border-border h-28 flex items-center justify-center">
                <div className="text-5xl">{video.thumbnail}</div>
                {/* Locked overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
                  <div className="w-10 h-10 bg-cta/15 border border-cta/25 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-background/80 border border-border/60 rounded text-[9px] font-bold text-text-secondary">
                  {video.duration}
                </div>
                {/* Category badge */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-cta/10 border border-cta/20 rounded text-[9px] font-bold text-cta uppercase">
                  {video.category}
                </div>
              </div>

              {/* Info */}
              <div className="p-3.5">
                <p className="text-sm font-bold text-text-primary leading-snug mb-2">{video.title}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 ${video.trainerBg} rounded-full flex items-center justify-center text-white text-[9px] font-black shrink-0`}>
                      {video.trainerInitials}
                    </div>
                    <span className="text-xs text-text-secondary">{video.trainer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-3 h-3 text-text-secondary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span className="text-[10px] text-text-secondary/40">{video.views}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-secondary/40 text-center mt-3">
          Přehrávání videí se odemkne po spuštění knihovny.
        </p>
      </div>

      {/* Expert trainers */}
      <div>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">Experti v knihovně</h2>
        <div className="flex flex-col gap-2 opacity-70">
          {EXPERTS.map((expert) => (
            <div key={expert.initials} className="flex items-center gap-3 bg-surface border border-border rounded-2xl p-3.5">
              <div className={`w-10 h-10 ${expert.bg} rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0`}>
                {expert.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-text-primary">{expert.name}</p>
                <p className="text-xs text-text-secondary/60">{expert.role}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-text-primary">{expert.count}</p>
                <p className="text-[10px] text-text-secondary/40">videí</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

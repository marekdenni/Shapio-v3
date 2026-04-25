'use client';

import React from 'react';

const COMMUNITY_STATS = [
  { value: '2 847', label: 'členů', icon: '👥' },
  { value: '384', label: 'transformací', icon: '🔥' },
  { value: '12.4k', label: 'check-inů', icon: '✅' },
];

const TRANSFORMATION_FEED = [
  {
    initials: 'MK',
    name: 'Michal K.',
    goal: 'Hubnutí',
    weeks: 12,
    change: '−8.5 kg',
    text: 'Rok jsem odkládal. Pak jsem zkusil Get Beter a za 3 měsíce jsem na váze, kde jsem chtěl být.',
    achievement: '🏆',
    accentBg: 'bg-cta',
  },
  {
    initials: 'JP',
    name: 'Jana P.',
    goal: 'Svalová hmota',
    weeks: 16,
    change: '+4.2 kg svalů',
    text: 'Plán byl přesně na míru — žádné hádání, co mám dělat. Stačilo se řídit plánem.',
    achievement: '💪',
    accentBg: 'bg-highlight',
  },
  {
    initials: 'TH',
    name: 'Tomáš H.',
    goal: 'Kondice & výdrž',
    weeks: 8,
    change: '5 km za 28 min',
    text: 'Fitness nikdy nebyl můj svět. AI kouč mi pomohl pochopit, co dělám špatně.',
    achievement: '🎯',
    accentBg: 'bg-cta',
  },
];

const DISCUSSIONS = [
  { topic: 'Co funguje při třídenním plató?', replies: 23, hot: true, category: 'Hubnutí' },
  { topic: 'Nejlepší recepty pro svalový růst', replies: 47, hot: true, category: 'Výživa' },
  { topic: 'Jak zůstat konzistentní v zimě', replies: 18, hot: false, category: 'Mindset' },
];

export default function CommunityPage() {
  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-highlight/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-highlight/4 to-cta/4 pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-black text-text-primary mb-1">Komunita</h1>
          <p className="text-text-secondary text-sm">
            Transformace je snazší, když nejsi sám. Lidé, kteří chápou tvoji cestu.
          </p>
          <span className="inline-flex mt-2 px-2 py-0.5 bg-surface2 border border-border rounded-full text-[10px] font-bold text-text-secondary/50 uppercase tracking-wide">
            Komunita brzy
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {COMMUNITY_STATS.map((stat) => (
          <div key={stat.label} className="bg-surface border border-border rounded-2xl p-3.5 text-center">
            <div className="text-xl mb-1">{stat.icon}</div>
            <p className="text-lg font-black text-text-primary leading-none">{stat.value}</p>
            <p className="text-[10px] text-text-secondary/60 mt-0.5 font-medium uppercase tracking-wide">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Transformation feed */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-gradient-to-b from-highlight to-cta rounded-full" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Transformace komunity
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {TRANSFORMATION_FEED.map((item) => (
            <div key={item.initials} className="relative bg-surface border border-border rounded-2xl p-4 opacity-85">
              <div className="absolute top-3 right-3">
                <span className="px-1.5 py-0.5 bg-surface2 border border-border/60 rounded text-[9px] font-bold text-text-secondary/40 uppercase">
                  Brzy
                </span>
              </div>
              <div className="flex items-start gap-3.5 pr-10">
                {/* Avatar */}
                <div className={`w-10 h-10 ${item.accentBg} rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0`}>
                  {item.initials}
                </div>
                <div className="flex-1 min-w-0">
                  {/* Name + achievement */}
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <p className="text-sm font-bold text-text-primary">{item.name}</p>
                    <span>{item.achievement}</span>
                  </div>
                  {/* Goal + change */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] text-text-secondary/60 font-medium">{item.goal}</span>
                    <span className="text-[10px] text-text-secondary/40">·</span>
                    <span className="text-[10px] font-bold text-green-400">{item.change}</span>
                    <span className="text-[10px] text-text-secondary/40">·</span>
                    <span className="text-[10px] text-text-secondary/60">{item.weeks} týdnů</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed italic">„{item.text}"</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discussion topics */}
      <div>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">Diskuse</h2>
        <div className="flex flex-col gap-2">
          {DISCUSSIONS.map((d) => (
            <div key={d.topic} className="flex items-center gap-3 bg-surface border border-border rounded-2xl p-3.5 opacity-75">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="px-1.5 py-0.5 bg-surface2 border border-border rounded text-[9px] font-bold text-text-secondary/50 uppercase">{d.category}</span>
                  {d.hot && (
                    <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[9px] font-bold text-orange-400 uppercase">🔥 Aktivní</span>
                  )}
                </div>
                <p className="text-sm font-semibold text-text-primary leading-snug">{d.topic}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-text-secondary">{d.replies}</p>
                <p className="text-[10px] text-text-secondary/40">odpovědí</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accountability partner teaser */}
      <div className="relative overflow-hidden bg-surface border border-highlight/20 rounded-2xl p-5">
        <div className="absolute inset-0 bg-gradient-to-br from-highlight/4 to-transparent pointer-events-none rounded-2xl" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-highlight/10 border border-highlight/20 rounded-xl flex items-center justify-center text-xl shrink-0">
              🤝
            </div>
            <div>
              <p className="text-sm font-bold text-text-primary">Accountability partner</p>
              <p className="text-xs text-text-secondary/60">AI páruje lidi se stejným cílem</p>
            </div>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-3">
            Spárujeme tě s někým, kdo má stejný cíl a úroveň — vzájemná motivace zvyšuje konzistenci o 67 %.
          </p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5">
              {['MK', 'JP', 'TH', 'AL'].map((init, i) => (
                <div key={init} className="w-6 h-6 rounded-full bg-surface2 border border-border flex items-center justify-center text-[8px] font-black text-text-secondary" style={{ zIndex: 4 - i }}>
                  {init}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-text-secondary/50">+2 847 čeká na spuštění</p>
          </div>
        </div>
      </div>

    </div>
  );
}

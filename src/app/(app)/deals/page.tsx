'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const GOAL_SUPPLEMENTS: Record<string, { name: string; tagline: string; icon: string; reason: string }[]> = {
  fat_loss: [
    { name: 'Whey Protein', tagline: 'Zachování svalů při deficitu', icon: '💪', reason: 'Bílkoviny chrání svaly při kalorickém deficitu — klíč pro trvalé výsledky.' },
    { name: 'Kreatin', tagline: 'Síla i při redukci', icon: '⚡', reason: 'Udržuje výkon při nižším příjmu kalorií. Vědecky ověřený základ.' },
    { name: 'Omega-3', tagline: 'Protizánětlivá ochrana', icon: '🐟', reason: 'Snižuje záněty, podporuje spalování tuku a regeneraci.' },
  ],
  muscle_gain: [
    { name: 'Whey Protein', tagline: 'Okamžité doplnění bílkovin', icon: '💪', reason: 'Rychlá absorpce po tréninku — základ každého svalového protokolu.' },
    { name: 'Kreatin', tagline: 'Více síly = více svalů', icon: '⚡', reason: 'Nejlépe zkoumaný supplement pro nárůst síly a svalové hmoty.' },
    { name: 'Mass Gainer', tagline: 'Kalorický přebytek snadno', icon: '🏋️', reason: 'Pomáhá dosáhnout kalorického přebytku pro budování svalů.' },
  ],
  recomposition: [
    { name: 'Whey Protein', tagline: 'Proteiny pro rekompozici', icon: '💪', reason: 'Vysoký příjem bílkovin je základ při současné redukci a budování.' },
    { name: 'Kreatin', tagline: 'Výkon při rekompozici', icon: '⚡', reason: 'Udržuje sílu při deficitu — zásadní pro udržení svalové hmoty.' },
    { name: 'Multivitamin', tagline: 'Základ mikroživin', icon: '🌿', reason: 'Pokrývá mezery při restriktivnějším příjmu potravy.' },
  ],
  improve_appearance: [
    { name: 'Kolagen', tagline: 'Pleť, klouby, vzhled', icon: '✨', reason: 'Zlepšuje kvalitu pleti a pojivových tkání — viditelný efekt za 8–12 týdnů.' },
    { name: 'Whey Protein', tagline: 'Základ každé transformace', icon: '💪', reason: 'Bílkoviny jsou základem estetické transformace.' },
    { name: 'Omega-3', tagline: 'Zdravá pleť zevnitř', icon: '🐟', reason: 'Omega-3 mastné kyseliny zlepšují hydrataci a elasticitu pleti.' },
  ],
  improve_discipline: [
    { name: 'Ashwagandha', tagline: 'Stres a kortizol pod kontrolou', icon: '🌿', reason: 'Adaptogen snižující stres — základ pro budování dlouhodobých návyků.' },
    { name: 'Vitamin D3+K2', tagline: 'Energie a motivace', icon: '☀️', reason: '80 % lidí má deficit D3 — přímý vliv na energii a mood.' },
    { name: 'Hořčík', tagline: 'Spánek a regenerace', icon: '💤', reason: 'Lepší spánek = lepší konzistence. Hořčík je základ večerní rutiny.' },
  ],
  general_fitness: [
    { name: 'Whey Protein', tagline: 'Základ každého plánu', icon: '💪', reason: 'Nejprodávanější supplement s nejlepším poměrem cena/výkon.' },
    { name: 'Kreatin', tagline: 'Síla a výkon', icon: '⚡', reason: 'Vědecky ověřený — pro každý typ tréninku a cíle.' },
    { name: 'Vitamin D3+K2', tagline: 'Imunita a regenerace', icon: '☀️', reason: '80 % populace má deficit — vliv na hormonální rovnováhu a kosti.' },
  ],
};

const CATEGORIES = [
  { icon: '🥛', label: 'Proteiny', count: '24+' },
  { icon: '⚡', label: 'Kreatin & Pre-workout', count: '18+' },
  { icon: '🌿', label: 'Vitamíny & minerály', count: '32+' },
  { icon: '🔥', label: 'Spalovače', count: '11+' },
  { icon: '🏋️', label: 'Náhražky jídla', count: '9+' },
  { icon: '💤', label: 'Spánek & regenerace', count: '7+' },
];

const PARTNERS = [
  { name: 'GymBeam', tagline: 'Největší výběr suplementů v ČR' },
  { name: 'MyProtein', tagline: 'Prémiové proteiny za dobrou cenu' },
  { name: 'Rohlik.cz', tagline: 'Zdravé potraviny s expresní dopravou' },
  { name: 'Decathlon', tagline: 'Vybavení pro domácí i gym trénink' },
];

export default function DealsPage() {
  const { profile } = useAuth();
  const goal = profile?.goal ?? 'general_fitness';
  const supplements = GOAL_SUPPLEMENTS[goal] ?? GOAL_SUPPLEMENTS.general_fitness;

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="relative overflow-hidden bg-surface border border-border rounded-2xl p-5">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cta/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-cta/4 to-highlight/4 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1.5">
            <h1 className="text-2xl font-black text-text-primary">Nabídky & Suplementy</h1>
          </div>
          <p className="text-text-secondary text-sm">
            AI doporučí produkty přesně pro tvůj cíl — žádné zbytečné reklamy, jen co dává smysl.
          </p>
          <span className="inline-flex mt-2 px-2 py-0.5 bg-surface2 border border-border rounded-full text-[10px] font-bold text-text-secondary/50 uppercase tracking-wide">
            Partnerství brzy
          </span>
        </div>
      </div>

      {/* Goal-mapped recommendations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-4 bg-gradient-to-b from-cta to-highlight rounded-full" />
          <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide">
            Doporučeno pro tvůj cíl
          </h2>
        </div>
        <div className="flex flex-col gap-2.5">
          {supplements.map((s, i) => (
            <div key={s.name} className="relative bg-surface border border-border rounded-2xl p-4">
              <div className="absolute top-3 right-3">
                <span className="px-1.5 py-0.5 bg-surface2 border border-border/60 rounded text-[9px] font-bold text-text-secondary/40 uppercase">
                  Brzy
                </span>
              </div>
              <div className="flex items-start gap-3.5 pr-10">
                <div className="w-11 h-11 bg-surface2 border border-border rounded-xl flex items-center justify-center text-xl shrink-0">
                  {s.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm text-text-primary">{s.name}</p>
                    {i === 0 && (
                      <span className="px-1.5 py-0.5 bg-cta/15 border border-cta/25 rounded text-[9px] font-bold text-cta uppercase">#1</span>
                    )}
                  </div>
                  <p className="text-xs text-cta/80 font-semibold mb-1">{s.tagline}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{s.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-text-secondary/40 text-center mt-3">
          AI doporučení se spustí po aktivaci partnerství s dodavateli.
        </p>
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">Kategorie</h2>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.label} className="bg-surface border border-border rounded-2xl p-3 opacity-55">
              <span className="text-xl">{cat.icon}</span>
              <p className="text-xs font-semibold text-text-primary mt-2 leading-tight">{cat.label}</p>
              <p className="text-[10px] text-text-secondary/60 mt-0.5">{cat.count} produktů</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partners */}
      <div>
        <h2 className="text-sm font-bold text-text-primary uppercase tracking-wide mb-3">Partneři platformy</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {PARTNERS.map((p) => (
            <div key={p.name} className="bg-surface border border-border rounded-2xl p-4 opacity-50">
              <div className="flex items-center justify-between mb-1">
                <p className="font-bold text-sm text-text-primary">{p.name}</p>
                <span className="text-[9px] font-bold text-text-secondary/40 uppercase">Brzy</span>
              </div>
              <p className="text-xs text-text-secondary">{p.tagline}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notify CTA */}
      <div className="relative overflow-hidden bg-surface border border-cta/20 rounded-2xl p-5 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-cta/4 to-transparent pointer-events-none rounded-2xl" />
        <div className="relative">
          <p className="text-sm font-bold text-text-primary mb-1">Chceš být první?</p>
          <p className="text-xs text-text-secondary mb-4 leading-relaxed">
            Dáme ti vědět, jakmile spustíme partnerské nabídky a supplement doporučení.
          </p>
          <Link
            href="/settings"
            className="inline-flex px-4 py-2 bg-cta/10 border border-cta/25 text-cta text-sm font-semibold rounded-xl hover:bg-cta/20 transition-all"
          >
            Nastavit notifikace →
          </Link>
        </div>
      </div>

    </div>
  );
}

// Paywall page - full pricing with benefits
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PricingSection } from '@/components/paywall/PricingSection';
import { PAYWALL } from '@/constants/copy';

export default function PaywallPage() {
  const benefits = [
    { icon: '🎯', title: 'Plán přesně pro tebe', desc: 'AI vytvoří plán podle tvého těla, cíle a vybavení' },
    { icon: '🤖', title: 'AI Kouč 24/7', desc: 'Zeptej se na cokoliv o tréninku a výživě' },
    { icon: '⚡', title: 'Adaptivní trénink', desc: 'Plán se přizpůsobuje tvému pokroku každý týden' },
    { icon: '📊', title: 'Detailní výživa', desc: 'Přesná makra a kalorické cíle pro tvůj cíl' },
    { icon: '📸', title: 'Porovnání fotek', desc: 'Vizualizuj svou transformaci v čase' },
    { icon: '📈', title: 'Pokročilá analýza', desc: 'Sleduj trendy a optimalizuj svůj pokrok' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-black text-text-primary mb-4">
            {PAYWALL.title}
          </h1>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            {PAYWALL.subtitle}
          </p>
        </div>

        {/* Benefits grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-16">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-surface border border-border rounded-2xl p-4 hover:border-cta/30 transition-colors"
            >
              <span className="text-2xl">{benefit.icon}</span>
              <h3 className="font-semibold text-text-primary text-sm mt-2 mb-1">{benefit.title}</h3>
              <p className="text-xs text-text-secondary leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Pricing section */}
        <PricingSection showTitle={false} />

        {/* Guarantees */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-green-900/30 border border-green-700/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary">14denní garance</p>
            <p className="text-xs text-text-secondary">Vrácení peněz bez otázek</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/30 border border-blue-700/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary">Zabezpečená platba</p>
            <p className="text-xs text-text-secondary">Šifrovaná platba přes Stripe</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-cta/20 border border-cta/40 flex items-center justify-center">
              <svg className="w-6 h-6 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-text-primary">Bez závazků</p>
            <p className="text-xs text-text-secondary">Zruš kdykoliv z nastavení</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

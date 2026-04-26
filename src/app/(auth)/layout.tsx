import React from 'react';
import Link from 'next/link';

// Auth layout — centered card with getbeter logo on dark background
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-cta/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* getbeter logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 relative z-10 group">
        <div className="w-10 h-10 bg-gradient-cta rounded-xl flex items-center justify-center shadow-glow-blue group-hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all duration-200">
          <span className="text-white font-black text-lg">G</span>
        </div>
        <span className="text-2xl font-black text-text-primary tracking-tight group-hover:text-white transition-colors">
          Get Beter
        </span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-surface border border-border rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {children}
        </div>
      </div>

      {/* Footer links */}
      <p className="mt-6 text-xs text-text-secondary/60 relative z-10 flex items-center gap-2">
        <Link href="/ochrana-osobnich-udaju" className="hover:text-text-secondary transition-colors">
          Ochrana osobních údajů
        </Link>
        <span>·</span>
        <Link href="/podminky-pouziti" className="hover:text-text-secondary transition-colors">
          Podmínky
        </Link>
        <span>·</span>
        <Link href="/kontakt" className="hover:text-text-secondary transition-colors">
          Kontakt
        </Link>
      </p>
    </div>
  );
}

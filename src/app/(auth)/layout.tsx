import React from 'react';
import Link from 'next/link';

// Auth layout — centered card with Shapio logo on dark background
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0B0B0D] flex flex-col items-center justify-center p-4">
      {/* Background gradient effect */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#B3263E]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#8B1E2D]/5 rounded-full blur-3xl" />
      </div>

      {/* Shapio logo */}
      <Link href="/" className="flex items-center gap-2.5 mb-8 relative z-10 group">
        <div className="w-10 h-10 bg-gradient-to-br from-[#8B1E2D] via-[#B3263E] to-[#D13A52] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(179,38,62,0.3)] group-hover:shadow-[0_0_30px_rgba(179,38,62,0.5)] transition-all duration-200">
          <span className="text-white font-black text-lg">S</span>
        </div>
        <span className="text-2xl font-black text-[#F5F5F5] tracking-tight group-hover:text-white transition-colors">
          Shapio
        </span>
      </Link>

      {/* Auth card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-[#151518] border border-[#2A2A31] rounded-3xl p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
          {children}
        </div>
      </div>

      {/* Footer links */}
      <p className="mt-6 text-xs text-[#A1A1AA]/60 relative z-10 flex items-center gap-2">
        <Link href="/ochrana-osobnich-udaju" className="hover:text-[#A1A1AA] transition-colors">
          Ochrana osobních údajů
        </Link>
        <span>·</span>
        <Link href="/podminky-pouziti" className="hover:text-[#A1A1AA] transition-colors">
          Podmínky
        </Link>
        <span>·</span>
        <Link href="/kontakt" className="hover:text-[#A1A1AA] transition-colors">
          Kontakt
        </Link>
      </p>
    </div>
  );
}

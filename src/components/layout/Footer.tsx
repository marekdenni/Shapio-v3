'use client';

// Site footer component
import React from 'react';
import Link from 'next/link';
import { FOOTER, DISCLAIMER } from '@/constants/copy';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-cta rounded-lg flex items-center justify-center shadow-glow-red">
                <span className="text-white font-black text-xs">S</span>
              </div>
              <span className="text-lg font-black text-text-primary tracking-tight">Shapio</span>
            </div>
            <p className="text-sm text-text-secondary max-w-xs">{FOOTER.tagline}</p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border mt-8 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-xs text-text-secondary/60">
              {FOOTER.copyright(currentYear)}
            </p>
            <p className="text-xs text-text-secondary/50 max-w-md text-left sm:text-right">
              {FOOTER.disclaimer}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

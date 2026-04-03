import React from 'react';
import Link from 'next/link';

// Privacy Policy page — Ochrana osobních údajů (GDPR compliant structure)
export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      {/* Header */}
      <header className="border-b border-[#2A2A31] bg-[#151518]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#8B1E2D] to-[#D13A52] rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">S</span>
            </div>
            <span className="text-lg font-black text-[#F5F5F5]">Shapio</span>
          </Link>
          <Link href="/" className="text-sm text-[#A1A1AA] hover:text-[#F5F5F5] transition-colors">
            ← Zpět
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-[#F5F5F5] mb-3">Ochrana osobních údajů</h1>
          <p className="text-sm text-[#A1A1AA]">Poslední aktualizace: 1. března 2025</p>
        </div>

        <div className="flex flex-col gap-8 text-[#A1A1AA] text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">1. Správce osobních údajů</h2>
            <p>
              Správcem osobních údajů je provozovatel aplikace Shapio. Kontaktní e-mail:{' '}
              <a href="mailto:jedlicekm@gmail.com" className="text-[#B3263E] hover:text-[#D13A52]">
                jedlicekm@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">2. Jaké osobní údaje sbíráme</h2>
            <ul className="flex flex-col gap-2">
              {[
                'Identifikační údaje: jméno, e-mailová adresa',
                'Profilové údaje: věk, pohlaví, výška, váha, fitness cíle, úroveň kondice',
                'Fotografie: profilové fotky a fotky pokroku (nahrány dobrovolně)',
                'Technické údaje: IP adresa, typ zařízení, prohlížeč, logy přístupu',
                'Platební údaje: zpracovávány výhradně přes Stripe (neumisťujeme ani neukládáme čísla karet)',
                'Komunikační data: zprávy s AI koučem',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B3263E] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">3. K čemu osobní údaje používáme</h2>
            <ul className="flex flex-col gap-2">
              {[
                'Poskytování a personalizace služby Shapio',
                'Generování tréninkových a výživových plánů pomocí AI',
                'Komunikace s uživatelem (transakční e-maily, podpora)',
                'Zpracování plateb předplatného',
                'Zlepšování a vývoj aplikace (anonymizovaně)',
                'Plnění zákonných povinností',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B3263E] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">4. Uchovávání dat</h2>
            <p>
              Osobní údaje uchováváme po dobu trvání uživatelského účtu a dále po dobu nezbytnou pro splnění zákonných povinností (typicky 3–5 let pro účetní záznamy). Po zrušení účtu jsou osobní údaje smazány nebo anonymizovány do 30 dnů, s výjimkou údajů vyžadovaných zákonem.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">5. Vaše práva (GDPR)</h2>
            <p className="mb-3">Jako uživatel máte následující práva:</p>
            <ul className="flex flex-col gap-2">
              {[
                'Právo na přístup k osobním údajům — kdykoli si můžete zobrazit uložené údaje',
                'Právo na opravu — oprava nepřesných nebo neúplných údajů',
                'Právo na výmaz (právo být zapomenut) — smazání účtu a všech dat',
                'Právo na omezení zpracování',
                'Právo na přenositelnost dat — export dat v strojově čitelném formátu',
                'Právo vznést námitku proti zpracování',
                'Právo podat stížnost u dozorového úřadu (ÚOOÚ)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B3263E] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Pro uplatnění práv kontaktujte:{' '}
              <a href="mailto:jedlicekm@gmail.com" className="text-[#B3263E] hover:text-[#D13A52]">
                jedlicekm@gmail.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">6. Fotografie</h2>
            <p>
              Fotografie nahrané do Shapio (profilové fotky, fotky pokroku) jsou:
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {[
                'Šifrovaně uloženy na serverech Supabase (EU datacentra)',
                'Přístupné pouze vám — žádný jiný uživatel ani třetí strana k nim nemá přístup',
                'Nepoužívány pro trénování AI modelů',
                'Smazány do 30 dnů po zrušení účtu na požádání',
                'Volitelné — nahrání fotek je dobrovolné',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B3263E] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">7. Sdílení s třetími stranami</h2>
            <p className="mb-3">Osobní údaje nesdílíme s třetími stranami za účelem marketingu. Spolupracujeme s následujícími poskytovateli:</p>
            <div className="flex flex-col gap-3">
              {[
                { name: 'Supabase', purpose: 'Ukládání dat a autentizace (EU servery)' },
                { name: 'Stripe', purpose: 'Zpracování plateb (PCI DSS compliant)' },
                { name: 'OpenAI', purpose: 'AI generování plánů a AI kouč' },
                { name: 'Vercel', purpose: 'Hosting aplikace (EU region)' },
              ].map((provider) => (
                <div key={provider.name} className="flex gap-3 p-3 bg-[#151518] rounded-xl border border-[#2A2A31]">
                  <span className="font-semibold text-[#F5F5F5] w-20 shrink-0">{provider.name}</span>
                  <span>{provider.purpose}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">8. Cookies</h2>
            <p>
              Používáme pouze nezbytné technické cookies pro fungování aplikace (autentizační session). Analytické ani reklamní cookies nepoužíváme.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">9. Kontakt</h2>
            <p>
              Pro otázky ohledně ochrany osobních údajů nás kontaktujte:{' '}
              <a href="mailto:jedlicekm@gmail.com" className="text-[#B3263E] hover:text-[#D13A52]">
                jedlicekm@gmail.com
              </a>
              <br />
              Odpovídáme do 5 pracovních dnů.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-[#2A2A31] flex gap-4 text-sm text-[#A1A1AA]">
          <Link href="/podminky-pouziti" className="hover:text-[#F5F5F5] transition-colors">
            Podmínky použití
          </Link>
          <Link href="/kontakt" className="hover:text-[#F5F5F5] transition-colors">
            Kontakt
          </Link>
          <Link href="/" className="hover:text-[#F5F5F5] transition-colors">
            Domů
          </Link>
        </div>
      </main>
    </div>
  );
}

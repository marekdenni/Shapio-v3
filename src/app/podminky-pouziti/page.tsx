import React from 'react';
import Link from 'next/link';

// Terms of Service page — Podmínky použití
export default function TermsOfServicePage() {
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
          <h1 className="text-3xl font-black text-[#F5F5F5] mb-3">Podmínky použití</h1>
          <p className="text-sm text-[#A1A1AA]">Poslední aktualizace: 1. března 2025</p>
        </div>

        {/* Important disclaimer banner */}
        <div className="mb-8 p-4 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-xl text-sm text-[#A1A1AA]">
          <strong className="text-[#F5F5F5]">Důležité upozornění:</strong> Shapio není zdravotnickým prostředkem. Obsah aplikace má pouze informační charakter a nepředstavuje lékařskou radu. Před zahájením nového fitness programu konzultujte svého lékaře.
        </div>

        <div className="flex flex-col gap-8 text-[#A1A1AA] text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">1. Úvod</h2>
            <p>
              Tyto podmínky použití upravují vztah mezi uživatelem a provozovatelem aplikace Shapio. Používáním aplikace souhlasíte s těmito podmínkami. Pokud nesouhlasíte, aplikaci nepoužívejte.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">2. Popis služby</h2>
            <p className="mb-3">
              Shapio je webová aplikace poskytující personalizované fitness a wellness plány generované pomocí umělé inteligence. Služba zahrnuje:
            </p>
            <ul className="flex flex-col gap-2">
              {[
                'AI-generované tréninkové plány',
                'Výživová a stravovací doporučení',
                'Sledování pokroku a fotografií',
                'AI asistent (kouč) pro otázky o tréninku a výživě',
                'Uživatelský profil a správu předplatného',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B3263E] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">3. Uživatelský účet</h2>
            <ul className="flex flex-col gap-2">
              {[
                'Pro používání aplikace musíte být starší 16 let',
                'Jste zodpovědní za bezpečnost svého hesla a účtu',
                'Jeden uživatel = jeden účet; sdílení účtu není povoleno',
                'Poskytnuté informace musí být pravdivé a aktuální',
                'Shapio si vyhrazuje právo smazat účet porušující podmínky',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B3263E] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">4. Předplatné a platby</h2>
            <ul className="flex flex-col gap-2">
              {[
                'Základní funkce jsou zdarma po prvních 30 dní',
                'Prémiové plány (Starter, Pro, Elite) jsou měsíčně opakující se předplatné',
                'Platby jsou zpracovávány přes Stripe — Shapio neuchovává platební údaje',
                'Předplatné se automaticky obnovuje, pokud není zrušeno',
                'Zrušení je možné kdykoliv z nastavení účtu, bez sankcí',
                'Nabízíme 14denní garanci vrácení peněz pro první předplatné',
                'Ceny jsou uváděny v českých korunách včetně DPH',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-[#B3263E] shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">5. Omezení odpovědnosti</h2>
            <div className="p-4 bg-[#151518] border border-[#2A2A31] rounded-xl space-y-3">
              <p>
                <strong className="text-[#F5F5F5]">Shapio není zdravotnickým prostředkem</strong> a neposkytuje lékařské rady, diagnózy ani léčbu. Veškerý obsah má pouze informační a vzdělávací charakter.
              </p>
              <p>
                Shapio nenese odpovědnost za zranění, zdravotní komplikace ani jiné škody vzniklé v důsledku používání aplikace nebo sledování doporučení.
              </p>
              <p>
                Výsledky se individuálně liší v závislosti na věku, pohlaví, výchozím stavu, dodržování plánu a dalších faktorech. Shapio nezaručuje konkrétní výsledky.
              </p>
              <p>
                Před zahájením fitness nebo výživového programu, zejména při zdravotních omezeních nebo zraněních, vždy konzultujte lékaře.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">6. Obsah vytvořený uživatelem</h2>
            <p>
              Nahráváním fotek a jiného obsahu do Shapio udělujete provozovateli licenci k uložení, zobrazení a zpracování tohoto obsahu výhradně za účelem poskytování služby. Obsah nesmí být nelegální, urážlivý nebo porušovat práva třetích stran.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">7. Fotografie</h2>
            <p>
              Nahráváním fotografií souhlasíte s jejich zpracováním za účelem personalizace plánu a sledování pokroku. Fotky jsou přístupné pouze vám a nikdy sdíleny s třetími stranami. Souhlas lze odvolat smazáním fotek nebo účtu.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">8. Zrušení účtu</h2>
            <p>
              Účet lze zrušit kdykoliv z nastavení aplikace. Po zrušení jsou data smazána do 30 dnů, s výjimkou údajů vyžadovaných zákonem. Aktivní předplatné musí být nejprve zrušeno v nastavení.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">9. Změny podmínek</h2>
            <p>
              Shapio si vyhrazuje právo tyto podmínky měnit. O podstatných změnách budete informováni e-mailem nebo oznámením v aplikaci. Pokračující používání aplikace po oznámení změn představuje souhlas s novými podmínkami.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-[#F5F5F5] mb-3">10. Kontakt</h2>
            <p>
              Pro dotazy ohledně podmínek použití:{' '}
              <a href="mailto:jedlicekm@gmail.com" className="text-[#B3263E] hover:text-[#D13A52]">
                jedlicekm@gmail.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-[#2A2A31] flex gap-4 text-sm text-[#A1A1AA]">
          <Link href="/ochrana-osobnich-udaju" className="hover:text-[#F5F5F5] transition-colors">
            Ochrana osobních údajů
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

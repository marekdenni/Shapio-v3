import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';

// "Jak to funguje?" — comprehensive How It Works page
export default function JakToFungujePage() {
  return (
    <div className="min-h-screen bg-[#0B0B0D]">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#B3263E]/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-full text-sm text-[#D13A52] mb-6">
            <span className="w-2 h-2 rounded-full bg-[#B3263E]" />
            Průvodce aplikací
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#F5F5F5] mb-6 leading-tight">
            Jak Shapio funguje?
          </h1>
          <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto mb-8 leading-relaxed">
            Od registrace po první viditelné výsledky — kompletní průvodce procesem personalizované transformace pomocí AI.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#B3263E] hover:bg-[#D13A52] text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-[0_0_25px_rgba(179,38,62,0.4)]"
          >
            Začít zdarma →
          </Link>
        </div>
      </section>

      {/* ── 5-STEP PROCESS ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#151518]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#F5F5F5] mb-4">Celý proces krok za krokem</h2>
            <p className="text-[#A1A1AA]">Od registrace po transformaci — tady je vše, co tě čeká</p>
          </div>

          <div className="flex flex-col gap-8">
            {[
              {
                step: 1,
                title: 'Registrace — 30 sekund',
                duration: '30 sekund',
                description: 'Vytvoř si bezplatný účet pomocí e-mailu nebo Google. Žádná platební karta. Žádné závazky. Shapio je zdarma po prvních 30 dní.',
                details: [
                  'Zadej e-mail a heslo, nebo se přihlas přes Google',
                  'Potvrď e-mail (příde za pár sekund)',
                  'Přejdi rovnou na nastavení profilu',
                ],
                image: null,
              },
              {
                step: 2,
                title: 'Nahrání fotky',
                duration: '1 minuta',
                description: 'Nahraj výchozí fotku — selfie nebo celou postavu. Tato fotka slouží jako výchozí bod pro sledování tvé transformace a pomáhá AI lépe personalizovat plán.',
                details: [
                  'Stačí jedno selfie v přirozeném světle',
                  'Fotka je šifrovaná a nikdy sdílena s třetími stranami',
                  'Fotky slouží pouze pro tvé vlastní sledování pokroku',
                  'Nahrání fotek je volitelné, ale doporučené',
                ],
                disclaimer: 'Tvé fotky jsou zpracovávány pouze pro účely personalizace a zobrazení pokroku. Nejsou analyzovány AI pro zdravotní diagnózy.',
              },
              {
                step: 3,
                title: 'Dotazník',
                duration: '3-4 minuty',
                description: 'Odpověz na několik klíčových otázek. Každá odpověď přímo ovlivňuje, jak bude tvůj plán vypadat — proto je důležité být upřímný.',
                details: [
                  'Hlavní cíl: spalování tuku, nabírání svalů, rekompozice nebo kondice',
                  'Základní parametry: věk, výška, váha, pohlaví',
                  'Úroveň fyzičky: začátečník, středně pokročilý, pokročilý',
                  'Dostupné vybavení: bez vybavení, domácí posilovna, plná posilovna',
                  'Počet tréninků za týden (1–7)',
                  'Stravovací preference a případné alergie',
                  'Zranění nebo zdravotní omezení',
                ],
                disclaimer: 'Pokud máš závažná zdravotní omezení nebo zranění, doporučujeme konzultaci s lékařem před zahájením programu.',
              },
              {
                step: 4,
                title: 'AI analýza a generování plánu',
                duration: '30–60 sekund',
                description: 'Na základě tvých odpovědí a fotek AI vytvoří kompletní personalizovaný program — tréninkový plán, výživová doporučení a hodnocení tvého profilu.',
                details: [
                  'AI zpracuje tvůj profil a identifikuje klíčové oblasti',
                  'Vygeneruje kompletní tréninkový plán (30–180 dní dle plánu)',
                  'Vytvoří personalizovaný výživový plán s makronutrienty',
                  'Napíše osobní hodnocení a doporučení',
                ],
                disclaimer: 'Shapio využívá AI pro vytváření obecných fitness a výživových doporučení. Nejde o lékařskou péči ani zdravotní diagnózu.',
              },
              {
                step: 5,
                title: 'Trénink, sledování, adaptace',
                duration: 'Průběžně',
                description: 'Plň plán, sleduj pokrok a nech AI kouče průběžně optimalizovat tvůj program. Čím více dat AI dostane, tím přesnější jsou doporučení.',
                details: [
                  'Plň tréninkový plán a označuj splněné cviky',
                  'Sleduj výživa a zaznamenávej jídla',
                  'Fotky pokroku každé 2–4 týdny pro vizualizaci',
                  'AI kouč odpovídá na tvoje otázky 24/7 (PRO/ELITE)',
                  'Plán se adaptuje na základě tvého pokroku (PRO/ELITE)',
                ],
              },
            ].map((step) => (
              <div key={step.step} className="flex gap-6 items-start">
                {/* Step number */}
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-[#B3263E] flex items-center justify-center text-white font-black text-lg shadow-[0_0_20px_rgba(179,38,62,0.3)]">
                    {step.step}
                  </div>
                  {step.step < 5 && (
                    <div className="w-px h-8 bg-[#B3263E]/30 mx-auto mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 bg-[#0B0B0D] border border-[#2A2A31] rounded-2xl p-6">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <h3 className="text-xl font-black text-[#F5F5F5]">{step.title}</h3>
                    <span className="px-3 py-1 bg-[#1D1D22] border border-[#2A2A31] rounded-full text-xs text-[#A1A1AA]">
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-[#A1A1AA] text-sm leading-relaxed mb-4">{step.description}</p>

                  <ul className="flex flex-col gap-2 mb-4">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <svg className="w-4 h-4 text-[#B3263E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-[#A1A1AA]">{detail}</span>
                      </li>
                    ))}
                  </ul>

                  {step.disclaimer && (
                    <div className="flex items-start gap-2 p-3 bg-[#1D1D22] rounded-xl border border-[#2A2A31] text-xs text-[#A1A1AA]/70">
                      <svg className="w-3.5 h-3.5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {step.disclaimer}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASE STUDIES ─────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#F5F5F5] mb-4">Příklady použití</h2>
            <p className="text-[#A1A1AA]">Jak Shapio pomohl různým lidem s různými cíli</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: 'Jakub, 28 — IT konzultant',
                photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
                situation: 'Sedavé zaměstnání, přes 10 hodin denně u počítače. Žádný pravidelný pohyb 3 roky. Cíl: zhubnout 10 kg tuku a začít budovat svaly.',
                challenge: 'Nedostatek času, únava po práci, nevěděl jak začít bez přeplácení za trenéra.',
                solution: 'Shapio sestavil 90denní PRO plán s 4 tréninky týdně po 45 minutách. AI kouč pomohl s výživou a odstranil zábrany.',
                result: '−9 kg tuku, +3 kg svalů za 14 týdnů. Nyní cvičí pravidelně bez aplikace.',
              },
              {
                name: 'Tereza, 24 — studentka',
                photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
                situation: 'Aktivní studentka, málo peněz na trenéra nebo drahé doplňky. Cíl: zpevnit tělo, ne dramaticky zhubnout.',
                challenge: 'Omezený rozpočet, domácí trénink bez vybavení, nejistota co jíst.',
                solution: 'Shapio Starter plán zaměřený na domácí trénink s vlastní vahou. Personalizovaný výživový plán v rámci studentského rozpočtu.',
                result: 'Výrazné zpevnění postavy za 10 týdnů. Pravidelné cvičení 3× týdně.',
              },
              {
                name: 'Martin, 35 — manažer',
                photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80',
                situation: 'Dříve aktivní sportovec, pak 5 let bez pohybu kvůli pracovnímu vytížení. Cíl: návrat do kondice, více energie.',
                challenge: 'Strach z přetížení po dlouhé pauze, svalová nerovnováha, zpomaleláregenerace v 35 letech.',
                solution: 'Shapio Elite plán s postupnou progresí, zaměřený na regeneraci a budování základní kondice. AI kouč navigoval přes svalovou bolest.',
                result: '+7 kg svalů, výrazně lepší kondice a energie za 20 týdnů.',
              },
              {
                name: 'Klára, 30 — podnikatelka',
                photo: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80',
                situation: 'Nepravidelný denní režim, cestování, stravování v restauracích. Cíl: rekompozice těla a více energie.',
                challenge: 'Nepravidelný jídelníček, trénink v různých posilovnách a hotelích, stres z podnikání.',
                solution: 'Shapio PRO plán s flexibilním tréninkem přizpůsobeným různým podmínkám. Výživa optimalizovaná pro restaurační jídlo.',
                result: 'Rekompozice těla za 16 týdnů. Lepší energetická hladina a spánek.',
              },
            ].map((study, i) => (
              <div key={i} className="bg-[#151518] border border-[#2A2A31] rounded-2xl p-6 hover:border-[#B3263E]/30 transition-all duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-[#2A2A31] shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={study.photo} alt={study.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="font-bold text-[#F5F5F5] text-sm">{study.name}</h3>
                </div>

                <div className="flex flex-col gap-3 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1">Výchozí situace</p>
                    <p className="text-[#A1A1AA]">{study.situation}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1">Výzva</p>
                    <p className="text-[#A1A1AA]">{study.challenge}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider mb-1">Řešení Shapio</p>
                    <p className="text-[#A1A1AA]">{study.solution}</p>
                  </div>
                  <div className="pt-3 border-t border-[#2A2A31]">
                    <div className="px-3 py-2 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-xl text-xs text-[#B3263E] font-semibold">
                      Výsledek: {study.result}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#A1A1AA]/40 mt-6">
            * Ilustrativní příběhy. Výsledky se individuálně liší.
          </p>
        </div>
      </section>

      {/* ── NOT JUST BODY ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#151518]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-[#F5F5F5] mb-4">
              Shapio mění více než jen tvoje tělo
            </h2>
            <p className="text-[#A1A1AA] max-w-xl mx-auto">
              Pravidelný fitness program přináší hluboké změny daleko za fyzičkou
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: 'Sebedůvěra',
                text: 'Každý splněný trénink a každý kilogram navíc (nebo méně) buduje sebedůvěru. Viditelné výsledky v zrcadle se projevují jako přirozenější sebeprezentace ve společnosti, větší odvaha v práci a lepší mezilidské vztahy. Sebedůvěra budovaná fyzickými výsledky je trvalá — nezávisí na vnějším hodnocení.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: 'Disciplína',
                text: 'Dodržovat tréninkový plán týden za týdnem je cvičení mentální pevnosti. Lidé, kteří si vybudují disciplínu v posilovně, ji přirozeně přenášejí do práce, studia a osobního života. Disciplína je návyk — a Shapio ti pomáhá ji budovat systematicky.',
              },
              {
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: 'Konzistence',
                text: 'Pravidelný tréninkový a stravovací plán přináší strukturu do tvého dne. Lidé s jasnou rutinou jsou produktivnější, mají méně rozhodovací únavy a lépe zvládají stres. Konzistence v malých věcech vede k velkým výsledkům v čase.',
              },
            ].map((pillar, i) => (
              <div key={i} className="bg-[#0B0B0D] border border-[#2A2A31] rounded-2xl p-6">
                <div className="w-12 h-12 bg-[#B3263E]/10 border border-[#B3263E]/20 rounded-xl flex items-center justify-center text-[#B3263E] mb-4">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-[#F5F5F5] mb-3">{pillar.title}</h3>
                <p className="text-[#A1A1AA] text-sm leading-relaxed">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-[#F5F5F5] mb-4">Časté otázky</h2>
          </div>

          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Jak přesná je AI analýza z fotek?',
                a: 'AI z fotek nevytváří medicínskou diagnózu — slouží jako kontextový doplněk k dotazníkovým datům. Hlavním vstupem pro personalizaci plánu jsou tvoje odpovědi na dotazník (věk, výška, váha, cíl, úroveň kondice atd.). Fotky pomáhají sledovat vizuální pokrok v čase.',
              },
              {
                q: 'Je Shapio vhodný pro ženy?',
                a: 'Absolutně ano. Shapio je navržen pro muže i ženy. Plány jsou přizpůsobeny pohlaví a cílům — jiný přístup pro nabírání svalů u muže a jiný pro zpevnění postavy u ženy. Výživa je taktéž personalizována.',
              },
              {
                q: 'Co když mám zranění?',
                a: 'V dotazníku máš možnost uvést zranění a zdravotní omezení. Plán bude tomu přizpůsoben a riziková cvičení vynechána nebo nahrazena. Pro závažná zdravotní omezení vždy doporučujeme konzultaci s lékařem před zahájením programu.',
              },
              {
                q: 'Jak dlouho trvá než uvidím výsledky?',
                a: 'První viditelné změny (více energie, lepší nálada, mírné zpevnění) přichází obvykle za 2–3 týdny. Viditelné vizuální změny se projevují nejčastěji za 6–8 týdnů při konzistentním plnění plánu. Výsledky se individuálně liší.',
              },
              {
                q: 'Mohu používat Shapio bez posilovny?',
                a: 'Ano. Při registraci vybereš dostupné vybavení — bez vybavení, domácí posilovna nebo plná posilovna. Plán bude sestavený přesně pro tvoje podmínky. Cvičení s vlastní vahou doma může být velmi efektivní.',
              },
              {
                q: 'Jak funguje AI kouč?',
                a: 'AI kouč je chatbot dostupný v PRO a ELITE plánu. Odpovídá na otázky o tréninku, výživě, regeneraci a motivaci. Zná tvůj profil a plán, takže rady jsou personalizované. Denní limit je 10 zpráv (PRO) nebo 50 zpráv (ELITE).',
              },
              {
                q: 'Mohu zrušit předplatné kdykoliv?',
                a: 'Ano, předplatné lze zrušit kdykoliv z nastavení účtu bez nutnosti kontaktovat podporu. Přístup zůstane aktivní do konce zaplacené periody.',
              },
              {
                q: 'Je Shapio zdravotnická aplikace?',
                a: 'Ne. Shapio je aplikace pro obecné fitness a wellness. Obsah a plány mají pouze informační charakter a nepředstavují lékařskou radu, diagnózu ani léčbu. Vždy konzultuj svého lékaře před zahájením nového fitness programu.',
              },
              {
                q: 'Co se stane s mými fotkami?',
                a: 'Tvoje fotky jsou šifrovaně uloženy a přístupné pouze tobě. Nejsou sdíleny s třetími stranami, nepoužívají se pro trénování AI modelů a můžeš je kdykoliv smazat z nastavení.',
              },
              {
                q: 'Jak probíhá adaptace plánu?',
                a: 'V PRO a ELITE plánu AI průběžně vyhodnocuje tvůj pokrok (splněné tréninky, zaznamenané váhy, fotky) a upravuje obtížnost, objem a zaměření tréninků. Adaptace probíhá automaticky každý týden.',
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-[#151518] border border-[#2A2A31] rounded-2xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer text-[#F5F5F5] font-semibold text-sm hover:text-white transition-colors list-none">
                  {item.q}
                  <svg
                    className="w-4 h-4 text-[#A1A1AA] shrink-0 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 pt-1 text-sm text-[#A1A1AA] leading-relaxed border-t border-[#2A2A31] mt-0">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY PERSONALIZATION WORKS ────────────────────────────────────────── */}
      <section className="py-20 bg-[#151518]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-[#F5F5F5] mb-4">
              Proč personalizace funguje lépe než obecné plány
            </h2>
          </div>
          <div className="bg-[#0B0B0D] border border-[#2A2A31] rounded-2xl p-8">
            <p className="text-[#A1A1AA] leading-relaxed mb-4">
              Obecné fitness plány jsou navrženy pro „průměrného uživatele" — ale průměrný uživatel neexistuje. Každý člověk má jiný metabolismus, jiné výchozí podmínky, jiné životní okolnosti a jiné cíle.
            </p>
            <p className="text-[#A1A1AA] leading-relaxed mb-4">
              Výzkumy ukazují, že personalizované tréninkové programy vedou k 2–3× lepším výsledkům než obecné plány ve stejném časovém horizontu. Klíčem je přesné nastavení intenzity, objemu a frekven tréninku pro konkrétního jedince.
            </p>
            <p className="text-[#A1A1AA] leading-relaxed mb-4">
              Shapio kombinuje personalizaci se sledováním pokroku a adaptací — to je přístup, který dříve byl dostupný pouze lidem, kteří si mohli dovolit osobního trenéra. Shapio tuto zkušenost demokratizuje za zlomek ceny.
            </p>
            <div className="mt-6 p-4 bg-[#B3263E]/10 border border-[#B3263E]/30 rounded-xl text-sm text-[#A1A1AA]">
              <strong className="text-[#F5F5F5]">Důležité upozornění:</strong> Shapio poskytuje obecná fitness a wellness doporučení. Není náhradou za lékařskou péči, fyzioterapii ani individuální konzultaci s certifikovaným trenérem. Výsledky se individuálně liší.
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────────── */}
      <section className="py-20 text-center">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-[#F5F5F5] mb-4">Připraven začít?</h2>
          <p className="text-[#A1A1AA] mb-8 leading-relaxed">
            Registrace je zdarma a zabere méně než minutu. Tvůj personalizovaný plán budeš mít hotový do 60 sekund.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#B3263E] hover:bg-[#D13A52] text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-[0_0_25px_rgba(179,38,62,0.4)] hover:scale-105"
          >
            Začít zdarma →
          </Link>
          <p className="text-sm text-[#A1A1AA]/50 mt-4">
            Shapio není zdravotnickým prostředkem. Výsledky se individuálně liší.
          </p>
        </div>
      </section>
    </div>
  );
}

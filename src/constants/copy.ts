// All Czech UI copy strings for the getbeter application

export const HERO = {
  headline: 'Nahraj fotku.\nZísker plán.\nTransformuj se.',
  subheadline:
    'getbeter analyzuje tvé tělo pomocí AI a vytvoří personalizovaný tréninkový a výživový plán šitý na míru. Bez háčků. Bez dohádů.',
  cta: 'Začni zdarma',
  ctaSubtext: 'Bez platební karty • 30 dní zdarma',
  trustLine: 'Více než 12 000 mužů již transformovalo své tělo',
  scrollCta: 'Jak to funguje?',
};

export const HOW_IT_WORKS = {
  title: 'Jak getbeter funguje?',
  subtitle: 'Tři jednoduché kroky k tvé transformaci',
  steps: [
    {
      number: '01',
      title: 'Nahraj fotku',
      description:
        'Stačí jedno selfie. Naše AI analyzuje tvou postavu a výchozí formu. Tvé fotky jsou v bezpečí.',
    },
    {
      number: '02',
      title: 'Získej plán',
      description:
        'AI vytvoří kompletní tréninkový a výživový plán přímo pro tebe – podle tvého cíle, fyzičky a vybavení.',
    },
    {
      number: '03',
      title: 'Transformuj se',
      description:
        'Plň plán, sleduj pokrok a nech AI kouče upravovat trénink, jak se tvé tělo mění.',
    },
  ],
};

export const ONBOARDING = {
  welcomeTitle: 'Vítej v getbeter',
  welcomeSubtitle: 'Za pár minut máš svůj první plán',
  welcomeDescription:
    'Odpověz na několik otázek a my vytvoříme plán přesně podle tebe. Žádné generické cvičení – jen to, co funguje pro tvoje tělo a cíl.',
  welcomeCta: 'Začít',
  stepTitles: [
    'Vítej v getbeter',
    'Přidej svou fotku',
    'Tvůj cíl a základní info',
    'Tvoje fyzička',
    'Tvoje preference',
    'Analyzuji tvůj profil...',
  ],
  photoTitle: 'Přidej výchozí fotku',
  photoSubtitle:
    'Nahrej selfie nebo celou postavu. Pomůže AI lépe přizpůsobit plán.',
  photoConsent:
    'Souhlasím se zpracováním fotografie pro účely personalizace mého plánu. Fotky nejsou sdíleny s třetími stranami.',
  photoSkip: 'Přeskočit (doporučujeme přidat)',
  goalTitle: 'Jaký je tvůj hlavní cíl?',
  goals: {
    fat_loss: { label: 'Shodit tuk', emoji: '🔥', description: 'Zhubnout a zpevnit postavu' },
    muscle_gain: { label: 'Nabrat svaly', emoji: '💪', description: 'Budovat svalovou hmotu' },
    recomposition: { label: 'Remodelace', emoji: '⚡', description: 'Shodit tuk a nabrat svaly' },
    general_fitness: { label: 'Celková kondice', emoji: '🏃', description: 'Zlepšit zdraví a výkon' },
    improve_discipline: { label: 'Zlepšit disciplínu', emoji: '🎯', description: 'Vybudovat zdravé návyky a konzistenci' },
    improve_appearance: { label: 'Zlepšit vzhled', emoji: '✨', description: 'Cítit se lépe ve vlastní kůži' },
  },
  fields: {
    age: 'Věk',
    agePlaceholder: '25',
    ageUnit: 'let',
    sex: 'Pohlaví',
    male: 'Muž',
    female: 'Žena',
    height: 'Výška',
    heightPlaceholder: '180',
    heightUnit: 'cm',
    weight: 'Váha',
    weightPlaceholder: '80',
    weightUnit: 'kg',
    fitnessLevel: 'Úroveň fyzičky',
    beginner: 'Začátečník (0–1 rok tréninku)',
    intermediate: 'Středně pokročilý (1–3 roky)',
    advanced: 'Pokročilý (3+ let)',
    equipment: 'Dostupné vybavení',
    none: 'Bez vybavení',
    home_basic: 'Domácí posilovna (základní)',
    gym_full: 'Plně vybavené posilovně',
    workoutDays: 'Kolik dní v týdnu chceš cvičit?',
    dietaryPreference: 'Stravovací preference',
    no_preference: 'Bez omezení',
    vegetarian: 'Vegetarián',
    vegan: 'Vegan',
    keto: 'Keto',
    low_carb: 'Nízko sacharidová',
    activityLevel: 'Denní aktivita',
    sedentary: 'Sedavý (kancelář, minimum pohybu)',
    lightly_active: 'Lehce aktivní (pravidelná chůze)',
    moderately_active: 'Středně aktivní (sport 2–3×/týden)',
    very_active: 'Velmi aktivní (sport denně nebo fyzická práce)',
    sessionDuration: 'Kolik času máš na trénink?',
    injuries: 'Zranění nebo omezení',
    injuriesPlaceholder: 'Např. bolest kolene, problémy se zády...',
    injuriesHelp: 'Pokud žádná nemáš, nechej prázdné',
    motivation: 'Co tě motivuje?',
    motivationPlaceholder: 'Např. chci vypadat dobře na dovolené, chci mít více energie...',
    frictions: 'Co tě v minulosti brzdilo?',
    frictionsHelp: 'Vyber vše, co platí – přeskočitelné',
    friction_no_time: 'Nedostatek času',
    friction_no_motivation: 'Nedostatek motivace',
    friction_no_energy: 'Nedostatek energie',
    friction_dont_know_what_to_do: 'Nevím, co přesně dělat',
    friction_injury_fear: 'Strach ze zranění',
    friction_past_failures: 'Předchozí neúspěchy',
    friction_social_anxiety: 'Sociální úzkost v posilovně',
    friction_bad_diet_habits: 'Špatné stravovací návyky',
    interests: 'Co tě zajímá? (nepovinné)',
    interestsHelp: 'Pomůže lépe přizpůsobit doporučení',
    interest_ai_coaching: 'AI kouč',
    interest_progress_tracking: 'Sledování pokroku',
    interest_nutrition_planning: 'Plánování výživy',
    interest_community: 'Komunita a podpora',
    interest_challenges: 'Výzvy a challenges',
    interest_team_coaching: 'Týmový trenér nebo coach',
    interest_corporate_wellness: 'Firemní wellness program',
  },
  nextButton: 'Pokračovat',
  prevButton: 'Zpět',
  submitButton: 'Vytvořit můj plán',
};

export const PLAN = {
  title: 'Tvůj tréninkový plán',
  weekLabel: 'Týden',
  dayLabel: 'Den',
  exercises: 'cvičení',
  sets: 'série',
  reps: 'opakování',
  rest: 'pauza',
  restDay: 'Den odpočinku',
  restDayDesc: 'Dopřej tělu zotavení. Je to součást plánu.',
  warmup: 'Rozcvička',
  cooldown: 'Zklidnění',
  lockedWeeks: 'Týdny 3–13 jsou dostupné v placeném plánu',
  lockedCta: 'Odemknout celý plán',
  duration: 'minut',
};

export const PAYWALL = {
  title: 'Odemkni svůj potenciál',
  subtitle: 'Vyber plán, který tě dostane tam, kam chceš',
  guarantee: '14denní garance vrácení peněz. Bez otázek.',
  secureBadge: 'Bezpečná platba přes Stripe',
  popularBadge: 'Nejoblíbenější',
  oneTimeBadge: 'Jednorázová platba',
  ctaText: 'Začít',
  featureTitle: 'Proč getbeter Pro?',
  features: [
    'AI kouč dostupný 24/7',
    'Plán se přizpůsobuje tvému pokroku',
    'Detailní výživa s makry',
    'Porovnání fotek před/po',
    'Pokročilá analýza pokroku',
  ],
};

export const DASHBOARD = {
  greeting: (name: string) => `Ahoj, ${name}!`,
  todayWorkout: 'Dnešní trénink',
  noWorkout: 'Dnes je den odpočinku',
  nutritionTitle: 'Výživa dnes',
  progressTitle: 'Pokrok',
  streakTitle: 'Konzistence',
  programDay: (current: number, total: number) => `Den ${current} z ${total}`,
  weeklyStreak: 'Tréninky tento týden',
  upsellText: 'Odemkni plný plán a AI kouče',
  upsellCta: 'Upgrade na PRO →',
  photosTitle: 'Moje fotky',
  addPhoto: 'Přidat fotku',
  calories: 'kcal',
  protein: 'Bílkoviny',
  carbs: 'Sacharidy',
  fat: 'Tuky',
  grams: 'g',
};

export const COACH = {
  title: 'AI Kouč',
  subtitle: 'Tvůj osobní fitness asistent',
  placeholder: 'Zeptej se kouče na cokoli...',
  sendButton: 'Odeslat',
  dailyLimit: (remaining: number) => `${remaining} otázek zbývá dnes`,
  limitReached: 'Denní limit vyčerpán. Zítra budeš mít opět plný přístup.',
  disclaimer:
    'getbeter AI kouč poskytuje obecné fitness rady. Před zahájením nového tréninkového nebo výživového programu se poraď se svým lékařem. Nejedná se o lékařské poradenství.',
  lockedTitle: 'AI Kouč je dostupný v PRO plánu',
  lockedDescription: 'Získej přístup k AI kouči, který odpovídá na tvoje otázky 24/7.',
  lockedCta: 'Odemknout AI Kouče',
  typing: 'Kouč píše...',
  welcomeMessage:
    'Ahoj! Jsem tvůj AI kouč getbeter. Můžeš se mě zeptat na cokoliv ohledně tréninku, výživy nebo svého plánu. Jak ti mohu pomoci?',
};

export const ERRORS = {
  generic: 'Nastala chyba. Zkus to prosím znovu.',
  network: 'Problém s připojením. Zkontroluj internet.',
  auth: {
    invalidCredentials: 'Nesprávný e-mail nebo heslo.',
    emailAlreadyExists: 'Tento e-mail je již registrován.',
    weakPassword: 'Heslo musí mít alespoň 8 znaků.',
    emailRequired: 'E-mail je povinný.',
    passwordRequired: 'Heslo je povinné.',
    nameRequired: 'Jméno je povinné.',
  },
  onboarding: {
    photoRequired: 'Musíš potvrdit souhlas se zpracováním fotky.',
    goalRequired: 'Vyber svůj cíl.',
    ageRequired: 'Zadej svůj věk.',
    ageInvalid: 'Věk musí být mezi 16 a 80 lety.',
    heightRequired: 'Zadej svou výšku.',
    weightRequired: 'Zadej svou váhu.',
    sexRequired: 'Vyber pohlaví.',
  },
  payment: {
    failed: 'Platba selhala. Zkus to prosím znovu.',
    canceled: 'Platba byla zrušena.',
  },
  aiLimit: 'Dosáhl jsi denního limitu zpráv. Zítra budeš mít opět přístup.',
  uploadFailed: 'Nahrávání souboru selhalo. Zkus to znovu.',
  photoTooLarge: 'Fotka je příliš velká. Maximum je 10 MB.',
};

export const DISCLAIMER = {
  short: 'getbeter není lékařská aplikace. Před zahájením nového programu se poraď s lékařem.',
  full: `getbeter je aplikace pro obecné fitness a wellness. Obsah a plány poskytované aplikací getbeter mají pouze informační charakter a nepředstavují lékařskou radu, diagnózu ani léčbu.

Před zahájením jakéhokoli nového cvičebního nebo výživového programu, zejména pokud máš zdravotní problémy, zranění nebo jsi na léčení, vždy konzultuj svého lékaře nebo kvalifikovaného zdravotnického pracovníka.

Výsledky se mohou lišit v závislosti na individuálních faktorech jako věk, pohlaví, výchozí kondice a dodržování plánu. getbeter nezaručuje žádné konkrétní výsledky.

getbeter nenese odpovědnost za jakékoli zranění nebo zdravotní komplikace vzniklé v důsledku používání aplikace nebo sledování doporučení.`,
};

export const FOOTER = {
  tagline: 'Tvoje transformace začíná zde.',
  links: [
    { label: 'Jak to funguje', href: '/jak-to-funguje' },
    { label: 'Ochrana osobních údajů', href: '/ochrana-osobnich-udaju' },
    { label: 'Podmínky použití', href: '/podminky-pouziti' },
    { label: 'Kontakt', href: '/kontakt' },
  ],
  copyright: (year: number) => `© ${year} getbeter. Všechna práva vyhrazena.`,
  disclaimer: 'getbeter není zdravotnickým prostředkem. Výsledky se individuálně liší.',
};

export const RESULTS = {
  title: 'Tvůj plán je připraven!',
  subtitle: 'Analýza dokončena – zde je tvůj transformační roadmap',
  focusAreas: 'Klíčové oblasti',
  sampleWorkout: 'Ukázka z tvého plánu',
  lockedSections: {
    detailedAnalysis: 'Podrobná analýza',
    adaptivePlan: 'Adaptivní plán',
    nutritionMacros: 'Makra a výživa',
    aiCoach: 'AI Kouč',
  },
  freeCta: 'Pokračovat zdarma',
  proCtaSubtext: '14denní garance vrácení peněz',
};

export const SETTINGS = {
  title: 'Nastavení',
  profileSection: 'Profil',
  subscriptionSection: 'Předplatné',
  notificationsSection: 'Oznámení',
  dangerSection: 'Nebezpečná zóna',
  saveButton: 'Uložit změny',
  manageSub: 'Spravovat předplatné',
  deletePhotos: 'Smazat všechny fotky',
  deletePhotosConfirm: 'Opravdu chceš smazat všechny fotky? Tato akce je nevratná.',
  deleteAccount: 'Smazat účet',
  deleteAccountConfirm: 'Opravdu chceš smazat svůj účet? Všechna data budou trvale odstraněna.',
  signOut: 'Odhlásit se',
  currentPlan: 'Aktuální plán',
  upgradeButton: 'Upgradovat',
  notifWorkout: 'Připomínky tréninku',
  notifNutrition: 'Připomínky jídla',
  saved: 'Změny uloženy',
  privacyLink: 'Ochrana osobních údajů',
};

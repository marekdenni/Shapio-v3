import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { openai, getModelForTier, AI_LIMITS } from '@/lib/openai';

// GET /api/coach?remaining=true — get remaining messages for today
export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single();

    const tier = userProfile?.subscription_tier || 'free';
    const dailyLimit = tier === 'elite' ? AI_LIMITS.ELITE_DAILY : AI_LIMITS.PRO_DAILY;

    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('ai_daily_usage')
      .select('message_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    const usedToday = usage?.message_count || 0;
    const remaining = Math.max(0, dailyLimit - usedToday);

    return NextResponse.json({ remaining, limit: dailyLimit });
  } catch {
    return NextResponse.json({ remaining: 0 }, { status: 500 });
  }
}

// POST /api/coach — send message to AI coach
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
    }

    // Check subscription tier
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('subscription_tier, goal, fitness_level')
      .eq('id', user.id)
      .single();

    const tier = userProfile?.subscription_tier || 'free';

    // Only PRO and ELITE can use AI coach
    if (tier === 'free' || tier === 'starter') {
      return NextResponse.json(
        { error: 'AI Kouč je dostupný pouze pro PRO a ELITE uživatele.' },
        { status: 403 }
      );
    }

    // Check daily usage limit
    const today = new Date().toISOString().split('T')[0];
    const { data: usage } = await supabase
      .from('ai_daily_usage')
      .select('message_count')
      .eq('user_id', user.id)
      .eq('date', today)
      .single();

    const dailyLimit = tier === 'elite' ? AI_LIMITS.ELITE_DAILY : AI_LIMITS.PRO_DAILY;
    const usedToday = usage?.message_count || 0;

    if (usedToday >= dailyLimit) {
      return NextResponse.json(
        { error: 'Dosáhl jsi denního limitu zpráv. Zítra budeš mít opět přístup.' },
        { status: 429 }
      );
    }

    // Parse request
    const body = await request.json();
    const { message, history = [] } = body as {
      message: string;
      history: Array<{ role: string; content: string }>;
    };

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Zpráva je prázdná.' }, { status: 400 });
    }

    // Build conversation history
    const model = getModelForTier(tier);
    const systemPrompt = `Jsi AI fitness kouč aplikace Shapio. Pomáháš uživatelům s tréninkem, výživou a motivací.

Uživatelský profil:
- Cíl: ${userProfile?.goal || 'general_fitness'}
- Úroveň: ${userProfile?.fitness_level || 'beginner'}

Pravidla:
- Odpovídej vždy česky
- Buď přímý, konkrétní a motivující
- Používej odborné, ale srozumitelné výrazy
- Odpovědi drž pod ${AI_LIMITS.MAX_WORDS} slov
- VŽDY připomeň, že rady jsou obecného charakteru a nejsou náhradou lékařského poradenstv

DŮLEŽITÉ: Neposkytuj lékařské diagnózy ani léčebné postupy. Vždy doporučuj konzultaci s lékařem před zahájením nového programu.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];

    // Call OpenAI
    const completion = await openai.chat.completions.create({
      model,
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content || 'Omluv mě, nastala chyba. Zkus to prosím znovu.';

    // Update daily usage count
    await supabase
      .from('ai_daily_usage')
      .upsert({
        user_id: user.id,
        date: today,
        message_count: usedToday + 1,
      }, {
        onConflict: 'user_id,date',
      });

    // Save message to DB for history
    await supabase.from('ai_coach_messages').insert([
      { user_id: user.id, role: 'user', content: message },
      { user_id: user.id, role: 'assistant', content: reply },
    ]);

    const remainingToday = Math.max(0, dailyLimit - usedToday - 1);

    return NextResponse.json({ reply, remainingToday });
  } catch (error) {
    console.error('Coach API error:', error);
    return NextResponse.json(
      { error: 'Nastala chyba při zpracování zprávy.' },
      { status: 500 }
    );
  }
}

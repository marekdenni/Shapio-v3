import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// POST /api/analysis/free
// Accepts a base64 photo and questionnaire data, returns a free-tier basic analysis.
// Uses gpt-4o-mini with vision to keep costs low.
// Falls back to a questionnaire-only analysis if no valid image is provided.

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a supportive fitness coach providing a motivating first impression and basic guidance.

RULES:
- Be supportive, encouraging, and practical. Never shame or criticise.
- Do NOT diagnose, treat, or make medical claims.
- Do NOT give specific body fat percentages from a photo — only general impressions.
- Keep response concise and structured (4 short sections).
- Write in Czech language.
- Avoid extreme promises. Be realistic but motivating.
- This is a wellness coaching app, not a medical device.

OUTPUT FORMAT (return exactly this JSON structure):
{
  "impression": "2-3 sentence general physique impression, positive and constructive",
  "focusAreas": ["area 1", "area 2", "area 3"],
  "recommendation": "1-2 sentence practical starting recommendation",
  "motivation": "1 short motivating closing sentence"
}`;

function buildFallbackAnalysis(goal: string, fitnessLevel: string) {
  // Questionnaire-based fallback when OpenAI is unavailable or no image
  const goalMap: Record<string, string> = {
    fat_loss: 'spalování tuku a redukci hmotnosti',
    muscle_gain: 'budování svalové hmoty a síly',
    recomposition: 'rekompozici těla — zároveň nabírání svalů a spalování tuku',
    general_fitness: 'zlepšení celkové kondice a pohyblivosti',
  };

  const levelMap: Record<string, string> = {
    beginner: 'začátečník',
    intermediate: 'středně pokročilý',
    advanced: 'pokročilý',
  };

  const goalLabel = goalMap[goal] ?? 'transformaci těla';
  const levelLabel = levelMap[fitnessLevel] ?? 'začátečník';

  return {
    impression: `Na základě tvých odpovědí vidíme jasný potenciál pro ${goalLabel}. Jako ${levelLabel} máš skvělý výchozí bod pro rychlý pokrok.`,
    focusAreas: [
      'Budování základní pohybové rutiny',
      'Nastavení výživového plánu podle cíle',
      'Progresivní zvyšování intenzity tréninku',
    ],
    recommendation: `Začni s ${fitnessLevel === 'beginner' ? '3 tréninky týdně po 30–45 minutách' : '4 tréninky týdně s progresivním přetížením'}. Konzistence v prvních 4 týdnech je klíčová.`,
    motivation: 'Každá cesta začíná prvním krokem — tvůj plán je připravený a ty jsi připraven začít.',
  };
}

export async function POST(request: Request) {
  // Verify authentication
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    return NextResponse.json({ error: 'Nejsi přihlášen.' }, { status: 401 });
  }

  let body: {
    photoBase64?: string;
    goal?: string;
    fitnessLevel?: string;
    age?: number;
    sex?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Neplatný formát požadavku.' }, { status: 400 });
  }

  const { photoBase64, goal = 'general_fitness', fitnessLevel = 'beginner', age, sex } = body;

  // If no API key, return fallback immediately
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({
      success: true,
      analysis: buildFallbackAnalysis(goal, fitnessLevel),
      source: 'fallback',
    });
  }

  try {
    const userContext = [
      `Cíl: ${goal}`,
      `Úroveň: ${fitnessLevel}`,
      age ? `Věk: ${age} let` : null,
      sex ? `Pohlaví: ${sex === 'male' ? 'muž' : 'žena'}` : null,
    ].filter(Boolean).join(', ');

    let messages: OpenAI.Chat.ChatCompletionMessageParam[];

    if (photoBase64 && photoBase64.length > 100) {
      // Vision analysis with photo + context
      messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Uživatel: ${userContext}. Poskytni základní analýzu na základě fotky a profilu.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: photoBase64.startsWith('data:')
                  ? photoBase64
                  : `data:image/jpeg;base64,${photoBase64}`,
                detail: 'low', // low detail = lower cost for free tier
              },
            },
          ],
        },
      ];
    } else {
      // Text-only analysis from questionnaire (no photo)
      messages = [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Uživatel bez fotky. Profil: ${userContext}. Poskytni základní analýzu pouze na základě profilu.`,
        },
      ];
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // cost-efficient for free tier
      messages,
      max_tokens: 400,
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const raw = completion.choices[0]?.message?.content ?? '{}';

    let analysis: Record<string, unknown>;
    try {
      analysis = JSON.parse(raw);
    } catch {
      // If JSON parse fails, return fallback
      return NextResponse.json({
        success: true,
        analysis: buildFallbackAnalysis(goal, fitnessLevel),
        source: 'fallback',
      });
    }

    return NextResponse.json({ success: true, analysis, source: 'ai' });
  } catch (err) {
    console.error('[analysis/free] OpenAI error:', err);
    // Graceful fallback — never fail the user
    return NextResponse.json({
      success: true,
      analysis: buildFallbackAnalysis(goal, fitnessLevel),
      source: 'fallback',
    });
  }
}

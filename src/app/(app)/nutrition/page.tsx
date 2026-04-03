'use client';

// Nutrition page with daily calories and meal plan
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LockedFeature } from '@/components/paywall/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase/client';
import type { NutritionPlan, Meal, MacroTargets } from '@/types';

export default function NutritionPage() {
  const { profile } = useAuth();
  const { tier } = useSubscription();
  const [nutritionPlan, setNutritionPlan] = useState<Partial<NutritionPlan> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      if (!profile?.id) return;

      try {
        const { data } = await supabase
          .from('nutrition_plans')
          .select('plan_data')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (data?.plan_data) {
          setNutritionPlan(data.plan_data as Partial<NutritionPlan>);
        }
      } catch {
        // Use placeholder data
        setNutritionPlan(getPlaceholderPlan());
      } finally {
        setLoading(false);
      }
    };

    fetchPlan();
  }, [profile?.id]);

  function getPlaceholderPlan(): Partial<NutritionPlan> {
    return {
      dailyTargets: { calories: 2400, proteinG: 180, carbsG: 250, fatG: 65 },
      hydrationLiters: 3,
      meals: [
        {
          name: 'Snídaně',
          time: '7:00',
          calories: 550,
          protein: 40,
          carbs: 60,
          fat: 12,
          description: 'Výživná snídaně pro nastartování metabolismu',
          foods: ['Ovesné vločky 80g', 'Banán', 'Protein shake', 'Mandle 20g'],
        },
        {
          name: 'Svačina',
          time: '10:00',
          calories: 350,
          protein: 30,
          carbs: 35,
          fat: 8,
          description: 'Lehká svačina před obědem',
          foods: ['Řecký jogurt 200g', 'Borůvky 100g', 'Med 1 lžička'],
        },
        {
          name: 'Oběd',
          time: '13:00',
          calories: 700,
          protein: 55,
          carbs: 80,
          fat: 18,
          description: 'Hlavní jídlo dne se vším potřebným',
          foods: ['Kuřecí prsa 200g', 'Rýže hnědá 100g', 'Brokolice 200g', 'Olivový olej'],
        },
        {
          name: 'Odpolední svačina',
          time: '16:00',
          calories: 300,
          protein: 25,
          carbs: 30,
          fat: 8,
          description: 'Pre-workout svačina (jen v tréninkové dny)',
          foods: ['Tvaroh 200g', 'Jablko', 'Ořechy 20g'],
        },
        {
          name: 'Večeře',
          time: '19:30',
          calories: 500,
          protein: 30,
          carbs: 45,
          fat: 19,
          description: 'Lehká, výživná večeře',
          foods: ['Losos 150g', 'Sladké brambory 200g', 'Špenát', 'Citron'],
        },
      ],
      generalGuidelines: [
        'Jez každé 3-4 hodiny pro stabilizaci hladiny cukru v krvi',
        'Pij minimálně 3 litry vody denně',
        'Konzumuj bílkoviny při každém jídle',
        'Omezte zpracované potraviny a přidaný cukr',
      ],
    };
  }

  const plan = nutritionPlan;
  const targets = plan?.dailyTargets;

  const macros = targets
    ? [
        { label: 'Bílkoviny', value: targets.proteinG, unit: 'g', color: 'red' as const, percent: Math.round((targets.proteinG * 4 / targets.calories) * 100) },
        { label: 'Sacharidy', value: targets.carbsG, unit: 'g', color: 'blue' as const, percent: Math.round((targets.carbsG * 4 / targets.calories) * 100) },
        { label: 'Tuky', value: targets.fatG, unit: 'g', color: 'yellow' as const, percent: Math.round((targets.fatG * 9 / targets.calories) * 100) },
      ]
    : [];

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary">Výživa</h1>
        <p className="text-text-secondary text-sm mt-1">Tvůj denní výživový plán</p>
      </div>

      {/* Calorie overview */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-3xl font-black text-text-primary">
              {targets?.calories || '---'}
              <span className="text-base font-normal text-text-secondary ml-1">kcal/den</span>
            </p>
            <p className="text-sm text-text-secondary mt-1">Denní kalorický cíl</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">{plan?.hydrationLiters || 3}L</p>
            <p className="text-xs text-text-secondary/60">vody denně</p>
          </div>
        </div>

        {/* Macro distribution - gated */}
        <LockedFeature
          feature="nutrition_macros"
          title="Detailní makra"
          description="Přesné makronutrienty jsou dostupné od Starter plánu."
          ctaText="Odemknout makra →"
          blurContent={true}
        >
          <div className="flex gap-3">
            {macros.map((macro) => (
              <div key={macro.label} className="flex-1 bg-surface rounded-xl p-3 border border-border text-center">
                <p className="text-lg font-black text-text-primary">{macro.value}g</p>
                <p className="text-xs text-text-secondary">{macro.label}</p>
                <p className="text-xs text-cta font-semibold mt-0.5">{macro.percent}%</p>
              </div>
            ))}
          </div>
        </LockedFeature>
      </Card>

      {/* Meal plan */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-surface2 rounded-2xl animate-shimmer border border-border" />
          ))}
        </div>
      ) : (
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">Jídelníček</h2>
          <div className="flex flex-col gap-3">
            {plan?.meals?.map((meal: Meal, i: number) => (
              <MealCard key={i} meal={meal} showMacros={tier !== 'free'} />
            ))}
          </div>
        </div>
      )}

      {/* Guidelines */}
      {plan?.generalGuidelines && plan.generalGuidelines.length > 0 && (
        <Card variant="default">
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <span>💡</span> Výživové tipy
          </h3>
          <ul className="flex flex-col gap-2">
            {plan.generalGuidelines.map((tip: string, i: number) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                <span className="text-cta mt-0.5 shrink-0">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Disclaimer */}
      <p className="text-xs text-text-secondary/50 text-center leading-relaxed px-2">
        Výživový plán slouží jako obecné doporučení. Před výraznou změnou stravy konzultuj svého lékaře.
      </p>
    </div>
  );
}

function MealCard({ meal, showMacros }: { meal: Meal; showMacros: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      onClick={() => setExpanded(!expanded)}
      className="w-full text-left bg-surface border border-border rounded-2xl overflow-hidden hover:border-border/60 transition-all"
    >
      <div className="flex items-center gap-4 p-4">
        <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-lg shrink-0">
          {getMealEmoji(meal.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-text-primary">{meal.name}</p>
            {meal.time && <span className="text-xs text-text-secondary/60">{meal.time}</span>}
          </div>
          <p className="text-xs text-text-secondary mt-0.5">{meal.description}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-base font-bold text-text-primary">{meal.calories}</p>
          <p className="text-xs text-text-secondary">kcal</p>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 border-t border-border/50 pt-3">
          {/* Macro breakdown */}
          {showMacros && (
            <div className="flex gap-3 mb-3">
              {[
                { label: 'Bílkoviny', value: meal.protein, unit: 'g' },
                { label: 'Sacharidy', value: meal.carbs, unit: 'g' },
                { label: 'Tuky', value: meal.fat, unit: 'g' },
              ].map((m) => (
                <div key={m.label} className="flex-1 bg-background rounded-xl p-2 text-center border border-border">
                  <p className="text-sm font-bold text-text-primary">{m.value}{m.unit}</p>
                  <p className="text-xs text-text-secondary/70">{m.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* Foods list */}
          <div className="flex flex-wrap gap-1.5">
            {meal.foods.map((food, i) => (
              <span
                key={i}
                className="px-2.5 py-1 bg-surface2 border border-border rounded-lg text-xs text-text-secondary"
              >
                {food}
              </span>
            ))}
          </div>

          {meal.notes && (
            <p className="text-xs text-text-secondary/60 mt-2 italic">{meal.notes}</p>
          )}
        </div>
      )}
    </button>
  );
}

function getMealEmoji(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('snídaně')) return '☀️';
  if (lower.includes('svačina') || lower.includes('svačin')) return '🍎';
  if (lower.includes('oběd')) return '🍽️';
  if (lower.includes('večeře')) return '🌙';
  return '🥗';
}

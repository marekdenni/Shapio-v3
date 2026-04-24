'use client';

// Multi-section questionnaire form for onboarding steps 2-4
import React from 'react';
import { Input } from '@/components/ui/Input';
import { GoalSelector } from './GoalSelector';
import { useOnboardingStore } from '@/stores/onboarding';
import { ONBOARDING } from '@/constants/copy';
import type {
  FitnessGoal,
  Sex,
  FitnessLevel,
  Equipment,
  DietaryPreference,
  ActivityLevel,
  FrictionPattern,
  InterestSignal,
} from '@/types';

interface StepProps {
  step: 2 | 3 | 4;
}

// ── Step 2: Goal + Basic Info ────────────────────────────────────────────────
function Step2() {
  const store = useOnboardingStore();

  return (
    <div className="flex flex-col gap-5">
      {/* Goal selector */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">
          {ONBOARDING.goalTitle}
        </label>
        <GoalSelector
          value={store.goal}
          onChange={(goal: FitnessGoal) => store.setField('goal', goal)}
        />
      </div>

      {/* Sex selector */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {ONBOARDING.fields.sex} <span className="text-cta">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as Sex[]).map((sex) => (
            <button
              key={sex}
              type="button"
              onClick={() => store.setField('sex', sex)}
              className={[
                'py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all',
                store.sex === sex
                  ? 'border-cta bg-cta/10 text-text-primary'
                  : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
              ].join(' ')}
            >
              {sex === 'male' ? `♂ ${ONBOARDING.fields.male}` : `♀ ${ONBOARDING.fields.female}`}
            </button>
          ))}
        </div>
      </div>

      {/* Age, Height, Weight */}
      <div className="grid grid-cols-3 gap-3">
        <Input
          label={ONBOARDING.fields.age}
          type="number"
          placeholder={ONBOARDING.fields.agePlaceholder}
          value={store.age || ''}
          onChange={(e) => store.setField('age', parseInt(e.target.value) || null)}
          min={16}
          max={80}
          required
        />
        <Input
          label={ONBOARDING.fields.height}
          type="number"
          placeholder={ONBOARDING.fields.heightPlaceholder}
          value={store.heightCm || ''}
          onChange={(e) => store.setField('heightCm', parseInt(e.target.value) || null)}
          min={140}
          max={230}
          required
        />
        <Input
          label={ONBOARDING.fields.weight}
          type="number"
          placeholder={ONBOARDING.fields.weightPlaceholder}
          value={store.weightKg || ''}
          onChange={(e) => store.setField('weightKg', parseInt(e.target.value) || null)}
          min={40}
          max={200}
          required
        />
      </div>
      <div className="grid grid-cols-3 gap-3 -mt-3">
        <p className="text-xs text-text-secondary/60 text-center">{ONBOARDING.fields.ageUnit}</p>
        <p className="text-xs text-text-secondary/60 text-center">{ONBOARDING.fields.heightUnit}</p>
        <p className="text-xs text-text-secondary/60 text-center">{ONBOARDING.fields.weightUnit}</p>
      </div>
    </div>
  );
}

// ── Step 3: Fitness Details ──────────────────────────────────────────────────
function Step3() {
  const store = useOnboardingStore();

  const levels: { id: FitnessLevel; label: string }[] = [
    { id: 'beginner', label: ONBOARDING.fields.beginner },
    { id: 'intermediate', label: ONBOARDING.fields.intermediate },
    { id: 'advanced', label: ONBOARDING.fields.advanced },
  ];

  const equipmentOptions: { id: Equipment; label: string }[] = [
    { id: 'none', label: ONBOARDING.fields.none },
    { id: 'home_basic', label: ONBOARDING.fields.home_basic },
    { id: 'gym_full', label: ONBOARDING.fields.gym_full },
  ];

  const activityOptions: { id: ActivityLevel; label: string }[] = [
    { id: 'sedentary', label: ONBOARDING.fields.sedentary },
    { id: 'lightly_active', label: ONBOARDING.fields.lightly_active },
    { id: 'moderately_active', label: ONBOARDING.fields.moderately_active },
    { id: 'very_active', label: ONBOARDING.fields.very_active },
  ];

  const sessionOptions: { value: number; label: string }[] = [
    { value: 30, label: '30 min' },
    { value: 45, label: '45 min' },
    { value: 60, label: '60 min' },
    { value: 75, label: '75 min' },
    { value: 90, label: '90+ min' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Fitness level */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {ONBOARDING.fields.fitnessLevel} <span className="text-cta">*</span>
        </label>
        <div className="flex flex-col gap-2">
          {levels.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => store.setField('fitnessLevel', id)}
              className={[
                'py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all',
                store.fitnessLevel === id
                  ? 'border-cta bg-cta/10 text-text-primary'
                  : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {ONBOARDING.fields.equipment} <span className="text-cta">*</span>
        </label>
        <div className="flex flex-col gap-2">
          {equipmentOptions.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => store.setField('equipment', id)}
              className={[
                'py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all',
                store.equipment === id
                  ? 'border-cta bg-cta/10 text-text-primary'
                  : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity level */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {ONBOARDING.fields.activityLevel} <span className="text-cta">*</span>
        </label>
        <div className="flex flex-col gap-2">
          {activityOptions.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => store.setField('activityLevel', id)}
              className={[
                'py-3 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all',
                store.activityLevel === id
                  ? 'border-cta bg-cta/10 text-text-primary'
                  : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Session duration */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">
          {ONBOARDING.fields.sessionDuration} <span className="text-cta">*</span>
        </label>
        <div className="flex gap-2 justify-between">
          {sessionOptions.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => store.setField('sessionDurationMinutes', value)}
              className={[
                'flex-1 py-3 rounded-xl border-2 text-xs font-bold transition-all',
                store.sessionDurationMinutes === value
                  ? 'border-cta bg-cta/10 text-cta'
                  : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Workout days per week */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-3">
          {ONBOARDING.fields.workoutDays} <span className="text-cta">*</span>
        </label>
        <div className="flex gap-2 justify-between">
          {[2, 3, 4, 5, 6].map((days) => (
            <button
              key={days}
              type="button"
              onClick={() => store.setField('workoutDaysPerWeek', days)}
              className={[
                'flex-1 py-3 rounded-xl border-2 text-base font-bold transition-all',
                store.workoutDaysPerWeek === days
                  ? 'border-cta bg-cta/10 text-cta'
                  : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
              ].join(' ')}
            >
              {days}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-secondary/60 mt-2 text-center">dní v týdnu</p>
      </div>
    </div>
  );
}

// ── Step 4: Preferences ──────────────────────────────────────────────────────
function Step4() {
  const store = useOnboardingStore();

  const dietOptions: { id: DietaryPreference; label: string }[] = [
    { id: 'no_preference', label: ONBOARDING.fields.no_preference },
    { id: 'vegetarian', label: ONBOARDING.fields.vegetarian },
    { id: 'vegan', label: ONBOARDING.fields.vegan },
    { id: 'keto', label: ONBOARDING.fields.keto },
    { id: 'low_carb', label: ONBOARDING.fields.low_carb },
  ];

  const frictionOptions: { id: FrictionPattern; label: string }[] = [
    { id: 'no_time', label: ONBOARDING.fields.friction_no_time },
    { id: 'no_motivation', label: ONBOARDING.fields.friction_no_motivation },
    { id: 'no_energy', label: ONBOARDING.fields.friction_no_energy },
    { id: 'dont_know_what_to_do', label: ONBOARDING.fields.friction_dont_know_what_to_do },
    { id: 'injury_fear', label: ONBOARDING.fields.friction_injury_fear },
    { id: 'past_failures', label: ONBOARDING.fields.friction_past_failures },
    { id: 'social_anxiety', label: ONBOARDING.fields.friction_social_anxiety },
    { id: 'bad_diet_habits', label: ONBOARDING.fields.friction_bad_diet_habits },
  ];

  const interestOptions: { id: InterestSignal; label: string }[] = [
    { id: 'ai_coaching', label: ONBOARDING.fields.interest_ai_coaching },
    { id: 'progress_tracking', label: ONBOARDING.fields.interest_progress_tracking },
    { id: 'nutrition_planning', label: ONBOARDING.fields.interest_nutrition_planning },
    { id: 'community', label: ONBOARDING.fields.interest_community },
    { id: 'challenges', label: ONBOARDING.fields.interest_challenges },
    { id: 'team_coaching', label: ONBOARDING.fields.interest_team_coaching },
    { id: 'corporate_wellness', label: ONBOARDING.fields.interest_corporate_wellness },
  ];

  const toggleFriction = (id: FrictionPattern) => {
    const current = store.mainFrictions;
    const updated = current.includes(id)
      ? current.filter((f) => f !== id)
      : [...current, id];
    store.setField('mainFrictions', updated);
  };

  const toggleInterest = (id: InterestSignal) => {
    const current = store.interestSignals;
    const updated = current.includes(id)
      ? current.filter((s) => s !== id)
      : [...current, id];
    store.setField('interestSignals', updated);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Dietary preference */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-2">
          {ONBOARDING.fields.dietaryPreference} <span className="text-cta">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {dietOptions.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => store.setField('dietaryPreference', id)}
              className={[
                'py-2.5 px-4 rounded-xl border-2 text-sm font-medium text-left transition-all',
                store.dietaryPreference === id
                  ? 'border-cta bg-cta/10 text-text-primary'
                  : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
              ].join(' ')}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Injuries */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {ONBOARDING.fields.injuries}
        </label>
        <textarea
          placeholder={ONBOARDING.fields.injuriesPlaceholder}
          value={store.injuries}
          onChange={(e) => store.setField('injuries', e.target.value)}
          rows={2}
          className="w-full px-4 py-3 bg-surface2 text-text-primary border border-border rounded-xl placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60 transition-all resize-none text-sm"
        />
        <p className="text-xs text-text-secondary/60 mt-1">{ONBOARDING.fields.injuriesHelp}</p>
      </div>

      {/* Frictions — multi-select, optional */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {ONBOARDING.fields.frictions}
        </label>
        <p className="text-xs text-text-secondary/60 mb-2">{ONBOARDING.fields.frictionsHelp}</p>
        <div className="grid grid-cols-2 gap-2">
          {frictionOptions.map(({ id, label }) => {
            const isSelected = store.mainFrictions.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleFriction(id)}
                className={[
                  'py-2.5 px-3 rounded-xl border-2 text-xs font-medium text-left transition-all flex items-center gap-2',
                  isSelected
                    ? 'border-cta bg-cta/10 text-text-primary'
                    : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
                ].join(' ')}
              >
                <span className={`w-3.5 h-3.5 rounded shrink-0 border flex items-center justify-center ${isSelected ? 'bg-cta border-cta' : 'border-border/60'}`}>
                  {isSelected && (
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Interest signals — multi-select, optional */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1">
          {ONBOARDING.fields.interests}
        </label>
        <p className="text-xs text-text-secondary/60 mb-2">{ONBOARDING.fields.interestsHelp}</p>
        <div className="grid grid-cols-2 gap-2">
          {interestOptions.map(({ id, label }) => {
            const isSelected = store.interestSignals.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleInterest(id)}
                className={[
                  'py-2.5 px-3 rounded-xl border-2 text-xs font-medium text-left transition-all flex items-center gap-2',
                  isSelected
                    ? 'border-cta bg-cta/10 text-text-primary'
                    : 'border-border bg-surface2 text-text-secondary hover:border-border/60',
                ].join(' ')}
              >
                <span className={`w-3.5 h-3.5 rounded shrink-0 border flex items-center justify-center ${isSelected ? 'bg-cta border-cta' : 'border-border/60'}`}>
                  {isSelected && (
                    <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </span>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Motivation */}
      <div>
        <label className="block text-sm font-medium text-text-secondary mb-1.5">
          {ONBOARDING.fields.motivation}
        </label>
        <textarea
          placeholder={ONBOARDING.fields.motivationPlaceholder}
          value={store.targetMotivation}
          onChange={(e) => store.setField('targetMotivation', e.target.value)}
          rows={2}
          className="w-full px-4 py-3 bg-surface2 text-text-primary border border-border rounded-xl placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-cta/40 focus:border-cta/60 transition-all resize-none text-sm"
        />
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────
export function QuestionnaireForm({ step }: StepProps) {
  if (step === 2) return <Step2 />;
  if (step === 3) return <Step3 />;
  if (step === 4) return <Step4 />;
  return null;
}

export default QuestionnaireForm;

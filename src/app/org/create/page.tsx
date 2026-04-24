'use client';

// Create Organization page — captures name, type, business goal, and target audience.
// After creation, redirects to the org dashboard.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth';
import { ORG_TYPE_META, ORG_BUSINESS_GOAL_META } from '@/constants/org-plans';
import type { OrgType, OrgBusinessGoal } from '@/types';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48);
}

export default function CreateOrgPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [type, setType] = useState<OrgType>('coach');
  const [businessGoal, setBusinessGoal] = useState<OrgBusinessGoal>('member_retention');
  const [targetAudience, setTargetAudience] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugEdited) {
      setSlug(generateSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugEdited(true);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Název organizace je povinný.');
      return;
    }
    if (slug.length < 3) {
      setError('URL identifikátor musí mít alespoň 3 znaky.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/org/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug,
          type,
          businessGoal,
          targetAudience: targetAudience.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Nepodařilo se vytvořit organizaci.');
        return;
      }

      router.push(`/org/${data.slug}`);
    } catch {
      setError('Nastala neočekávaná chyba. Zkus to znovu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const orgTypes = Object.entries(ORG_TYPE_META) as Array<[OrgType, { label: string; emoji: string }]>;
  const businessGoals = Object.entries(ORG_BUSINESS_GOAL_META) as Array<[OrgBusinessGoal, { label: string; description: string; emoji: string }]>;

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-primary mb-2">
          Vytvořit organizaci
        </h1>
        <p className="text-text-secondary text-sm">
          Vytvoř prostor pro svůj tým, klienty nebo členy.
        </p>
      </div>

      {error && (
        <div className="mb-5 p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Name + slug */}
        <Card variant="elevated">
          <div className="flex flex-col gap-4">
            <Input
              label="Název organizace"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Např. FitTeam Praha"
              required
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                URL identifikátor
              </label>
              <div className="flex items-center gap-0">
                <span className="px-3 py-3 bg-background border border-r-0 border-border rounded-l-xl text-sm text-text-secondary">
                  /org/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  className="flex-1 px-3 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-border rounded-r-xl text-sm placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all duration-200"
                  placeholder="fit-team-praha"
                />
              </div>
              <p className="text-xs text-text-secondary/60">
                Pouze malá písmena, čísla a pomlčky. Min. 3 znaky.
              </p>
            </div>
          </div>
        </Card>

        {/* Org type */}
        <Card variant="elevated">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-text-primary">
              Typ organizace
            </label>
            <div className="grid grid-cols-2 gap-2">
              {orgTypes.map(([value, meta]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setType(value)}
                  className={[
                    'flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left',
                    type === value
                      ? 'bg-[#B3263E]/10 border-[#B3263E]/50 text-[#F5F5F5]'
                      : 'bg-surface2 border-border text-text-secondary hover:border-border/80 hover:text-text-primary',
                  ].join(' ')}
                >
                  <span className="text-lg">{meta.emoji}</span>
                  <span className="text-sm font-medium">{meta.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Business goal */}
        <Card variant="elevated">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium text-text-primary">
                Hlavní obchodní cíl
              </label>
              <p className="text-xs text-text-secondary mt-0.5">
                Co chceš pomocí getbeter primárně dosáhnout?
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {businessGoals.map(([value, meta]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setBusinessGoal(value)}
                  className={[
                    'flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 text-left',
                    businessGoal === value
                      ? 'bg-[#B3263E]/10 border-[#B3263E]/50'
                      : 'bg-surface2 border-border hover:border-border/80',
                  ].join(' ')}
                >
                  <span className="text-xl shrink-0">{meta.emoji}</span>
                  <div>
                    <p className={`text-sm font-medium ${businessGoal === value ? 'text-[#F5F5F5]' : 'text-text-primary'}`}>
                      {meta.label}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">{meta.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Target audience */}
        <Card variant="elevated">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-sm font-medium text-text-primary">
                Cílová skupina <span className="text-text-secondary font-normal">(nepovinné)</span>
              </label>
              <p className="text-xs text-text-secondary mt-0.5">
                Kdo jsou tví koncoví uživatelé nebo klienti?
              </p>
            </div>
            <textarea
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Např. muži 25–45 let, kteří chtějí nabrat svalovou hmotu a mají přístup do posilovny..."
              rows={3}
              className="px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-border rounded-xl text-sm placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#B3263E]/40 focus:border-[#B3263E]/60 transition-all duration-200 resize-none"
            />
          </div>
        </Card>

        <Button
          variant="primary"
          fullWidth
          size="lg"
          loading={isSubmitting}
          disabled={!name.trim() || slug.length < 3}
        >
          Vytvořit organizaci
        </Button>

        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors text-center"
        >
          ← Zpět
        </button>
      </form>
    </div>
  );
}

'use client';

// Create Organization page — simple form to create a new org.
// After creation, redirects to the org dashboard.
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { useAuthStore } from '@/stores/auth';
import type { OrgType } from '@/types';

const ORG_TYPES: Array<{ value: OrgType; label: string; emoji: string }> = [
  { value: 'coach', label: 'Trenér / Koučink', emoji: '🏋️' },
  { value: 'gym', label: 'Posilovna / Studio', emoji: '🏢' },
  { value: 'brand', label: 'Wellness značka', emoji: '✨' },
  { value: 'employer', label: 'Zaměstnavatel', emoji: '🏗️' },
  { value: 'program', label: 'Transformační program', emoji: '🚀' },
  { value: 'other', label: 'Jiný typ', emoji: '📁' },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
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
        body: JSON.stringify({ name: name.trim(), slug, type }),
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

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-text-primary mb-2">
          Vytvořit organizaci
        </h1>
        <p className="text-text-secondary text-sm">
          Vytvoř prostor pro svůj tým, klienty nebo členy. Později můžeš pozvat další lidi.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400 animate-fade-in-up">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Org name */}
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
                  shapio.cz/org/
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
              {ORG_TYPES.map((orgType) => (
                <button
                  key={orgType.value}
                  type="button"
                  onClick={() => setType(orgType.value)}
                  className={[
                    'flex items-center gap-2.5 p-3 rounded-xl border transition-all duration-200 text-left',
                    type === orgType.value
                      ? 'bg-[#B3263E]/10 border-[#B3263E]/50 text-[#F5F5F5]'
                      : 'bg-surface2 border-border text-text-secondary hover:border-border/80 hover:text-text-primary',
                  ].join(' ')}
                >
                  <span className="text-lg">{orgType.emoji}</span>
                  <span className="text-sm font-medium">{orgType.label}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Submit */}
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

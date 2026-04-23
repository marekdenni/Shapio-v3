'use client';

// Organization settings page — name, type, slug, plan display.
// Only accessible to org owners and admins.
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOrgStore } from '@/stores/organization';
import { supabase } from '@/lib/supabase/client';
import type { OrgType } from '@/types';

const ORG_TYPES: Array<{ value: OrgType; label: string; emoji: string }> = [
  { value: 'coach', label: 'Trenér / Koučink', emoji: '🏋️' },
  { value: 'gym', label: 'Posilovna / Studio', emoji: '🏢' },
  { value: 'brand', label: 'Wellness značka', emoji: '✨' },
  { value: 'employer', label: 'Zaměstnavatel', emoji: '🏗️' },
  { value: 'program', label: 'Transformační program', emoji: '🚀' },
  { value: 'other', label: 'Jiný typ', emoji: '📁' },
];

export default function OrgSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { currentOrg, membership, loading, loadOrg } = useOrgStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<OrgType>('other');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) loadOrg(slug);
  }, [slug, loadOrg]);

  useEffect(() => {
    if (currentOrg) {
      setName(currentOrg.name);
      setType(currentOrg.type);
    }
  }, [currentOrg]);

  const isAdminOrOwner = membership?.role === 'owner' || membership?.role === 'admin';

  // Access check
  if (!loading && currentOrg && !isAdminOrOwner) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-2xl font-black text-text-primary mb-2">Přístup odepřen</h1>
        <p className="text-text-secondary text-sm mb-6">
          Nastavení organizace je dostupné pouze pro vlastníky a adminy.
        </p>
        <Button variant="primary" onClick={() => router.push(`/org/${slug}`)}>
          Zpět na dashboard organizace
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!currentOrg) return;
    setError(null);
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          name: name.trim(),
          type,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentOrg.id);

      if (updateError) {
        setError('Nepodařilo se uložit změny.');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      // Reload org data
      loadOrg(slug);
    } catch {
      setError('Nastala neočekávaná chyba.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !currentOrg) {
    return (
      <div className="flex flex-col gap-5 max-w-lg mx-auto">
        <div className="h-8 w-48 bg-surface2 rounded-lg animate-shimmer" />
        <div className="h-48 bg-surface2 rounded-2xl animate-shimmer border border-border" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary mb-1">Nastavení organizace</h1>
        <p className="text-text-secondary text-sm">{currentOrg.slug}</p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Basic info */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-cta rounded-full" />
          <h2 className="text-base font-semibold text-text-primary">Základní informace</h2>
        </div>
        <Card variant="elevated">
          <div className="flex flex-col gap-4">
            <Input
              label="Název organizace"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Název"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">Typ organizace</label>
              <div className="grid grid-cols-2 gap-2">
                {ORG_TYPES.map((orgType) => (
                  <button
                    key={orgType.value}
                    type="button"
                    onClick={() => setType(orgType.value)}
                    className={[
                      'flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-200 text-left text-sm',
                      type === orgType.value
                        ? 'bg-[#B3263E]/10 border-[#B3263E]/50 text-[#F5F5F5]'
                        : 'bg-surface2 border-border text-text-secondary hover:border-border/80',
                    ].join(' ')}
                  >
                    <span>{orgType.emoji}</span>
                    <span className="font-medium">{orgType.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Button
              variant={saved ? 'secondary' : 'primary'}
              fullWidth
              onClick={handleSave}
              loading={saving}
            >
              {saved ? '✓ Uloženo' : 'Uložit změny'}
            </Button>
          </div>
        </Card>
      </section>

      {/* Plan info (read-only for now) */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-cta rounded-full" />
          <h2 className="text-base font-semibold text-text-primary">Plán organizace</h2>
        </div>
        <Card variant="elevated">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Aktuální plán</p>
              <p className="text-2xl font-black text-text-primary">{currentOrg.plan.toUpperCase()}</p>
            </div>
            <button
              disabled
              className="px-4 py-2 border border-border text-text-secondary text-sm rounded-xl opacity-50 cursor-not-allowed"
            >
              Upgrade (připravujeme)
            </button>
          </div>
        </Card>
      </section>

      {/* Slug (read-only) */}
      <section>
        <Card variant="default">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">URL identifikátor</p>
              <p className="text-sm font-mono text-text-primary">/org/{currentOrg.slug}</p>
            </div>
            <p className="text-xs text-text-secondary/50">Nelze změnit</p>
          </div>
        </Card>
      </section>

      {/* Back link */}
      <button
        onClick={() => router.push(`/org/${slug}`)}
        className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors text-center"
      >
        ← Zpět na dashboard organizace
      </button>
    </div>
  );
}

'use client';

// Organization settings page — name, type, business goal, target audience, plan limits.
// Only accessible to org owners and admins.
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useOrgStore } from '@/stores/organization';
import { supabase } from '@/lib/supabase/client';
import { ORG_TYPE_META, ORG_BUSINESS_GOAL_META, ORG_PLAN_META, ORG_PLAN_LIMITS } from '@/constants/org-plans';
import type { OrgType, OrgBusinessGoal } from '@/types';

export default function OrgSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { currentOrg, membership, loading, loadOrg } = useOrgStore();

  const [name, setName] = useState('');
  const [type, setType] = useState<OrgType>('other');
  const [businessGoal, setBusinessGoal] = useState<OrgBusinessGoal | ''>('');
  const [targetAudience, setTargetAudience] = useState('');
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
      setBusinessGoal(currentOrg.settings?.businessGoal ?? '');
      setTargetAudience(currentOrg.settings?.targetAudience ?? '');
    }
  }, [currentOrg]);

  const isAdminOrOwner = membership?.role === 'owner' || membership?.role === 'admin';

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
      const updatedSettings = {
        ...currentOrg.settings,
        businessGoal: businessGoal || undefined,
        targetAudience: targetAudience.trim() || undefined,
      };

      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          name: name.trim(),
          type,
          settings: updatedSettings,
          updated_at: new Date().toISOString(),
        })
        .eq('id', currentOrg.id);

      if (updateError) {
        setError('Nepodařilo se uložit změny.');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
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
        <div className="h-32 bg-surface2 rounded-2xl animate-shimmer border border-border" />
      </div>
    );
  }

  const planLimits = ORG_PLAN_LIMITS[currentOrg.plan];
  const planMeta = ORG_PLAN_META[currentOrg.plan];
  const orgTypes = Object.entries(ORG_TYPE_META) as Array<[OrgType, { label: string; emoji: string }]>;
  const businessGoals = Object.entries(ORG_BUSINESS_GOAL_META) as Array<[OrgBusinessGoal, { label: string; description: string; emoji: string }]>;

  const formatLimit = (n: number) => (n === -1 ? 'Neomezeno' : n.toString());

  return (
    <div className="flex flex-col gap-6 max-w-lg mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-text-primary mb-1">Nastavení organizace</h1>
        <p className="text-text-secondary text-sm">{currentOrg.slug}</p>
      </div>

      {error && (
        <div className="p-4 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Basic info */}
      <section>
        <SectionHeader>Základní informace</SectionHeader>
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
                {orgTypes.map(([value, meta]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setType(value)}
                    className={[
                      'flex items-center gap-2 p-2.5 rounded-xl border transition-all duration-200 text-left text-sm',
                      type === value
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6]/50 text-[#F5F5F5]'
                        : 'bg-surface2 border-border text-text-secondary hover:border-border/80',
                    ].join(' ')}
                  >
                    <span>{meta.emoji}</span>
                    <span className="font-medium">{meta.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Business configuration */}
      <section>
        <SectionHeader>Obchodní konfigurace</SectionHeader>
        <Card variant="elevated">
          <div className="flex flex-col gap-5">
            {/* Business goal */}
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-sm font-medium text-text-primary">Hlavní obchodní cíl</label>
                <p className="text-xs text-text-secondary mt-0.5">Primární záměr vaší organizace</p>
              </div>
              <div className="flex flex-col gap-1.5">
                {businessGoals.map(([value, meta]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setBusinessGoal(value)}
                    className={[
                      'flex items-center gap-3 p-2.5 rounded-xl border transition-all duration-200 text-left',
                      businessGoal === value
                        ? 'bg-[#3B82F6]/10 border-[#3B82F6]/50'
                        : 'bg-surface2 border-border hover:border-border/80',
                    ].join(' ')}
                  >
                    <span className="text-base shrink-0">{meta.emoji}</span>
                    <div>
                      <p className={`text-sm font-medium ${businessGoal === value ? 'text-[#F5F5F5]' : 'text-text-primary'}`}>
                        {meta.label}
                      </p>
                      <p className="text-xs text-text-secondary">{meta.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target audience */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-primary">
                Cílová skupina <span className="text-text-secondary font-normal">(nepovinné)</span>
              </label>
              <textarea
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Kdo jsou vaši koncoví uživatelé nebo klienti?"
                rows={2}
                className="px-4 py-3 bg-[#1D1D22] text-[#F5F5F5] border border-border rounded-xl text-sm placeholder:text-[#A1A1AA]/50 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 focus:border-[#3B82F6]/60 transition-all duration-200 resize-none"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Save button */}
      <Button
        variant={saved ? 'secondary' : 'primary'}
        fullWidth
        onClick={handleSave}
        loading={saving}
      >
        {saved ? '✓ Uloženo' : 'Uložit změny'}
      </Button>

      {/* Plan limits (read-only) */}
      <section>
        <SectionHeader>Plán organizace</SectionHeader>
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Aktuální plán</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-black text-text-primary">{planMeta.name}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${planMeta.color}`}>
                  {currentOrg.plan.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{planMeta.description}</p>
            </div>
            <button
              disabled
              className="px-4 py-2 border border-border text-text-secondary text-sm rounded-xl opacity-50 cursor-not-allowed"
            >
              Upgrade (připravujeme)
            </button>
          </div>

          {/* Limits grid */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <LimitCell
              label="Členů max."
              value={formatLimit(planLimits.maxMembers)}
            />
            <LimitCell
              label="Personál max."
              value={formatLimit(planLimits.maxStaffSeats)}
            />
            <LimitCell
              label="AI zprávy/den"
              value={formatLimit(planLimits.aiMessagesPerMemberPerDay)}
            />
          </div>
        </Card>
      </section>

      {/* URL slug (read-only) */}
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

      <button
        onClick={() => router.push(`/org/${slug}`)}
        className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors text-center"
      >
        ← Zpět na dashboard organizace
      </button>
    </div>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <div className="w-1 h-5 bg-cta rounded-full" />
      <h2 className="text-base font-semibold text-text-primary">{children}</h2>
    </div>
  );
}

function LimitCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-black text-text-primary">{value}</p>
      <p className="text-xs text-text-secondary mt-0.5">{label}</p>
    </div>
  );
}

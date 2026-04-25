'use client';

// Organization dashboard — overview page for org owners, admins, and coaches.
// Shows org info, member count, quick actions, engagement metrics, and plan status.
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useOrgStore } from '@/stores/organization';
import { supabase } from '@/lib/supabase/client';
import { getOrgEngagementSummary, type OrgEngagementSummary } from '@/lib/analytics';
import type { OrgMembership } from '@/types';

const ORG_TYPE_LABELS: Record<string, string> = {
  gym: 'Posilovna / Studio',
  coach: 'Trenér / Koučink',
  brand: 'Wellness značka',
  employer: 'Zaměstnavatel',
  program: 'Transformační program',
  other: 'Organizace',
};

const PLAN_LABELS: Record<string, { label: string; color: string }> = {
  free: { label: 'FREE', color: 'bg-surface2 text-text-secondary border-border' },
  starter: { label: 'STARTER', color: 'bg-blue-900/40 text-blue-400 border-blue-700/40' },
  pro: { label: 'PRO', color: 'bg-[#3B82F6]/20 text-[#3B82F6] border-[#3B82F6]/40' },
  enterprise: { label: 'ENTERPRISE', color: 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40' },
};

export default function OrgDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { currentOrg, membership, members, loading, loadOrg, loadMembers } = useOrgStore();
  const [statsLoading, setStatsLoading] = useState(true);
  const [engagement, setEngagement] = useState<OrgEngagementSummary | null>(null);
  const [engagementLoading, setEngagementLoading] = useState(false);

  useEffect(() => {
    if (slug) {
      loadOrg(slug);
    }
  }, [slug, loadOrg]);

  useEffect(() => {
    if (currentOrg?.id) {
      loadMembers(currentOrg.id).then(() => setStatsLoading(false));
    }
  }, [currentOrg?.id, loadMembers]);

  useEffect(() => {
    if (!currentOrg?.id) return;
    const role = membership?.role;
    if (role !== 'owner' && role !== 'admin') return;
    setEngagementLoading(true);
    getOrgEngagementSummary(supabase, currentOrg.id)
      .then(setEngagement)
      .finally(() => setEngagementLoading(false));
  }, [currentOrg?.id, membership?.role]);

  // Not a member — show access denied
  if (!loading && currentOrg && !membership) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-14 h-14 bg-surface2 border border-border rounded-2xl flex items-center justify-center mx-auto mb-5 text-3xl">
          🔒
        </div>
        <h1 className="text-2xl font-black text-text-primary mb-2">Přístup odepřen</h1>
        <p className="text-text-secondary text-sm mb-6">
          Nejsi členem této organizace.
        </p>
        <Link href="/dashboard">
          <Button variant="primary">Zpět na dashboard</Button>
        </Link>
      </div>
    );
  }

  // Loading
  if (loading || !currentOrg) {
    return (
      <div className="flex flex-col gap-5 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-surface2 rounded-lg animate-shimmer" />
        <div className="h-36 bg-surface2 rounded-2xl animate-shimmer border border-border" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-surface2 rounded-2xl animate-shimmer border border-border" />
          ))}
        </div>
      </div>
    );
  }

  const planInfo = PLAN_LABELS[currentOrg.plan] || PLAN_LABELS.free;
  const activeMembers = members.filter((m) => m.status === 'active');
  const coaches = activeMembers.filter((m) => m.role === 'coach' || m.role === 'admin' || m.role === 'owner');
  const clients = activeMembers.filter((m) => m.role === 'member');
  const isAdminOrOwner = membership?.role === 'owner' || membership?.role === 'admin';

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-text-primary">{currentOrg.name}</h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${planInfo.color}`}>
              {planInfo.label}
            </span>
          </div>
          <p className="text-text-secondary text-sm">
            {ORG_TYPE_LABELS[currentOrg.type] || 'Organizace'} · {currentOrg.slug}
          </p>
        </div>

        {isAdminOrOwner && (
          <Link href={`/org/${slug}/settings`}>
            <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface2 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </Link>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card variant="elevated" padding="sm">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Členů</p>
          <p className="text-2xl font-black text-text-primary">
            {statsLoading ? '...' : activeMembers.length}
          </p>
        </Card>
        <Card variant="elevated" padding="sm">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Koučů</p>
          <p className="text-2xl font-black text-text-primary">
            {statsLoading ? '...' : coaches.length}
          </p>
        </Card>
        <Card variant="elevated" padding="sm">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Klientů</p>
          <p className="text-2xl font-black text-text-primary">
            {statsLoading ? '...' : clients.length}
          </p>
        </Card>
        <Card variant="elevated" padding="sm">
          <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Plán</p>
          <p className="text-2xl font-black text-cta">{planInfo.label}</p>
        </Card>
      </div>

      {/* Quick actions */}
      {isAdminOrOwner && (
        <Card variant="elevated">
          <h2 className="text-base font-semibold text-text-primary mb-4">Rychlé akce</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link href={`/org/${slug}/members`}>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-cta/40 bg-surface2 hover:bg-surface2/80 transition-all duration-200 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-cta/10 border border-cta/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Spravovat členy</p>
                  <p className="text-xs text-text-secondary">Pozvat, spravovat role</p>
                </div>
              </div>
            </Link>

            <Link href={`/org/${slug}/settings`}>
              <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-cta/40 bg-surface2 hover:bg-surface2/80 transition-all duration-200 cursor-pointer">
                <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center">
                  <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.573-1.066z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">Nastavení</p>
                  <p className="text-xs text-text-secondary">Název, typ, plán</p>
                </div>
              </div>
            </Link>
          </div>
        </Card>
      )}

      {/* Engagement metrics (admin/owner only) */}
      {isAdminOrOwner && (
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">Zapojení členů</h2>
            {engagementLoading && (
              <span className="text-xs text-text-secondary/50">Načítám...</span>
            )}
          </div>

          {engagementLoading || !engagement ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-20 bg-surface2 rounded-xl animate-shimmer border border-border" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-surface2 border border-border rounded-xl p-3">
                  <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Celkem členů</p>
                  <p className="text-2xl font-black text-text-primary">{engagement.totalMembers}</p>
                </div>
                <div className="bg-surface2 border border-border rounded-xl p-3">
                  <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Noví (30 dní)</p>
                  <p className="text-2xl font-black text-text-primary">{engagement.newMembersLast30Days}</p>
                </div>
                <div className="bg-surface2 border border-border rounded-xl p-3">
                  <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Onboarding</p>
                  <p className="text-2xl font-black text-cta">
                    {engagement.onboardingCompleted}
                    <span className="text-sm font-medium text-text-secondary ml-1">/ {engagement.totalMembers}</span>
                  </p>
                </div>
                <div className="bg-surface2 border border-border rounded-xl p-3">
                  <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Analýza hotova</p>
                  <p className="text-2xl font-black text-cta">
                    {engagement.analysisCompleted}
                    <span className="text-sm font-medium text-text-secondary ml-1">/ {engagement.totalMembers}</span>
                  </p>
                </div>
              </div>

              {engagement.totalMembers > 0 && (
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">Dokončení onboardingu</span>
                      <span className="text-xs font-semibold text-text-primary">
                        {Math.round(engagement.onboardingRate * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cta rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(engagement.onboardingRate * 100)}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-text-secondary">Aktivace (AI analýza)</span>
                      <span className="text-xs font-semibold text-text-primary">
                        {Math.round(engagement.activationRate * 100)}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
                      <div
                        className="h-full bg-cta/60 rounded-full transition-all duration-500"
                        style={{ width: `${Math.round(engagement.activationRate * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Your role */}
      <Card variant="default">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-lg">
            {membership?.role === 'owner' ? '👑' : membership?.role === 'admin' ? '🛡️' : membership?.role === 'coach' ? '🏋️' : '👤'}
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary">
              Tvoje role: {membership?.role === 'owner' ? 'Vlastník' : membership?.role === 'admin' ? 'Admin' : membership?.role === 'coach' ? 'Kouč' : 'Člen'}
            </p>
            <p className="text-xs text-text-secondary">
              {membership?.joinedAt
                ? `Člen od ${new Date(membership.joinedAt).toLocaleDateString('cs-CZ')}`
                : 'Aktivní člen'}
            </p>
          </div>
        </div>
      </Card>

      {/* Back to personal dashboard */}
      <Link
        href="/dashboard"
        className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors text-center"
      >
        ← Zpět na osobní dashboard
      </Link>
    </div>
  );
}

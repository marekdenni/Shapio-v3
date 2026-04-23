'use client';

// Members management page — view members, invite new ones, change roles.
// Only accessible to org owners and admins.
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { useOrgStore } from '@/stores/organization';
import { supabase } from '@/lib/supabase/client';
import type { OrgRole, OrgMembership } from '@/types';

const ROLE_LABELS: Record<OrgRole, { label: string; emoji: string }> = {
  owner: { label: 'Vlastník', emoji: '👑' },
  admin: { label: 'Admin', emoji: '🛡️' },
  coach: { label: 'Kouč', emoji: '🏋️' },
  member: { label: 'Člen', emoji: '👤' },
};

export default function MembersPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { currentOrg, membership, members, loading, loadOrg, loadMembers } = useOrgStore();

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<OrgRole>('member');
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  // Member profile data for display
  const [memberProfiles, setMemberProfiles] = useState<Record<string, { name: string; email: string }>>({});

  useEffect(() => {
    if (slug) loadOrg(slug);
  }, [slug, loadOrg]);

  useEffect(() => {
    if (currentOrg?.id) {
      loadMembers(currentOrg.id);
    }
  }, [currentOrg?.id, loadMembers]);

  // Load profile data for each member
  useEffect(() => {
    const loadProfiles = async () => {
      if (members.length === 0) return;

      const userIds = members.map((m) => m.userId);
      const { data } = await supabase
        .from('user_profiles')
        .select('id, name, email')
        .in('id', userIds);

      if (data) {
        const profiles: Record<string, { name: string; email: string }> = {};
        data.forEach((p: any) => {
          profiles[p.id] = { name: p.name || '', email: p.email || '' };
        });
        setMemberProfiles(profiles);
      }
    };

    loadProfiles();
  }, [members]);

  const isAdminOrOwner = membership?.role === 'owner' || membership?.role === 'admin';

  // Access check
  if (!loading && currentOrg && !isAdminOrOwner) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-2xl font-black text-text-primary mb-2">Přístup odepřen</h1>
        <p className="text-text-secondary text-sm mb-6">
          Správa členů je dostupná pouze pro vlastníky a adminy.
        </p>
        <Button variant="primary" onClick={() => router.push(`/org/${slug}`)}>
          Zpět na dashboard organizace
        </Button>
      </div>
    );
  }

  const handleInvite = async () => {
    setInviteError(null);
    setInviteSuccess(null);

    if (!inviteEmail.trim()) {
      setInviteError('E-mail je povinný.');
      return;
    }

    setInviting(true);
    try {
      const response = await fetch(`/api/org/${slug}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail.trim(), role: inviteRole }),
      });

      const data = await response.json();

      if (!response.ok) {
        setInviteError(data.error || 'Nepodařilo se odeslat pozvánku.');
        return;
      }

      setInviteSuccess(`Pozvánka odeslána na ${inviteEmail}`);
      setInviteEmail('');
      setInviteRole('member');

      // Reload members
      if (currentOrg?.id) loadMembers(currentOrg.id);

      setTimeout(() => {
        setShowInviteModal(false);
        setInviteSuccess(null);
      }, 1500);
    } catch {
      setInviteError('Nastala neočekávaná chyba.');
    } finally {
      setInviting(false);
    }
  };

  if (loading || !currentOrg) {
    return (
      <div className="flex flex-col gap-5 max-w-3xl mx-auto">
        <div className="h-8 w-48 bg-surface2 rounded-lg animate-shimmer" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-surface2 rounded-2xl animate-shimmer border border-border" />
        ))}
      </div>
    );
  }

  const activeMembers = members.filter((m) => m.status === 'active');
  const invitedMembers = members.filter((m) => m.status === 'invited');

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Členové</h1>
          <p className="text-text-secondary text-sm mt-0.5">
            {currentOrg.name} · {activeMembers.length} aktivních členů
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setShowInviteModal(true)}>
          + Pozvat
        </Button>
      </div>

      {/* Active members */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-cta rounded-full" />
          <h2 className="text-base font-semibold text-text-primary">
            Aktivní ({activeMembers.length})
          </h2>
        </div>

        <div className="flex flex-col gap-2">
          {activeMembers.map((m) => {
            const profile = memberProfiles[m.userId];
            const roleInfo = ROLE_LABELS[m.role];
            return (
              <Card key={m.id} variant="elevated" padding="sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-surface2 border border-border flex items-center justify-center text-sm font-bold text-text-primary shrink-0">
                    {profile?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {profile?.name || 'Neznámý'}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      {profile?.email || '—'}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-surface2 border border-border text-text-secondary shrink-0">
                    <span>{roleInfo.emoji}</span>
                    {roleInfo.label}
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Invited (pending) */}
      {invitedMembers.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 bg-yellow-500 rounded-full" />
            <h2 className="text-base font-semibold text-text-primary">
              Čekající ({invitedMembers.length})
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {invitedMembers.map((m) => {
              const roleInfo = ROLE_LABELS[m.role];
              return (
                <Card key={m.id} variant="default" padding="sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-900/20 border border-yellow-700/30 flex items-center justify-center text-sm shrink-0">
                      ⏳
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-secondary truncate">
                        {m.invitedEmail || '—'}
                      </p>
                      <p className="text-xs text-text-secondary/60">
                        Pozváno {m.invitedAt ? new Date(m.invitedAt).toLocaleDateString('cs-CZ') : ''}
                      </p>
                    </div>
                    <span className="text-xs text-text-secondary/60 shrink-0">
                      {roleInfo.label}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Back link */}
      <button
        onClick={() => router.push(`/org/${slug}`)}
        className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors text-center"
      >
        ← Zpět na dashboard organizace
      </button>

      {/* Invite modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => {
          setShowInviteModal(false);
          setInviteError(null);
          setInviteSuccess(null);
        }}
        title="Pozvat člena"
      >
        <div className="flex flex-col gap-4">
          {inviteError && (
            <div className="p-3 bg-red-950/30 border border-red-800/50 rounded-xl text-sm text-red-400">
              {inviteError}
            </div>
          )}
          {inviteSuccess && (
            <div className="p-3 bg-green-950/30 border border-green-800/50 rounded-xl text-sm text-green-400">
              {inviteSuccess}
            </div>
          )}

          <Input
            label="E-mail"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="jmeno@email.cz"
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-primary">Role</label>
            <div className="flex gap-2">
              {(['member', 'coach', 'admin'] as OrgRole[]).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setInviteRole(r)}
                  className={[
                    'flex-1 py-2 px-3 rounded-xl border text-sm font-medium transition-all duration-200',
                    inviteRole === r
                      ? 'bg-[#B3263E]/10 border-[#B3263E]/50 text-[#F5F5F5]'
                      : 'bg-surface2 border-border text-text-secondary hover:border-border/80',
                  ].join(' ')}
                >
                  {ROLE_LABELS[r].emoji} {ROLE_LABELS[r].label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowInviteModal(false)}
            >
              Zrušit
            </Button>
            <Button
              variant="primary"
              fullWidth
              onClick={handleInvite}
              loading={inviting}
              disabled={!inviteEmail.trim()}
            >
              Pozvat
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

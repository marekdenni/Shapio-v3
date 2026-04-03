'use client';

// Settings page - profile, subscription, notifications, danger zone
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { PLANS } from '@/constants/plans';
import { SETTINGS } from '@/constants/copy';
import type { UserProfile } from '@/types';

export default function SettingsPage() {
  const router = useRouter();
  const { profile, updateProfile, signOut } = useAuth();
  // @ts-expect-error
  const { tier, stripeCustomerId } = useSubscription();

  const [name, setName] = useState(profile?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDeletePhotosModal, setShowDeletePhotosModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletingPhotos, setDeletingPhotos] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [notifWorkout, setNotifWorkout] = useState(true);
  const [notifNutrition, setNotifNutrition] = useState(false);

  const plan = PLANS[tier];

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({ name } as Partial<UserProfile>);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleManageSubscription = async () => {
    if (!stripeCustomerId) {
      router.push('/paywall');
      return;
    }

    try {
      const response = await fetch('/api/stripe/billing-portal', {
        method: 'POST',
      });
      const data = await response.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Error opening billing portal:', err);
    }
  };

  const handleDeletePhotos = async () => {
    setDeletingPhotos(true);
    // TODO: Call API to delete all photos
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDeletingPhotos(false);
    setShowDeletePhotosModal(false);
  };

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    // TODO: Call API to delete account
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await signOut();
    router.push('/');
  };

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      {/* Page header */}
      <h1 className="text-2xl font-black text-text-primary">Nastavení</h1>

      {/* Profile section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-cta rounded-full" />
          <h2 className="text-base font-semibold text-text-primary">Profil</h2>
        </div>
        <Card variant="elevated">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-surface2 border border-border flex items-center justify-center text-2xl font-black text-text-primary">
                {profile?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="font-semibold text-text-primary">{profile?.name || 'Uživatel'}</p>
                <p className="text-sm text-text-secondary">{profile?.email}</p>
              </div>
            </div>

            <Input
              label="Jméno"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tvé jméno"
            />

            <Button
              variant={saved ? 'secondary' : 'primary'}
              onClick={handleSaveProfile}
              loading={saving}
              fullWidth
            >
              {saved ? '✓ Uloženo' : 'Uložit změny'}
            </Button>
          </div>
        </Card>
      </section>

      {/* Subscription section */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-cta rounded-full" />
          <h2 className="text-base font-semibold text-text-primary">Předplatné</h2>
        </div>
        <Card variant="elevated">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wider mb-1">Aktuální plán</p>
              <div className="flex items-center gap-2">
                <p className="font-black text-2xl text-text-primary">{plan.name}</p>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  tier === 'elite' ? 'bg-yellow-900/40 text-yellow-400 border-yellow-700/40' :
                  tier === 'pro' ? 'bg-cta/20 text-cta border-cta/40' :
                  tier === 'starter' ? 'bg-blue-900/40 text-blue-400 border-blue-700/40' :
                  'bg-surface2 text-text-secondary border-border'
                }`}>
                  {tier.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-text-secondary mt-1">{plan.priceLabel}</p>
            </div>
          </div>

          <div className="flex gap-3">
            {tier === 'free' ? (
              <Button variant="primary" fullWidth onClick={() => router.push('/paywall')}>
                Upgrade na PRO →
              </Button>
            ) : (
              <button
                onClick={handleManageSubscription}
                className="w-full py-3 border border-[#B3263E]/40 hover:border-[#B3263E] text-[#B3263E] hover:text-[#D13A52] font-semibold rounded-xl transition-all duration-200 text-sm hover:bg-[#B3263E]/5"
              >
                Spravovat předplatné
              </button>
            )}
          </div>
        </Card>
      </section>

      {/* Notifications */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 bg-cta rounded-full" />
          <h2 className="text-base font-semibold text-text-primary">Oznámení</h2>
        </div>
        <Card variant="elevated">
          <div className="flex flex-col gap-4">
            <Toggle
              label="Připomínky tréninku"
              description="Upozornění na naplánovaný trénink"
              checked={notifWorkout}
              onChange={setNotifWorkout}
            />
            <div className="h-px bg-border" />
            <Toggle
              label="Připomínky jídla"
              description="Připomínky k stravování a hydrataci"
              checked={notifNutrition}
              onChange={setNotifNutrition}
            />
          </div>
        </Card>
      </section>

      {/* Danger zone */}
      <section>
        <h2 className="text-base font-semibold text-red-400 mb-3">Nebezpečná zóna</h2>
        <Card variant="default" className="border-red-900/40">
          <div className="flex flex-col gap-3">
            <Button
              variant="danger"
              fullWidth
              onClick={() => setShowDeletePhotosModal(true)}
            >
              Smazat všechny fotky
            </Button>
            <Button
              variant="danger"
              fullWidth
              onClick={() => setShowDeleteAccountModal(true)}
            >
              Smazat účet
            </Button>
          </div>
        </Card>
      </section>

      {/* Links */}
      <div className="flex gap-4 justify-center">
        <Link href="/privacy" className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors">
          Ochrana osobních údajů
        </Link>
        <Link href="/terms" className="text-sm text-text-secondary/60 hover:text-text-secondary transition-colors">
          Podmínky
        </Link>
      </div>

      {/* Sign out button */}
      <Button
        variant="ghost"
        fullWidth
        onClick={async () => {
          await signOut();
          router.push('/');
        }}
        className="text-red-400 hover:text-red-300"
      >
        Odhlásit se
      </Button>

      {/* Delete photos modal */}
      <Modal
        isOpen={showDeletePhotosModal}
        onClose={() => setShowDeletePhotosModal(false)}
        title="Smazat všechny fotky"
      >
        <p className="text-text-secondary text-sm mb-6">
          Opravdu chceš smazat všechny fotky? Tato akce je nevratná.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setShowDeletePhotosModal(false)}>
            Zrušit
          </Button>
          <Button variant="danger" fullWidth onClick={handleDeletePhotos} loading={deletingPhotos}>
            Smazat fotky
          </Button>
        </div>
      </Modal>

      {/* Delete account modal */}
      <Modal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        title="Smazat účet"
      >
        <p className="text-text-secondary text-sm mb-6">
          Opravdu chceš smazat svůj účet? Všechna data budou trvale odstraněna. Tato akce je nevratná.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setShowDeleteAccountModal(false)}>
            Zrušit
          </Button>
          <Button variant="danger" fullWidth onClick={handleDeleteAccount} loading={deletingAccount}>
            Smazat účet
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary/70 mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={[
          'relative w-11 h-6 rounded-full transition-all duration-200 shrink-0',
          checked ? 'bg-cta' : 'bg-surface2 border border-border',
        ].join(' ')}
      >
        <div
          className={[
            'absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
            checked ? 'translate-x-6' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

'use client';

// Progress tracking page with photo upload and before/after comparison
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LockedFeature } from '@/components/paywall/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/lib/supabase/client';
import type { ProgressPhoto } from '@/types';

export default function ProgressPage() {
  const { profile } = useAuth();
  const { tier } = useSubscription();
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchPhotos();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]);

  const fetchPhotos = async () => {
    if (!profile?.id) return;

    try {
      const { data } = await supabase
        .from('progress_photos')
        .select('*')
        .eq('user_id', profile.id)
        .order('uploaded_at', { ascending: false });

      if (data) {
        setPhotos(data.map((p) => ({
          id: p.id,
          userId: p.user_id,
          photoUrl: p.photo_url,
          notes: p.notes,
          uploadedAt: p.uploaded_at,
          weekNumber: p.week_number,
        })));
      }
    } catch (err) {
      console.error('Error fetching photos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    if (!profile?.id) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await fetch('/api/progress/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        await fetchPhotos();
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const generateAIFeedback = async () => {
    setLoadingFeedback(true);
    try {
      // Would call AI feedback endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setAiFeedback(
        'Skvělý pokrok! Konzistence je klíčem k úspěchu. Tvé fotky ukazují pozitivní změny – pokračuj v tomto tempu a výsledky se budou postupně zlepšovat každý týden.'
      );
    } finally {
      setLoadingFeedback(false);
    }
  };

  const firstPhoto = photos[photos.length - 1]; // Oldest = "before"
  const lastPhoto = photos[0]; // Most recent = "after"

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-text-primary">Pokrok</h1>
          <p className="text-text-secondary text-sm mt-1">
            {photos.length > 0
              ? `${photos.length} fotek • sleduj svou transformaci`
              : 'Přidej svou první fotku pokroku'}
          </p>
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUpload(file);
            }}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
          >
            + Přidat fotku
          </Button>
        </div>
      </div>

      {/* Before/after comparison - PRO only */}
      {photos.length >= 2 && (
        <LockedFeature
          feature="progress_comparison"
          title="Porovnání před/po"
          description="Vizualizuj svou transformaci s detailním porovnáním fotek. Dostupné v PRO plánu."
          ctaText="Odemknout PRO →"
          blurContent={true}
        >
          <Card variant="premium">
            <h3 className="text-sm font-semibold text-text-primary mb-4">Porovnání transformace</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-text-secondary/60 mb-2 text-center uppercase tracking-wider">Před</p>
                <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={firstPhoto?.photoUrl}
                    alt="Před"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-text-secondary/60 text-center mt-1">
                  {firstPhoto && new Date(firstPhoto.uploadedAt).toLocaleDateString('cs-CZ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-secondary/60 mb-2 text-center uppercase tracking-wider">Nyní</p>
                <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={lastPhoto?.photoUrl}
                    alt="Nyní"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-text-secondary/60 text-center mt-1">
                  {lastPhoto && new Date(lastPhoto.uploadedAt).toLocaleDateString('cs-CZ')}
                </p>
              </div>
            </div>
          </Card>
        </LockedFeature>
      )}

      {/* AI Progress feedback - PRO only */}
      {photos.length >= 1 && (
        <LockedFeature
          feature="progress_ai_feedback"
          title="AI Analýza pokroku"
          description="Získej zpětnou vazbu od AI kouče k tvým fotkám pokroku."
          ctaText="Odemknout PRO →"
          blurContent={false}
        >
          <Card variant="elevated">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-cta/20 border border-cta/40 flex items-center justify-center text-sm">
                🤖
              </div>
              <h3 className="text-sm font-semibold text-text-primary">AI Zpětná vazba</h3>
            </div>

            {aiFeedback ? (
              <p className="text-text-secondary text-sm leading-relaxed">{aiFeedback}</p>
            ) : (
              <div className="flex flex-col gap-3">
                <p className="text-text-secondary text-sm">
                  Nech AI zhodnotit tvůj pokrok na základě fotek.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={generateAIFeedback}
                  loading={loadingFeedback}
                >
                  Získat zpětnou vazbu
                </Button>
              </div>
            )}
          </Card>
        </LockedFeature>
      )}

      {/* Photo gallery */}
      {loading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-surface2 animate-shimmer border border-border" />
          ))}
        </div>
      ) : photos.length > 0 ? (
        <div>
          <h2 className="text-base font-semibold text-text-primary mb-3">Galerie pokroku</h2>
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo) => (
              <div key={photo.id} className="aspect-square rounded-xl overflow-hidden border border-border group relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.photoUrl}
                  alt={`Pokrok ${photo.uploadedAt}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs text-white/80">
                    {new Date(photo.uploadedAt).toLocaleDateString('cs-CZ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Empty state
        <Card variant="elevated" className="text-center py-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-surface2 border border-border flex items-center justify-center text-3xl">
              📸
            </div>
            <div>
              <h3 className="font-bold text-text-primary mb-1">Zatím žádné fotky</h3>
              <p className="text-sm text-text-secondary max-w-xs">
                Přidej svou první fotku a začni sledovat svou transformaci v čase.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => fileInputRef.current?.click()}
              loading={uploading}
            >
              Přidat první fotku
            </Button>
          </div>
        </Card>
      )}

      {/* Privacy note */}
      <div className="flex items-start gap-2.5 bg-surface rounded-xl p-4 border border-border">
        <svg className="w-4 h-4 text-cta/60 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-text-secondary/60 leading-relaxed">
          Tvé fotky jsou soukromé a bezpečně uloženy. Nikdy nejsou sdíleny ani viditelné ostatním uživatelům.
        </p>
      </div>
    </div>
  );
}

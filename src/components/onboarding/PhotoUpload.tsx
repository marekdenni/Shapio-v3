'use client';

// Photo upload component with drag-and-drop, preview, and consent
import React, { useCallback, useRef, useState } from 'react';

interface PhotoUploadProps {
  photos: File[];
  photoConsent: boolean;
  onPhotosChange: (photos: File[]) => void;
  onConsentChange: (consent: boolean) => void;
}

export function PhotoUpload({
  photos,
  photoConsent,
  onPhotosChange,
  onConsentChange,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

  const handleFiles = useCallback(
    (files: FileList) => {
      setError(null);
      const validFiles: File[] = [];

      Array.from(files).forEach((file) => {
        if (!file.type.startsWith('image/')) {
          setError('Pouze obrázky jsou povoleny.');
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setError('Fotka je příliš velká. Maximum je 10 MB.');
          return;
        }
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        onPhotosChange([...photos, ...validFiles].slice(0, 3)); // max 3 photos
      }
    },
    [photos, onPhotosChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemovePhoto = (index: number) => {
    const updated = photos.filter((_, i) => i !== index);
    onPhotosChange(updated);
    if (updated.length === 0) onConsentChange(false);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Upload area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={[
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-cta bg-cta/5'
            : 'border-border hover:border-border/60 hover:bg-surface2/50',
        ].join(' ')}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          aria-label="Nahrát fotku"
        />

        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-surface2 border border-border flex items-center justify-center">
            <svg className="w-7 h-7 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-text-primary">Přetáhni fotku sem</p>
            <p className="text-sm text-text-secondary mt-1">nebo klikni pro výběr souboru</p>
          </div>
          <p className="text-xs text-text-secondary/60">JPG, PNG, WEBP • Max 10 MB</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center">{error}</p>
      )}

      {/* Photo previews */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {photos.map((photo, i) => {
            const url = URL.createObjectURL(photo);
            return (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`Výchozí fotka ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemovePhoto(i);
                  }}
                  className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Odstranit fotku"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Consent checkbox */}
      {photos.length > 0 && (
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              checked={photoConsent}
              onChange={(e) => onConsentChange(e.target.checked)}
              className="sr-only"
            />
            <div
              className={[
                'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                photoConsent ? 'bg-cta border-cta' : 'bg-surface2 border-border group-hover:border-cta/50',
              ].join(' ')}
            >
              {photoConsent && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-text-secondary leading-relaxed">
            Souhlasím se zpracováním fotografie pro účely personalizace mého plánu.
            Fotky nejsou sdíleny s třetími stranami.
          </span>
        </label>
      )}

      {/* Privacy note */}
      <div className="flex items-start gap-2.5 bg-surface2 rounded-xl p-4 border border-border">
        <svg className="w-4 h-4 text-cta mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <p className="text-xs text-text-secondary">
          Tvé fotky jsou uloženy bezpečně a soukromě. Nikdy je nesdílíme třetím stranám.
          Fotku můžeš přidat i później z aplikace.
        </p>
      </div>
    </div>
  );
}

export default PhotoUpload;

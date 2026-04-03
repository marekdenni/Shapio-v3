'use client';

// Before/After comparison slider component
// Drag the handle to reveal the "after" image underneath
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function ComparisonSlider({
  beforeImage,
  afterImage,
  beforeLabel = 'Před',
  afterLabel = 'Po',
  className = '',
}: ComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // 0–100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate position as percentage from mouse/touch X relative to container
  const calcPosition = useCallback((clientX: number): number => {
    if (!containerRef.current) return 50;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    return pct;
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setSliderPosition(calcPosition(e.clientX));
  }, [calcPosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setSliderPosition(calcPosition(e.touches[0].clientX));
  }, [calcPosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setSliderPosition(calcPosition(e.clientX));
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      setSliderPosition(calcPosition(e.touches[0].clientX));
    };

    const handleTouchEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, calcPosition]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl select-none cursor-col-resize aspect-[4/3] ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Before image (full width — sits behind) */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={beforeImage}
          alt={beforeLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* Before label */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 rounded-lg text-white text-xs font-semibold backdrop-blur-sm">
          {beforeLabel}
        </div>
      </div>

      {/* After image (clipped to sliderPosition) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={afterImage}
          alt={afterLabel}
          className="w-full h-full object-cover"
          draggable={false}
        />
        {/* After label */}
        <div className="absolute top-4 right-4 px-3 py-1.5 bg-[#B3263E]/80 rounded-lg text-white text-xs font-semibold backdrop-blur-sm">
          {afterLabel}
        </div>
      </div>

      {/* Slider handle line + circle */}
      <div
        className="absolute inset-y-0 z-10 flex flex-col items-center pointer-events-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Vertical line */}
        <div className="absolute inset-y-0 w-0.5 bg-white/80 shadow-[0_0_8px_rgba(0,0,0,0.5)]" />

        {/* Circle handle */}
        <div className="absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#B3263E] border-2 border-white shadow-[0_0_20px_rgba(179,38,62,0.6)] flex items-center justify-center">
          {/* Left/right arrows */}
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 9l-3 3m0 0l3 3m-3-3h14M16 9l3 3m0 0l-3 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default ComparisonSlider;

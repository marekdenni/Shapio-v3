'use client';

// Dashboard card showing today's workout
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { WorkoutDay } from '@/types';

interface TodayWorkoutCardProps {
  workout?: WorkoutDay;
  currentDay?: number;
  totalDays?: number;
}

export function TodayWorkoutCard({
  workout,
  currentDay = 1,
  totalDays = 30,
}: TodayWorkoutCardProps) {
  // If no workout data, show placeholder
  if (!workout) {
    return (
      <Card variant="elevated" className="animate-pulse">
        <div className="h-4 bg-border rounded w-1/3 mb-3" />
        <div className="h-6 bg-border rounded w-2/3 mb-2" />
        <div className="h-4 bg-border rounded w-1/2" />
      </Card>
    );
  }

  if (workout.isRestDay) {
    return (
      <Card variant="elevated">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center text-2xl">
            😴
          </div>
          <div>
            <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">
              Den {currentDay} z {totalDays}
            </p>
            <h3 className="text-lg font-bold text-text-primary">Den odpočinku</h3>
            <p className="text-sm text-text-secondary">Dopřej tělu zotavení. Jsi na správné cestě!</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-xs text-text-secondary font-medium uppercase tracking-wider mb-1">
            Den {currentDay} z {totalDays}
          </p>
          <h3 className="text-lg font-bold text-text-primary">{workout.workoutType || workout.dayName}</h3>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-text-secondary flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {workout.durationMinutes || 45} min
            </span>
            <span className="text-sm text-text-secondary flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              {workout.exercises.length} cviků
            </span>
          </div>
        </div>

        {/* Workout type icon */}
        <div className="w-12 h-12 rounded-xl bg-cta/10 border border-cta/30 flex items-center justify-center text-2xl shrink-0">
          💪
        </div>
      </div>

      {/* First 3 exercises preview */}
      <div className="flex flex-col gap-1.5 mb-4">
        {workout.exercises.slice(0, 3).map((exercise, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">{exercise.name}</span>
            <span className="text-text-secondary/70 font-mono text-xs">
              {exercise.sets} × {exercise.reps}
            </span>
          </div>
        ))}
        {workout.exercises.length > 3 && (
          <p className="text-xs text-text-secondary/60 mt-1">
            +{workout.exercises.length - 3} dalších cviků
          </p>
        )}
      </div>

      <Link href="/plan">
        <Button variant="primary" fullWidth size="md">
          Zahájit trénink →
        </Button>
      </Link>
    </Card>
  );
}

export default TodayWorkoutCard;

'use client';

// Zustand store for onboarding flow state management
import { create } from 'zustand';
import type {
  OnboardingData,
  FitnessGoal,
  FitnessLevel,
  Equipment,
  DietaryPreference,
  Sex,
  UserProfile,
} from '@/types';

// Total number of onboarding steps (0-indexed)
const TOTAL_STEPS = 6;

interface OnboardingState extends OnboardingData {
  currentStep: number;
  isSubmitting: boolean;

  // Actions
  setField: <K extends keyof OnboardingData>(field: K, value: OnboardingData[K]) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  setSubmitting: (value: boolean) => void;

  // Derived
  canGoNext: () => boolean;
  toProfile: () => Partial<UserProfile>;
}

const initialState: OnboardingData = {
  photos: [],
  photoConsent: false,
  goal: null,
  sex: null,
  age: null,
  heightCm: null,
  weightKg: null,
  fitnessLevel: null,
  equipment: null,
  workoutDaysPerWeek: null,
  dietaryPreference: null,
  injuries: '',
  targetMotivation: '',
};

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  ...initialState,
  currentStep: 0,
  isSubmitting: false,

  setField: (field, value) => {
    set({ [field]: value } as Partial<OnboardingState>);
  },

  nextStep: () => {
    const { currentStep } = get();
    if (currentStep < TOTAL_STEPS - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  reset: () => {
    set({ ...initialState, currentStep: 0, isSubmitting: false });
  },

  setSubmitting: (value: boolean) => {
    set({ isSubmitting: value });
  },

  canGoNext: () => {
    const state = get();
    switch (state.currentStep) {
      case 0: return true; // Welcome screen
      case 1: {
        // Photos are optional but consent must be given if photos are uploaded
        if (state.photos.length > 0 && !state.photoConsent) return false;
        return true;
      }
      case 2: {
        // Goal + basic info
        return !!(
          state.goal &&
          state.sex &&
          state.age &&
          state.age >= 16 &&
          state.age <= 80 &&
          state.heightCm &&
          state.heightCm > 100 &&
          state.weightKg &&
          state.weightKg > 30
        );
      }
      case 3: {
        // Fitness details
        return !!(
          state.fitnessLevel &&
          state.equipment &&
          state.workoutDaysPerWeek &&
          state.workoutDaysPerWeek >= 1 &&
          state.workoutDaysPerWeek <= 7
        );
      }
      case 4: {
        // Preferences - dietary preference is required
        return !!state.dietaryPreference;
      }
      default: return true;
    }
  },

  toProfile: () => {
    const state = get();
    return {
      goal: state.goal || 'general_fitness',
      sex: state.sex || 'male',
      age: state.age || 25,
      heightCm: state.heightCm || 175,
      weightKg: state.weightKg || 80,
      fitnessLevel: state.fitnessLevel || 'beginner',
      equipment: state.equipment || 'gym_full',
      workoutDaysPerWeek: state.workoutDaysPerWeek || 3,
      dietaryPreference: state.dietaryPreference || 'no_preference',
      injuries: state.injuries || '',
      targetMotivation: state.targetMotivation || '',
      onboardingCompleted: false,
    };
  },
}));

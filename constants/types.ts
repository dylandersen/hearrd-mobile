  export interface JournalEntry {
    id: string;
    timestamp: number;
    transcript: string;
    audioFileId: string | null;
    audioUrl: string | null;
    durationSeconds: number;
    deviceType: 'mobile';
    analysis: {
      mood: string;
      themes: string[];
      emoji: string;
      color: string;
      reflection: string;
      keyMoments: {
        wins: string[];
        worries: string[];
        goals: string[];
      };
    };
    echo?: {
      text: string;
      type: 'theme' | 'mood' | 'time';
    };
  }
  
  export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    hasCompletedOnboarding: boolean;
    onboardingGoals: string[];
    attribution: string;
    ageRange: string;
    lifeStage: string;
    currentStruggles: string[];
    createdAt: number;
  }
  
  export interface OnboardingGoal {
    id: string;
    title: string;
    emoji: string;
  }
  
  export const ONBOARDING_GOALS: OnboardingGoal[] = [
    { id: 'clear_head', title: 'Clear head', emoji: '🧘' },
    { id: 'understand_self', title: 'Understand self', emoji: '🪞' },
    { id: 'vent', title: 'Vent', emoji: '💨' },
    { id: 'remember_moments', title: 'Remember moments', emoji: '✨' },
    { id: 'grow', title: 'Grow', emoji: '🌱' },
    { id: 'stay_on_track', title: 'Stay on track', emoji: '🎯' },
  ];
  
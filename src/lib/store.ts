import { create } from 'zustand';
import type { UserProfile, TranscriptChunk, Story, Outputs, Assignment } from './schemas';

interface AppState {
  // Data
  profile: UserProfile;
  transcript: TranscriptChunk[];
  storyBank: Story[];
  outputsByStoryId: Record<string, Outputs>;
  assignments: Assignment;
  
  // Onboarding
  isOnboardingComplete: boolean;
  onboardingStep: 1 | 1.5 | 2 | 3;
  
  // UI
  loading: boolean;
  error?: string;
  activeTab: "story-bank" | "calendar" | "output";
  selectedStoryId?: string;
  selectedOutputFormat?: "linkedin" | "instagram" | "tiktok" | "brief";
  
  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  setTranscript: (transcript: TranscriptChunk[]) => void;
  setStoryBank: (stories: Story[]) => void;
  setOutputs: (storyId: string, outputs: Outputs) => void;
  setAssignments: (assignments: Assignment | ((prev: Assignment) => Assignment)) => void;
  updateStory: (story: Story) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  setActiveTab: (tab: "story-bank" | "calendar" | "output") => void;
  setSelectedStory: (storyId?: string) => void;
  setSelectedOutputFormat: (format?: "linkedin" | "instagram" | "tiktok" | "brief") => void;
  setOnboardingComplete: (complete: boolean) => void;
  setOnboardingStep: (step: 1 | 1.5 | 2 | 3) => void;
  restartOnboarding: () => void;
  reset: () => void;
}

const initialProfile: UserProfile = {
  name: '',
  role: '',
  platforms: []
};

// Migration utility to convert legacy stories to new format
const migrateStory = (story: any): Story => {
  // If it's already in new format, return as is
  if (story.histoire !== undefined) {
    return story as Story;
  }
  
  // Convert legacy format
  const migrated: Story = {
    id: story.id,
    histoire: story.title || story.hook || '',
    conflit: story.conflict || '',
    message: story.moral || story.message || '',
    platform: story.platform || 'Generic',
    color: story.color || '#3B82F6',
    tags: story.tags || []
  };

  // Calculate score for bento grid sizing
  migrated.score = calculateStoryScore(migrated);
  
  return migrated;
};

// Heuristic score calculation for bento grid sizing
const calculateStoryScore = (story: Story): number => {
  let score = 0;
  
  // Length of histoire contributes to score
  score += story.histoire.length > 80 ? 0.2 : 0;
  
  // Presence of conflit adds to score
  score += story.conflit ? 0.3 : 0;
  
  // Presence of message adds to score
  score += story.message ? 0.3 : 0;
  
  // Tags contribute to score
  score += (story.tags?.length || 0) > 0 ? 0.2 : 0;
  
  return score;
};

// Load persisted data from localStorage
const loadPersistedData = () => {
  try {
    const assignments = localStorage.getItem('onetake-assignments');
    const stories = localStorage.getItem('onetake-stories');
    const onboardingComplete = localStorage.getItem('onetake-onboarding-complete');
    const profile = localStorage.getItem('onetake-profile');
    
    return {
      assignments: assignments ? JSON.parse(assignments) : {},
      stories: stories ? JSON.parse(stories).map(migrateStory) : [],
      isOnboardingComplete: onboardingComplete === 'true',
      profile: profile ? JSON.parse(profile) : initialProfile
    };
  } catch {
    return {
      assignments: {},
      stories: [],
      isOnboardingComplete: false,
      profile: initialProfile
    };
  }
};

// Save data to localStorage
const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to save ${key} to localStorage:`, error);
  }
};

const persistedData = loadPersistedData();

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  profile: persistedData.profile,
  transcript: [],
  storyBank: persistedData.stories,
  outputsByStoryId: {},
  assignments: persistedData.assignments,
  isOnboardingComplete: persistedData.isOnboardingComplete,
  onboardingStep: 1,
  loading: false,
  error: undefined,
  activeTab: "story-bank",
  selectedStoryId: undefined,
  selectedOutputFormat: undefined,
  
  // Actions
  setProfile: (profileUpdate) => {
    const newProfile = { ...get().profile, ...profileUpdate };
    saveToLocalStorage('onetake-profile', newProfile);
    set({ profile: newProfile });
  },
     
  setTranscript: (transcript) => set({ transcript }),
  
  setStoryBank: (storyBank) => {
    saveToLocalStorage('onetake-stories', storyBank);
    set({ storyBank });
  },
  
  setOutputs: (storyId, outputs) =>
    set((state) => ({
      outputsByStoryId: {
        ...state.outputsByStoryId,
        [storyId]: outputs
      }
    })),

  setAssignments: (assignments: Assignment | ((prev: Assignment) => Assignment)) => {
    const newAssignments = typeof assignments === 'function' 
      ? assignments(get().assignments) 
      : assignments;
    saveToLocalStorage('onetake-assignments', newAssignments);
    set({ assignments: newAssignments });
  },

  updateStory: (updatedStory) => {
    const newStoryBank = get().storyBank.map(story => 
      story.id === updatedStory.id ? updatedStory : story
    );
    saveToLocalStorage('onetake-stories', newStoryBank);
    set({ storyBank: newStoryBank });
  },
    
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setActiveTab: (activeTab) => set({ activeTab }),
  
  setSelectedStory: (selectedStoryId) => set({ selectedStoryId }),
  
  setSelectedOutputFormat: (selectedOutputFormat) => set({ selectedOutputFormat }),
  
  setOnboardingComplete: (complete: boolean) => {
    saveToLocalStorage('onetake-onboarding-complete', complete);
    set({ isOnboardingComplete: complete });
  },
  
  setOnboardingStep: (step: 1 | 1.5 | 2 | 3) => set({ onboardingStep: step }),
  
  restartOnboarding: () => {
    saveToLocalStorage('onetake-onboarding-complete', false);
    set({ 
      isOnboardingComplete: false, 
      onboardingStep: 1,
      activeTab: 'story-bank'
    });
  },
  
  reset: () => {
    localStorage.removeItem('onetake-assignments');
    localStorage.removeItem('onetake-stories');
    localStorage.removeItem('onetake-onboarding-complete');
    localStorage.removeItem('onetake-profile');
    set({
      profile: initialProfile,
      transcript: [],
      storyBank: [],
      outputsByStoryId: {},
      assignments: {},
      isOnboardingComplete: false,
      onboardingStep: 1,
      loading: false,
      error: undefined,
      activeTab: "story-bank",
      selectedStoryId: undefined,
      selectedOutputFormat: undefined,
    });
  },
}));
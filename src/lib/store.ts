import { create } from 'zustand';
import type { UserProfile, TranscriptChunk, Story, Outputs, Assignment } from './schemas';

interface AppState {
  // Data
  profile: UserProfile;
  transcript: TranscriptChunk[];
  storyBank: Story[];
  outputsByStoryId: Record<string, Outputs>;
  assignments: Assignment;
  
  // UI
  loading: boolean;
  error?: string;
  activeTab: "onboarding" | "interview" | "story-bank" | "calendar" | "output";
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
  setActiveTab: (tab: "onboarding" | "interview" | "story-bank" | "calendar" | "output") => void;
  setSelectedStory: (storyId?: string) => void;
  setSelectedOutputFormat: (format?: "linkedin" | "instagram" | "tiktok" | "brief") => void;
  reset: () => void;
}

const initialProfile: UserProfile = {
  name: '',
  short_bio: '',
  tone: 'friendly',
  objectives: [],
  platforms: []
};

// Load persisted assignments from localStorage
const loadAssignments = (): Assignment => {
  try {
    const saved = localStorage.getItem('onetake-assignments');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

// Save assignments to localStorage
const saveAssignments = (assignments: Assignment) => {
  try {
    localStorage.setItem('onetake-assignments', JSON.stringify(assignments));
  } catch (error) {
    console.warn('Failed to save assignments to localStorage:', error);
  }
};

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  profile: initialProfile,
  transcript: [],
  storyBank: [],
  outputsByStoryId: {},
  assignments: loadAssignments(),
  loading: false,
  error: undefined,
  activeTab: "onboarding",
  selectedStoryId: undefined,
  selectedOutputFormat: undefined,
  
  // Actions
  setProfile: (profileUpdate) =>
    set((state) => ({ 
      profile: { ...state.profile, ...profileUpdate } 
    })),
    
  setTranscript: (transcript) => set({ transcript }),
  
  setStoryBank: (storyBank) => set({ storyBank }),
  
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
    saveAssignments(newAssignments);
    set({ assignments: newAssignments });
  },

  updateStory: (updatedStory) =>
    set((state) => ({
      storyBank: state.storyBank.map(story => 
        story.id === updatedStory.id ? updatedStory : story
      )
    })),
    
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setActiveTab: (activeTab) => set({ activeTab }),
  
  setSelectedStory: (selectedStoryId) => set({ selectedStoryId }),
  
  setSelectedOutputFormat: (selectedOutputFormat) => set({ selectedOutputFormat }),
  
  reset: () => {
    localStorage.removeItem('onetake-assignments');
    set({
      profile: initialProfile,
      transcript: [],
      storyBank: [],
      outputsByStoryId: {},
      assignments: {},
      loading: false,
      error: undefined,
      activeTab: "onboarding",
      selectedStoryId: undefined,
      selectedOutputFormat: undefined,
    });
  },
}));
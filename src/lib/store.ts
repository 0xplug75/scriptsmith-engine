import { create } from 'zustand';

export type UserProfile = {
  name: string;
  short_bio: string;
  tone: "serious" | "punchy" | "friendly" | "bold";
  objectives: string[];
  platforms: ("LinkedIn" | "Instagram" | "TikTok")[];
  cv_url?: string;
  assets?: string[];
};

export type TranscriptChunk = {
  id: string;
  start?: number;
  end?: number;
  text: string;
};

export type Story = {
  id: string;
  title: string;
  hook: string;
  context: string;
  conflict: string;
  turning_point: string;
  resolution: string;
  moral: string;
  cta: string;
  tags: string[];
  platform_tags: ("LinkedIn" | "Instagram" | "TikTok")[];
  score?: number;
};

export type Outputs = {
  linkedin?: string;
  instagram_carousel?: string[];
  tiktok_script?: {
    duration_s: number;
    timestamps: { start: number; text: string }[];
    shots?: string[];
  };
  brief_editor?: string;
};

interface AppState {
  // Data
  profile: UserProfile;
  transcript: TranscriptChunk[];
  storyBank: Story[];
  outputsByStoryId: Record<string, Outputs>;
  
  // UI
  loading: boolean;
  error?: string;
  activeTab: "onboarding" | "interview" | "story-bank" | "output";
  selectedStoryId?: string;
  selectedOutputFormat?: "linkedin" | "instagram" | "tiktok" | "brief";
  
  // Actions
  setProfile: (profile: Partial<UserProfile>) => void;
  setTranscript: (transcript: TranscriptChunk[]) => void;
  setStoryBank: (stories: Story[]) => void;
  setOutputs: (storyId: string, outputs: Outputs) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  setActiveTab: (tab: "onboarding" | "interview" | "story-bank" | "output") => void;
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

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  profile: initialProfile,
  transcript: [],
  storyBank: [],
  outputsByStoryId: {},
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
    
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setActiveTab: (activeTab) => set({ activeTab }),
  
  setSelectedStory: (selectedStoryId) => set({ selectedStoryId }),
  
  setSelectedOutputFormat: (selectedOutputFormat) => set({ selectedOutputFormat }),
  
  reset: () => set({
    profile: initialProfile,
    transcript: [],
    storyBank: [],
    outputsByStoryId: {},
    loading: false,
    error: undefined,
    activeTab: "onboarding",
    selectedStoryId: undefined,
    selectedOutputFormat: undefined,
  }),
}));
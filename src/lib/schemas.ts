export type Platform = "Instagram" | "LinkedIn" | "TikTok" | "YouTube" | "Generic";

export type UserProfile = {
  name: string;
  role?: string;
  platforms: Platform[];
};

export type TranscriptChunk = {
  id: string;
  start?: number;
  end?: number;
  text: string;
};

export type Story = {
  id: string;
  histoire: string;   // main scene/description
  conflit: string;    // tension/blocker
  message: string;    // lesson/insight
  platform: Platform;
  color: string;
  tags?: string[];
  score?: number;     // heuristic score for bento sizing
};

// Legacy story type for migration
export type LegacyStory = {
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
  platform: Platform;
  color: string;
};

export type Assignment = Record<string, string[]>;

export type Outputs = {
  linkedin_post?: string;
  instagram_carousel?: string[];
  tiktok_script?: {
    duration_s: number;
    timestamps: { start: number; text: string }[];
    shots?: string[];
  };
  brief_editor?: string;
};
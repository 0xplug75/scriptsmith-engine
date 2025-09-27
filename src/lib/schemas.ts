export type Platform = "Instagram" | "LinkedIn" | "TikTok" | "YouTube" | "Generic";

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
  platform: Platform;
  color: string;
};

export type Assignment = Record<string, string[]>;

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
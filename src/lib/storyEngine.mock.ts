import type { Story } from "./store";

export function generateStoryBankMock(profile: any, transcript_text: string): Story[] {
  const base: Story = {
    id: "s1",
    title: "How I turned interviews into content engine",
    hook: "One interview can fuel a month of content.",
    context: "I struggled to post consistently until I systemized repurposing.",
    conflict: "Ideas stayed stuck as long transcripts.",
    turning_point: "I built a simple story bank from interviews.",
    resolution: "Now each interview yields posts, carousels and short scripts.",
    moral: "System beats motivation for creators.",
    cta: "Comment 'STORY' to get the template.",
    tags: ["repurposing","creator"],
    platform_tags: ["LinkedIn","Instagram","TikTok"],
    score: 86
  };
  return [base, { ...base, id: "s2", title: "The 3-step story bank workflow", hook: "Three steps unlock infinite stories.", score: 92 }];
}
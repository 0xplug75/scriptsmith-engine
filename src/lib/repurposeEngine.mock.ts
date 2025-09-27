import type { Outputs } from "./schemas";

export function repurposeStoryMock(story: any): Outputs {
  return {
    linkedin_post: `Hook: ${story.hook}\n\nContext: ${story.context}\nTurn: ${story.turning_point}\nLesson: ${story.moral}\n\nCTA: ${story.cta}\n#content #story`,
    instagram_carousel: [
      story.hook,
      story.context.slice(0, 80),
      `Problem: ${story.conflict}`,
      `Turn: ${story.turning_point}`,
      `Resolution: ${story.resolution.slice(0, 80)}`,
      `CTA: ${story.cta}`
    ],
    tiktok_script: {
      duration_s: 45,
      timestamps: [
        { start: 0, text: story.hook },
        { start: 5, text: story.conflict },
        { start: 15, text: story.turning_point },
        { start: 30, text: story.resolution },
        { start: 40, text: story.cta }
      ],
      shots: ["close-up", "b-roll typing", "screen capture", "jump cut", "end card"]
    },
    brief_editor: "45s. 3 edit points. Subtitles on. Keep hook on screen 3s; jump cuts every 1.5–2s."
  };
}
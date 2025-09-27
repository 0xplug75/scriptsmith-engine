// LLM Client for OneTake - Direct API calls to Anthropic/OpenRouter
// Note: In production, consider using a minimal proxy for API key security

interface LLMCallParams {
  model: 'claude-3-5-sonnet' | 'claude-3-haiku';
  system: string;
  user: string;
  temperature?: number;
}

const API_ENDPOINT = 'https://api.anthropic.com/v1/messages';
const API_KEY = 'your-anthropic-api-key'; // In production, use secure key management

export async function llmCall({ model, system, user, temperature = 0.7 }: LLMCallParams): Promise<string> {
  try {
    // For demo purposes, we'll simulate the API call
    // In production, implement actual Anthropic API integration
    
    console.log('LLM Call:', { model, system: system.slice(0, 100) + '...', user: user.slice(0, 100) + '...' });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));
    
    // Return mock responses based on the system prompt
    if (system.includes('StoryEngine') || system.includes('Content Architect')) {
      return JSON.stringify([
        {
          id: 'story-1',
          title: 'From Rejection to Million-Dollar Success',
          hook: 'I got rejected 47 times before landing my dream job',
          context: 'Fresh out of college, I applied to dozens of tech companies with my computer science degree.',
          conflict: 'Every single application resulted in a rejection email or complete silence.',
          turning_point: 'I decided to build my own app during the rejection period.',
          resolution: 'The app gained 10k users in 3 months, and suddenly companies were reaching out to me.',
          moral: 'Sometimes rejection redirects you to something better than you originally wanted.',
          cta: 'What rejection in your life led to unexpected success?',
          tags: ['career', 'perseverance', 'entrepreneurship', 'tech'],
          platform_tags: ['LinkedIn', 'Instagram']
        },
        {
          id: 'story-2', 
          title: 'The 3 AM Call That Changed Everything',
          hook: 'A stranger called me at 3 AM and changed my entire career',
          context: 'I was working as a marketing manager at a small startup, feeling stuck in my career.',
          conflict: 'A competitor poached our biggest client, and we were on the verge of bankruptcy.',
          turning_point: 'Our CEO called me at 3 AM with a crazy idea to pivot the entire business model.',
          resolution: 'We launched a new service in 2 weeks, landed 5 new clients, and tripled our revenue.',
          moral: 'The biggest opportunities often come disguised as impossible challenges.',
          cta: 'When did an unexpected moment redirect your path?',
          tags: ['career pivot', 'leadership', 'startup', 'crisis management'],
          platform_tags: ['LinkedIn', 'TikTok']
        }
      ]);
    } else if (system.includes('Multiformat Content Generator')) {
      return JSON.stringify({
        linkedin: `🚀 I got rejected 47 times before landing my dream job

Here's what I learned during those brutal months of rejection:

Fresh out of college, I thought my computer science degree was my golden ticket. I applied to Google, Facebook, Microsoft – you name it.

47 rejections later, I was devastated.

But then something clicked. Instead of wallowing, I decided to build something.

I spent 3 months creating an app that solved a problem I personally faced. No fancy team, no funding – just me, my laptop, and way too much coffee.

The app exploded. 10,000 users in the first 3 months.

Suddenly, the same companies that rejected me were sliding into my DMs.

Sometimes rejection isn't a dead end – it's a detour to something better.

The app? It became a million-dollar business.
The lesson? Your biggest setbacks often lead to your biggest breakthroughs.

What rejection in your life led to unexpected success? 👇

#CareerGrowth #Entrepreneurship`,

        instagram_carousel: [
          "I got rejected 47 times before landing my dream job 💔",
          "Fresh out of college, I applied everywhere 📧",
          "Google, Facebook, Microsoft... All said no ❌", 
          "Instead of giving up, I built my own app 💡",
          "10k users in 3 months 🚀",
          "Those same companies started reaching out 📞"
        ],

        tiktok_script: {
          duration_s: 45,
          timestamps: [
            { start: 0, text: "I got rejected 47 times before my breakthrough" },
            { start: 5, text: "Applied to every tech company imaginable" },
            { start: 12, text: "Google, Facebook, Microsoft - all said no" },
            { start: 20, text: "So I built my own app instead" },
            { start: 28, text: "10k users in 3 months" },
            { start: 35, text: "Same companies started reaching out" },
            { start: 42, text: "Sometimes rejection leads to success" }
          ],
          shots: [
            "Close-up: Person looking at rejection email on laptop",
            "Montage: Multiple company logos with X marks",
            "Time-lapse: Coding/building the app",
            "Screen recording: User count growing rapidly",
            "Phone notifications: Companies reaching out"
          ]
        },

        brief_editor: `**Hook:** I got rejected 47 times before landing my dream job\n\n**Story Structure:**\n- Setup: Fresh graduate applying to tech companies\n- Conflict: 47 consecutive rejections\n- Turning Point: Decided to build own app\n- Resolution: App success led to company outreach\n- Message: Rejection can redirect to better opportunities\n\n**Key Metrics:**\n- 47 rejections\n- 10k users in 3 months\n- Million-dollar business outcome\n\n**Tone:** Inspirational, authentic, relatable\n**CTA:** Ask audience about their rejection success stories`
      });
    }
    
    // Fallback response
    return JSON.stringify({ error: 'Unknown prompt type' });
    
  } catch (error) {
    console.error('LLM API Error:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

export function safeJSON<T>(str: string): T {
  try {
    return JSON.parse(str);
  } catch (error) {
    console.error('JSON Parse Error:', error);
    throw new Error('Invalid response format from AI. Please try again.');
  }
}

// Story Engine - converts interview transcript into structured stories
export const STORY_ENGINE_SYSTEM = `You are Content Architect. Output STRICT JSON array of stories. Schema:
[{id,title,hook,context,conflict,turning_point,resolution,moral,cta,tags,platform_tags}].
Constraints: title 8–12 words; hook 8–15 words; context 1–2 sentences; conflict 1 sentence; turning_point 1 sentence; resolution 1–2 sentences; moral 1 sentence; platform_tags subset of [LinkedIn, Instagram, TikTok]. NO extra text.`;

// Repurpose Engine - converts single story into multiple formats  
export const REPURPOSE_ENGINE_SYSTEM = `You are Multiformat Content Generator. Return STRICT JSON object:
{
 "linkedin": string,
 "instagram_carousel": [string, string, string, string, string, string],
 "tiktok_script": { "duration_s": number, "timestamps":[{"start":number,"text":string}], "shots": string[] },
 "brief_editor": string
}
Constraints: IG slides <25 words each; TikTok 40–55s with 3 edit points; LinkedIn = short paragraphs + 1–2 hashtags. NO extra text.`;
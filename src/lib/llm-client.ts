// LLM Client for OneTake - Google Gemini API integration
// Uses Lovable secrets management for secure API key storage

interface LLMCallParams {
  model: 'gemini-1.5-pro' | 'gemini-1.5-flash';
  system: string;
  user: string;
  temperature?: number;
}

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';
const GEMINI_API_KEY = 'AIzaSyDUHpYUbtoKVyCZLB3V2PUnq2Q3j1clkbY';

export async function llmCall({ model, system, user, temperature = 0.7 }: LLMCallParams): Promise<string> {
  try {
    const response = await fetch(`${API_ENDPOINT}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${system}\n\nUser: ${user}`
          }]
        }],
        generationConfig: {
          temperature,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Gemini API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    return data.candidates[0].content.parts[0].text;

  } catch (error) {
    console.error('Gemini API Error:', error);
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
export const REPURPOSE_ENGINE_SYSTEM = `You are a content architect AI.  
Your task is to take a narrative story with 3 fields: 
- Histoire (the raw scene or anecdote)  
- Conflit (the obstacle or challenge)  
- Message (the key lesson or insight)  

From this structure, generate **3 outputs in STRICT JSON**:  

{
  "linkedin_post": string,
  "tiktok_script": {
    "duration_s": number,
    "timestamps": [
      { "start": number, "text": string }
    ],
    "shots": [string]
  },
  "instagram_carousel": [string]
}

### Rules for each format:

#### LinkedIn Post
- Title = 2 short punchy sentences (Hook + Rehook).  
- Then expand story with short, spaced sentences (mobile friendly).  
- Style = strategic, punchy, professional.  
- End with a question or call-to-action.  

#### TikTok Script
- Duration = 40–55 seconds.  
- Use timestamps every 5–10s.  
- Each timestamp = what the narrator says.  
- Also provide "shots": suggested visuals for each segment.  
- Style = dynamic, conversational, engaging.  

#### Instagram Carousel
- 6 slides max.  
- Each slide = < 25 words.  
- Style = direct, emotional, designed for swipe effect.  
- Slide 1 = hook. Slide 6 = punchy closing.  

### Output format:
STRICT JSON, no explanations, no markdown, just the JSON object.`;
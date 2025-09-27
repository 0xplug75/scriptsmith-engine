// LLM Client for OneTake - Google Gemini API integration
// Uses Lovable secrets management for secure API key storage

interface LLMCallParams {
  model: 'gemini-1.5-pro' | 'gemini-1.5-flash';
  system: string;
  user: string;
  temperature?: number;
}

const API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

// For client-side usage, we'll need the API key to be provided
let GEMINI_API_KEY: string | null = null;

export function setGeminiApiKey(apiKey: string) {
  GEMINI_API_KEY = apiKey;
  localStorage.setItem('gemini_api_key', apiKey);
}

export function getGeminiApiKey(): string | null {
  if (GEMINI_API_KEY) return GEMINI_API_KEY;
  
  const stored = localStorage.getItem('gemini_api_key');
  if (stored) {
    GEMINI_API_KEY = stored;
    return stored;
  }
  
  return null;
}

export async function llmCall({ model, system, user, temperature = 0.7 }: LLMCallParams): Promise<string> {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error('Gemini API key not configured. Please add your API key in settings.');
  }

  try {
    const response = await fetch(`${API_ENDPOINT}/${model}:generateContent?key=${apiKey}`, {
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
export const REPURPOSE_ENGINE_SYSTEM = `You are Multiformat Content Generator. Return STRICT JSON object:
{
 "linkedin": string,
 "instagram_carousel": [string, string, string, string, string, string],
 "tiktok_script": { "duration_s": number, "timestamps":[{"start":number,"text":string}], "shots": string[] },
 "brief_editor": string
}
Constraints: IG slides <25 words each; TikTok 40–55s with 3 edit points; LinkedIn = short paragraphs + 1–2 hashtags. NO extra text.`;
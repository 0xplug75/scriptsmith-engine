import { useAppStore } from './store';
import { llmCall, REPURPOSE_ENGINE_SYSTEM, safeJSON } from './llm-client';
import type { Story, Outputs, UserProfile } from './schemas';
import { toast } from '@/hooks/use-toast';

export async function generateLinkedIn(storyId: string) {
  const { storyBank, profile, setOutputs, setGenerationLoading, generationLoading } = useAppStore.getState();
  
  if (generationLoading) return;
  
  const story = storyBank.find(s => s.id === storyId);
  if (!story) return;

  try {
    setGenerationLoading(storyId);
    
    const response = await llmCall({
      model: 'claude-3-5-sonnet',
      system: REPURPOSE_ENGINE_SYSTEM,
      user: JSON.stringify({
        profile,
        story,
        generate: ['linkedin']
      })
    });

    const outputs = safeJSON<Outputs>(response);
    setOutputs(storyId, { linkedin: outputs.linkedin });
    
    toast({
      title: "LinkedIn post generated!",
      description: "Content ready for viewing"
    });
  } catch (error) {
    console.error('LinkedIn generation error:', error);
    toast({
      title: "Generation failed",
      description: "Please try again",
      variant: "destructive"
    });
  } finally {
    setGenerationLoading(null);
  }
}

export async function generateInstagram(storyId: string) {
  const { storyBank, profile, setOutputs, setGenerationLoading, generationLoading } = useAppStore.getState();
  
  if (generationLoading) return;
  
  const story = storyBank.find(s => s.id === storyId);
  if (!story) return;

  try {
    setGenerationLoading(storyId);
    
    const response = await llmCall({
      model: 'claude-3-5-sonnet',
      system: REPURPOSE_ENGINE_SYSTEM,
      user: JSON.stringify({
        profile,
        story,
        generate: ['instagram']
      })
    });

    const outputs = safeJSON<Outputs>(response);
    setOutputs(storyId, { instagram_carousel: outputs.instagram_carousel });
    
    toast({
      title: "Instagram carousel generated!",
      description: "6 slides ready for viewing"
    });
  } catch (error) {
    console.error('Instagram generation error:', error);
    toast({
      title: "Generation failed",
      description: "Please try again",
      variant: "destructive"
    });
  } finally {
    setGenerationLoading(null);
  }
}

export async function generateTikTok(storyId: string) {
  const { storyBank, profile, setOutputs, setGenerationLoading, generationLoading } = useAppStore.getState();
  
  if (generationLoading) return;
  
  const story = storyBank.find(s => s.id === storyId);
  if (!story) return;

  try {
    setGenerationLoading(storyId);
    
    const response = await llmCall({
      model: 'claude-3-5-sonnet',
      system: REPURPOSE_ENGINE_SYSTEM,
      user: JSON.stringify({
        profile,
        story,
        generate: ['tiktok']
      })
    });

    const outputs = safeJSON<Outputs>(response);
    setOutputs(storyId, { tiktok_script: outputs.tiktok_script });
    
    toast({
      title: "TikTok script generated!",
      description: "Video timeline ready for viewing"
    });
  } catch (error) {
    console.error('TikTok generation error:', error);
    toast({
      title: "Generation failed",
      description: "Please try again",
      variant: "destructive"
    });
  } finally {
    setGenerationLoading(null);
  }
}
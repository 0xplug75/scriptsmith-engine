import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import { llmCall, safeJSON, STORY_ENGINE_SYSTEM } from '@/lib/llm-client';
import type { Story, Platform } from '@/lib/schemas';
import { Sparkles, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PLATFORM_COLORS = {
  Instagram: "bg-gradient-to-br from-pink-500 to-purple-600",
  LinkedIn: "bg-gradient-to-br from-blue-600 to-blue-700", 
  TikTok: "bg-gradient-to-br from-black to-red-500",
  YouTube: "bg-gradient-to-br from-red-500 to-red-600",
  Generic: "bg-gradient-to-br from-gray-500 to-gray-600"
};

export default function OnboardingStep2Enhanced() {
  const { 
    profile, 
    transcript, 
    storyBank, 
    setStoryBank, 
    setOnboardingStep,
    setOnboardingComplete,
    setActiveTab
  } = useAppStore();
  
  const { toast } = useToast();
  const [generatedStories, setGeneratedStories] = useState<Story[]>([]);
  const [selectedStoryIds, setSelectedStoryIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  // Auto-generate stories on mount if transcript exists
  useEffect(() => {
    if (transcript.length > 0 && generatedStories.length === 0) {
      generateStories();
    }
  }, [transcript]);

  const generateStories = async () => {
    if (!profile.name || transcript.length === 0) {
      setError('Profil et transcript requis');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const transcriptText = transcript.map(chunk => chunk.text).join('\n\n');
      
      const payload = JSON.stringify({
        profile,
        transcript_text: transcriptText,
        constraints: {
          ideas: 5,
          concise: true,
          tones: ["punchy", "friendly"]
        }
      });

      const response = await llmCall({
        model: 'claude-3-5-sonnet',
        system: STORY_ENGINE_SYSTEM,
        user: payload,
        temperature: 0.8
      });

      const stories = safeJSON<Story[]>(response);
      
      // Add platforms and colors
      const enhancedStories = stories.slice(0, 5).map((story, index) => {
        const platforms: Platform[] = ["LinkedIn", "Instagram", "TikTok", "YouTube", "Generic"];
        const platform = platforms[index % platforms.length];
        
        return {
          ...story,
          platform,
          color: PLATFORM_COLORS[platform],
          score: calculateStoryScore(story)
        };
      });

      setGeneratedStories(enhancedStories);
      // Select first 2 stories by default
      setSelectedStoryIds(new Set(enhancedStories.slice(0, 2).map(s => s.id)));
      
      toast({
        title: "Histoires générées!",
        description: `${enhancedStories.length} histoires créées depuis votre transcript.`
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Échec de génération';
      setError(errorMessage);
      toast({
        title: "Génération échouée",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStoryScore = (story: Story): number => {
    let score = 0;
    score += story.histoire.length > 80 ? 0.2 : 0;
    score += story.conflit ? 0.3 : 0;
    score += story.message ? 0.3 : 0;
    score += (story.tags?.length || 0) > 0 ? 0.2 : 0;
    return score;
  };

  const toggleStorySelection = (storyId: string) => {
    const newSelection = new Set(selectedStoryIds);
    if (newSelection.has(storyId)) {
      newSelection.delete(storyId);
    } else {
      newSelection.add(storyId);
    }
    setSelectedStoryIds(newSelection);
  };

  const handleGoToPlanner = () => {
    // Add selected stories to story bank
    const selectedStories = generatedStories.filter(story => 
      selectedStoryIds.has(story.id)
    );
    
    setStoryBank([...storyBank, ...selectedStories]);
    
    // Complete onboarding
    setOnboardingComplete(true);
    setActiveTab('story-bank');
    
    toast({
      title: "Onboarding terminé!",
      description: `${selectedStories.length} histoires ajoutées à votre banque.`
    });
  };

  const canProceed = selectedStoryIds.size > 0;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">
            Génération de vos histoires...
          </h1>
          <p className="text-muted-foreground">
            L'IA analyse votre transcript et extrait les meilleures histoires
          </p>
        </div>
      </div>
    );
  }

  if (error || generatedStories.length === 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">
            Générer vos histoires
          </h1>
          <p className="text-muted-foreground">
            {error || "Aucune histoire générée"}
          </p>
          <Button onClick={generateStories} disabled={loading}>
            <Sparkles className="w-4 h-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Choisissez vos histoires
        </h1>
        <p className="text-muted-foreground">
          {generatedStories.length} histoires générées depuis votre transcript. Sélectionnez celles qui vous parlent le plus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {generatedStories.map((story) => (
          <div 
            key={story.id}
            className={`
              border-2 rounded-lg p-6 cursor-pointer transition-all
              ${selectedStoryIds.has(story.id) 
                ? 'border-primary bg-primary/5 shadow-md' 
                : 'border-border hover:border-primary/50'
              }
            `}
            onClick={() => toggleStorySelection(story.id)}
          >
            <div className="flex items-start gap-3 mb-4">
              <Checkbox 
                checked={selectedStoryIds.has(story.id)}
                onChange={() => {}} // Controlled by parent click
                className="mt-1"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">{story.histoire}</h3>
                {story.conflit && (
                  <div className="mb-2">
                    <Label className="text-sm font-medium text-muted-foreground">Conflit:</Label>
                    <p className="text-sm">{story.conflit}</p>
                  </div>
                )}
                {story.message && (
                  <div className="mb-2">
                    <Label className="text-sm font-medium text-muted-foreground">Message:</Label>
                    <p className="text-sm">{story.message}</p>
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  <span className={`px-2 py-1 rounded text-xs text-white ${story.color}`}>
                    {story.platform}
                  </span>
                  {selectedStoryIds.has(story.id) && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={() => setOnboardingStep(1.5)}
          variant="outline"
          className="flex-1 h-12"
        >
          Retour
        </Button>
        <Button 
          onClick={handleGoToPlanner}
          disabled={!canProceed}
          className="flex-2 h-12 text-lg"
        >
          Aller au Planner ({selectedStoryIds.size} histoires)
        </Button>
      </div>
    </div>
  );
}
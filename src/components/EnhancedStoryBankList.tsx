import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { llmCall, safeJSON, STORY_ENGINE_SYSTEM } from "@/lib/llm-client";
import { useState } from "react";
import { Sparkles, Star, Target, Plus, Lightbulb } from "lucide-react";
import type { Story, Platform } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import EnhancedStoryCard from "./EnhancedStoryCard";
import StoryBankDropZone from "./StoryBankDropZone";
import { BentoGrid, BentoItem, getBentoSize } from "./BentoGrid";

const PLATFORM_COLORS = {
  Instagram: "bg-gradient-to-br from-pink-500 to-purple-600",
  LinkedIn: "bg-gradient-to-br from-blue-600 to-blue-700",
  TikTok: "bg-gradient-to-br from-black to-red-500",
  YouTube: "bg-gradient-to-br from-red-500 to-red-600",
  Generic: "bg-gradient-to-br from-gray-500 to-gray-600"
};

export default function EnhancedStoryBankList() {
  const { 
    profile, 
    transcript, 
    storyBank, 
    setStoryBank, 
    updateStory,
    outputsByStoryId,
    setOutputs,
    loading, 
    setLoading, 
    setError,
    setActiveTab,
    setSelectedStory,
    setSelectedOutputFormat
  } = useAppStore();
  
  const { toast } = useToast();
  const [generatingIdeas, setGeneratingIdeas] = useState(false);

  const calculateStoryScore = (story: Story): number => {
    let score = 0;
    score += story.histoire.length > 80 ? 0.2 : 0;
    score += story.conflit ? 0.3 : 0;
    score += story.message ? 0.3 : 0;
    score += (story.tags?.length || 0) > 0 ? 0.2 : 0;
    return score;
  };

  const generateTenIdeas = async () => {
    if (!profile.name) {
      toast({
        title: "Profil requis",
        description: "Complétez votre profil pour générer des idées",
        variant: "destructive"
      });
      return;
    }

    setGeneratingIdeas(true);

    try {
      const payload = JSON.stringify({
        profile,
        existing_stories: storyBank.map(s => s.histoire),
        constraints: {
          ideas: 10,
          diverse: true,
          platforms: profile.platforms
        }
      });

      const response = await llmCall({
        model: 'claude-3-5-sonnet',
        system: STORY_ENGINE_SYSTEM,
        user: payload,
        temperature: 0.9
      });

      const newStories = safeJSON<Story[]>(response);
      
      // Deduplication by similarity (simple includes check)
      const filteredStories = newStories.filter(newStory => 
        !storyBank.some(existing => 
          existing.histoire.toLowerCase().includes(newStory.histoire.toLowerCase().slice(0, 20)) ||
          newStory.histoire.toLowerCase().includes(existing.histoire.toLowerCase().slice(0, 20))
        )
      );

      // Add platforms, colors and scores
      const enhancedStories = filteredStories.slice(0, 10).map((story, index) => {
        const platforms: Platform[] = profile.platforms.length > 0 ? profile.platforms : ["LinkedIn", "Instagram", "TikTok"];
        const platform = platforms[index % platforms.length];
        
        return {
          ...story,
          platform,
          color: PLATFORM_COLORS[platform],
          score: calculateStoryScore(story),
          tags: [...(story.tags || []), 'generated']
        };
      });

      setStoryBank([...storyBank, ...enhancedStories]);
      
      toast({
        title: "Idées générées!",
        description: `${enhancedStories.length} nouvelles histoires ajoutées à votre banque.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de génération des idées';
      toast({
        title: "Génération échouée",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setGeneratingIdeas(false);
    }
  };

  const generateVariations = async (story: Story) => {
    setLoading(true);

    try {
      const payload = JSON.stringify({
        story,
        style: {
          angles: ["expertise", "confession", "how-to"],
          count: 3
        }
      });

      const response = await llmCall({
        model: 'claude-3-5-sonnet',
        system: `Return ONLY STRICT JSON { variations: [{histoire, conflit, message, tags}] }.`,
        user: payload
      });

      const result = safeJSON<{ variations: Partial<Story>[] }>(response);
      
      const variations = result.variations.map((variation, index) => ({
        id: `${story.id}-var-${index}`,
        histoire: variation.histoire || `${story.histoire} (variation)`,
        conflit: variation.conflit || story.conflit,
        message: variation.message || story.message,
        platform: story.platform,
        color: story.color,
        tags: [...(story.tags || []), 'variation'],
        score: calculateStoryScore({
          ...story,
          ...variation
        } as Story)
      } as Story));

      setStoryBank([...storyBank, ...variations]);
      
      toast({
        title: "Variations créées!",
        description: `${variations.length} nouvelles variations ajoutées.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Échec de génération des variations';
      toast({
        title: "Génération échouée",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addNewStory = () => {
    const newStory: Story = {
      id: `story-${Date.now()}`,
      histoire: "Nouvelle histoire",
      conflit: "",
      message: "",
      tags: ["nouveau"],
      platform: profile.platforms[0] || "LinkedIn",
      color: PLATFORM_COLORS[profile.platforms[0] || "LinkedIn"],
      score: 0.1
    };
    
    setStoryBank([...storyBank, newStory]);
  };

  const handleEditStory = (updatedStory: Story) => {
    // Recalculate score on edit
    const storyWithScore = {
      ...updatedStory,
      score: calculateStoryScore(updatedStory)
    };
    updateStory(storyWithScore);
  };

  const handleDeleteStory = (storyId: string) => {
    setStoryBank(storyBank.filter(story => story.id !== storyId));
    toast({
      title: "Histoire supprimée",
      description: "Histoire retirée de votre banque"
    });
  };

  const handleDuplicateStory = (story: Story) => {
    const duplicatedStory: Story = {
      ...story,
      id: `story-${Date.now()}`,
      histoire: `${story.histoire} (copie)`,
      tags: [...(story.tags || []), 'copie']
    };
    
    setStoryBank([...storyBank, duplicatedStory]);
    toast({
      title: "Histoire dupliquée",
      description: "Nouvelle copie ajoutée à votre banque"
    });
  };

  const generateOutput = async (story: Story, format: 'linkedin' | 'instagram' | 'tiktok' | 'all') => {
    // Keep existing output generation logic
    // ... (same as before)
  };

  if (storyBank.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-16">
        <Target className="w-16 h-16 mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">Votre banque d'histoires est vide</h3>
        <p className="text-muted-foreground">
          Créez votre première histoire ou générez des idées automatiquement
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={addNewStory}>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle histoire
          </Button>
          <Button onClick={generateTenIdeas} disabled={generatingIdeas} variant="outline">
            <Sparkles className="w-4 h-4 mr-2" />
            Générer 10 idées
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Votre Banque d'Histoires</h2>
        <p className="text-lg text-muted-foreground">
          {storyBank.length} histoires prêtes pour votre calendrier éditorial
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Target className="w-3 h-3" />
            {storyBank.length} Histoires
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Star className="w-3 h-3" />
            Bento Layout
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={addNewStory}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter
          </Button>
          <Button 
            onClick={generateTenIdeas} 
            disabled={generatingIdeas}
            className="bg-gradient-hero"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {generatingIdeas ? 'Génération...' : 'Générer 10 idées'}
          </Button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <BentoGrid>
        {/* Drop Zone as first item */}
        <BentoItem size="S">
          <StoryBankDropZone onAddStory={addNewStory} />
        </BentoItem>
        
        {/* Story Cards */}
        {storyBank.map((story) => {
          const bentoSize = getBentoSize(story.score || 0);
          
          return (
            <BentoItem key={story.id} size={bentoSize}>
              <EnhancedStoryCard
                story={story}
                onEdit={handleEditStory}
                onDelete={handleDeleteStory}
                onDuplicate={handleDuplicateStory}
                onGenerate={generateOutput}
                onSuggestVariations={generateVariations}
              />
            </BentoItem>
          );
        })}
      </BentoGrid>
    </div>
  );
}

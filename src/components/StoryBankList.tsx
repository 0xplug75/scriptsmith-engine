import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppStore } from "@/lib/store";
import { llmCall, safeJSON, STORY_ENGINE_SYSTEM, REPURPOSE_ENGINE_SYSTEM } from "@/lib/llm-client";
import { useEffect } from "react";
import { Sparkles, Star, Copy, Edit, ExternalLink, Zap, BookOpen, Target } from "lucide-react";
import type { Story, Outputs } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

const PLATFORM_COLORS = {
  LinkedIn: "bg-blue-500/10 text-blue-700 border-blue-200",
  Instagram: "bg-pink-500/10 text-pink-700 border-pink-200", 
  TikTok: "bg-purple-500/10 text-purple-700 border-purple-200"
};

export default function StoryBankList() {
  const { 
    profile, 
    transcript, 
    storyBank, 
    setStoryBank, 
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

  // Generate story bank on component mount if not already generated
  useEffect(() => {
    if (storyBank.length === 0 && transcript.length > 0 && profile.name) {
      generateStoryBank();
    }
  }, []);

  const generateStoryBank = async () => {
    if (!profile.name || transcript.length === 0) {
      setError('Please complete your profile and add transcript first');
      return;
    }

    setLoading(true);
    setError(undefined);

    try {
      const transcriptText = transcript.map(chunk => chunk.text).join('\n\n');
      
      const payload = JSON.stringify({
        profile,
        platform_rules: {
          LinkedIn: { max_words: 350 },
          Instagram: { slides: 6, max_words_per_slide: 25 },
          TikTok: { duration_s: 40 }
        },
        transcript_text: transcriptText,
        guidance: {
          hook_types: ["shock", "curiosity", "stat", "question", "confession"],
          copy_frameworks: ["PAS", "AIDA", "BAB", "STAR"],
          virality_rules: ["include_number", "use_emotion_word", "add_concrete_proof", "clear_CTA"]
        }
      });

      const response = await llmCall({
        model: 'claude-3-5-sonnet',
        system: STORY_ENGINE_SYSTEM,
        user: payload,
        temperature: 0.8
      });

      const stories = safeJSON<Story[]>(response);
      
      // Add scores (simple heuristic for demo)
      const scoredStories = stories.map(story => ({
        ...story,
        score: Math.floor(Math.random() * 30) + 70 // 70-99 range
      }));

      setStoryBank(scoredStories);
      toast({
        title: "Story bank generated!",
        description: `Found ${stories.length} compelling stories from your interview.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate stories';
      setError(errorMessage);
      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateOutput = async (story: Story, format: 'linkedin' | 'instagram' | 'tiktok' | 'all') => {
    setLoading(true);
    
    try {
      const payload = JSON.stringify({
        profile,
        story,
        preferences: {
          tone_override: null,
          hashtags_max: 2
        }
      });

      const response = await llmCall({
        model: 'claude-3-5-sonnet',
        system: REPURPOSE_ENGINE_SYSTEM,
        user: payload
      });

      const outputs = safeJSON<Outputs>(response);
      setOutputs(story.id, outputs);
      
      // Navigate to output view
      setSelectedStory(story.id);
      if (format !== 'all') {
        setSelectedOutputFormat(format);
      }
      setActiveTab('output');
      
      toast({
        title: "Content generated!",
        description: `Created ${format === 'all' ? 'all formats' : format} content for your story.`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate content';
      setError(errorMessage);
      toast({
        title: "Generation failed", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyStory = (story: Story) => {
    const text = `${story.title}\n\n${story.hook}\n\n${story.context} ${story.conflict} ${story.turning_point} ${story.resolution}\n\n${story.moral}\n\n${story.cta}`;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Story text copied successfully"
    });
  };

  if (loading && storyBank.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 py-16">
          <div className="w-16 h-16 bg-gradient-hero rounded-full flex items-center justify-center mx-auto animate-pulse">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold">Analyzing Your Interview</h3>
          <p className="text-muted-foreground">AI is extracting compelling stories from your transcript...</p>
        </div>
      </div>
    );
  }

  if (storyBank.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center space-y-4 py-16">
        <BookOpen className="w-16 h-16 mx-auto text-muted-foreground" />
        <h3 className="text-xl font-semibold">No Stories Generated Yet</h3>
        <p className="text-muted-foreground">
          Complete your profile and add a transcript to generate your story bank
        </p>
        <Button onClick={generateStoryBank} disabled={!profile.name || transcript.length === 0}>
          <Zap className="w-4 h-4 mr-2" />
          Generate Story Bank
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Your Story Bank</h2>
        <p className="text-lg text-muted-foreground">
          {storyBank.length} compelling stories extracted from your interview
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="secondary" className="gap-1">
            <Target className="w-3 h-3" />
            {storyBank.length} Stories
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Star className="w-3 h-3" />
            Avg Score: {Math.round(storyBank.reduce((acc, story) => acc + (story.score || 0), 0) / storyBank.length)}
          </Badge>
        </div>
        
        <Button variant="outline" onClick={generateStoryBank} disabled={loading}>
          <Sparkles className="w-4 h-4 mr-2" />
          Regenerate
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {storyBank.map((story) => (
          <Card key={story.id} className="shadow-elegant-md hover:shadow-elegant-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{story.title}</CardTitle>
                  <p className="text-accent font-medium mt-1">"{story.hook}"</p>
                </div>
                {story.score && (
                  <Badge variant="outline" className="shrink-0">
                    <Star className="w-3 h-3 mr-1" />
                    {story.score}
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <p><strong>Context:</strong> {story.context}</p>
                <p><strong>Conflict:</strong> {story.conflict}</p>
                <p><strong>Resolution:</strong> {story.resolution}</p>
                <p className="text-success"><strong>Moral:</strong> {story.moral}</p>
              </div>

              {/* Platform Tags */}
              <div className="flex flex-wrap gap-2">
                {story.platform_tags.map(platform => (
                  <Badge 
                    key={platform} 
                    variant="outline" 
                    className={PLATFORM_COLORS[platform]}
                  >
                    {platform}
                  </Badge>
                ))}
              </div>

              {/* Story Tags */}
              <div className="flex flex-wrap gap-1">
                {story.tags.slice(0, 4).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => generateOutput(story, 'linkedin')}
                  disabled={loading}
                  className="gap-1"
                >
                  LinkedIn Post
                </Button>
                
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={() => generateOutput(story, 'instagram')}
                  disabled={loading}
                  className="gap-1"
                >
                  IG Carousel
                </Button>
                
                <Button
                  variant="outline"
                  size="sm" 
                  onClick={() => generateOutput(story, 'tiktok')}
                  disabled={loading}
                  className="gap-1"
                >
                  TikTok Script
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyStory(story)}
                  className="gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </Button>
              </div>

              <Button
                className="w-full bg-gradient-hero"
                onClick={() => generateOutput(story, 'all')}
                disabled={loading}
              >
                <Zap className="w-4 h-4 mr-2" />
                Generate All Formats
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
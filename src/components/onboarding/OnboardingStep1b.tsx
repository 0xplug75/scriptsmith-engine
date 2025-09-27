import React, { useState } from 'react';
import { ChevronLeft, FileText, Mic, Upload, Wand2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { llmCall, safeJSON } from '@/lib/llm-client';
import type { TranscriptChunk, Story } from '@/lib/schemas';
import { toast } from '@/hooks/use-toast';

// Demo transcript
const DEMO_TRANSCRIPT = `Je vous raconte comment j'ai transformé mon plus gros échec en succès. Il y a trois ans, j'ai lancé ma première startup avec 50 000 euros d'économies. L'idée était révolutionnaire : une app qui connectait les artisans locaux avec les particuliers. Pendant six mois, j'ai travaillé 16h par jour, j'ai recruté une équipe de 5 personnes, j'ai développé l'app, fait du marketing... Et puis, catastrophe : personne n'utilisait l'app. Zéro téléchargement après le premier mois. J'ai tout perdu : mon argent, mon équipe, ma confiance. Mais voilà le truc : cet échec m'a appris quelque chose de crucial sur le marché. J'ai réalisé que le problème n'était pas la technologie, mais la façon dont je présentais la solution. Alors j'ai pivoté, j'ai créé une plateforme B2B pour les entreprises de construction, et là, boom ! 100 000 euros de chiffre d'affaires la première année. Parfois, il faut échouer pour réussir.`;

// LLM System prompts for text-to-stories conversion
const TRANSCRIPT_TO_STORIES_SYSTEM = `You are a Story Extractor. From a transcript or long text, return ONLY STRICT JSON:
[{ "histoire": string, "conflit": string, "message": string, "platform": "LinkedIn"|"Instagram"|"TikTok"|"YouTube"|"Generic", "tags": string[] }]
Constraints: 3–6 items. Each field concise and specific. No extra text.`;

const TRANSCRIPT_TO_SINGLE_STORY_SYSTEM = `You are a Narrative Condenser. From the transcript, return ONLY STRICT JSON:
{ "histoire": string, "conflit": string, "message": string, "platform": "Generic", "tags": string[] }
Constraints: concise, actionable, faithful to the source. No extra text.`;

export default function OnboardingStep1b() {
  const { setTranscript, setOnboardingStep, setStoryBank, storyBank, profile, setLoading } = useAppStore();
  const [transcriptText, setTranscriptText] = useState('');
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [generatedStories, setGeneratedStories] = useState<Story[]>([]);
  const [showSelection, setShowSelection] = useState(false);

  const segmentTranscript = (text: string): TranscriptChunk[] => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.map((sentence, index) => ({
      id: `chunk-${index}`,
      start: index * 3,
      end: (index + 1) * 3,
      text: sentence.trim()
    }));
  };

  const hydrateStory = (storyData: any): Story => ({
    id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    histoire: storyData.histoire || '',
    conflit: storyData.conflit || '',
    message: storyData.message || '',
    platform: storyData.platform || 'Generic',
    color: '#3B82F6',
    tags: storyData.tags || [],
    score: 0.5
  });

  const handleAutoSplit = async () => {
    if (!transcriptText.trim()) return;
    
    try {
      setLoading(true);
      
      const response = await llmCall({
        model: 'gemini-1.5-pro',
        system: TRANSCRIPT_TO_STORIES_SYSTEM,
        user: JSON.stringify({
          profile,
          transcript_text: transcriptText,
          target_count: 5
        })
      });

      const storiesData = safeJSON<any[]>(response);
      const stories = storiesData.map(hydrateStory);
      setGeneratedStories(stories);
      setSelectedStories(stories);
      setShowSelection(true);
      
      toast({
        title: "Stories generated!",
        description: `${stories.length} stories extracted from your text`
      });
    } catch (error) {
      console.error('Auto-split error:', error);
      toast({
        title: "Generation failed",
        description: "Please try again or use the demo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSingle = async () => {
    if (!transcriptText.trim()) return;
    
    try {
      setLoading(true);
      
      const response = await llmCall({
        model: 'gemini-1.5-pro',
        system: TRANSCRIPT_TO_SINGLE_STORY_SYSTEM,
        user: JSON.stringify({
          profile,
          transcript_text: transcriptText
        })
      });

      const storyData = safeJSON<any>(response);
      const story = hydrateStory(storyData);
      setGeneratedStories([story]);
      setSelectedStories([story]);
      setShowSelection(true);
      
      toast({
        title: "Story created!",
        description: "Your text has been condensed into one story"
      });
    } catch (error) {
      console.error('Single story creation error:', error);
      toast({
        title: "Generation failed", 
        description: "Please try again or use the demo",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmSelection = () => {
    if (selectedStories.length > 0) {
      setStoryBank([...storyBank, ...selectedStories]);
      toast({
        title: "Stories added!",
        description: `${selectedStories.length} stories added to your bank`
      });
    }
    setOnboardingStep(3);
  };

  const toggleStorySelection = (story: Story) => {
    setSelectedStories(prev => 
      prev.some(s => s.id === story.id)
        ? prev.filter(s => s.id !== story.id)
        : [...prev, story]
    );
  };

  const handleNext = () => {
    if (!transcriptText.trim()) return;
    
    const transcript = segmentTranscript(transcriptText);
    setTranscript(transcript);
    setOnboardingStep(2);
  };

  const handleUseDemo = () => {
    setTranscriptText(DEMO_TRANSCRIPT);
    const transcript = segmentTranscript(DEMO_TRANSCRIPT);
    setTranscript(transcript);
    setOnboardingStep(2);
  };

  if (showSelection) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Sélectionnez vos histoires</h1>
          <p className="text-lg text-muted-foreground">
            Choisissez les histoires à ajouter à votre planner
          </p>
        </div>

        <div className="grid gap-4">
          {generatedStories.map((story) => (
            <Card 
              key={story.id} 
              className={`cursor-pointer transition-all ${
                selectedStories.some(s => s.id === story.id) 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => toggleStorySelection(story)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStories.some(s => s.id === story.id)}
                    onChange={() => toggleStorySelection(story)}
                    className="mt-2"
                  />
                  <div className="flex-1 space-y-2">
                    <h3 className="font-semibold text-foreground">{story.histoire}</h3>
                    {story.conflit && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Conflit:</strong> {story.conflit}
                      </p>
                    )}
                    {story.message && (
                      <p className="text-sm text-muted-foreground">
                        <strong>Message:</strong> {story.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setShowSelection(false)}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <Button
            onClick={handleConfirmSelection}
            disabled={selectedStories.length === 0}
          >
            Aller au Planner ({selectedStories.length})
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Ajoutez votre contenu</h1>
        <p className="text-lg text-muted-foreground">
          Collez votre transcript ou utilisez notre démo pour commencer
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Votre transcript
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Collez votre transcript ici... Ou utilisez la démo ci-dessous pour tester rapidement."
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            className="min-h-[200px] resize-none"
          />
          
          {transcriptText.trim() && (
            <div className="flex gap-2 pt-4 border-t">
              <Button
                onClick={handleAutoSplit}
                className="flex-1 flex items-center gap-2"
                variant="default"
              >
                <Wand2 className="h-4 w-4" />
                Auto-diviser en histoires
              </Button>
              <Button
                onClick={handleCreateSingle}
                className="flex-1 flex items-center gap-2"
                variant="outline"
              >
                <BookOpen className="h-4 w-4" />
                Créer une histoire
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setOnboardingStep(1)}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleUseDemo}
          >
            Utiliser démo
          </Button>
          <Button
            onClick={handleNext}
            disabled={!transcriptText.trim()}
          >
            Continuer (classique)
          </Button>
        </div>
      </div>
    </div>
  );
}
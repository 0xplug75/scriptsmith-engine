import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import type { Story } from '@/lib/schemas';

export default function OnboardingStep2() {
  const { setStoryBank, storyBank, setOnboardingStep } = useAppStore();
  
  const [story, setStory] = useState<Omit<Story, 'id' | 'platform' | 'color'>>({
    histoire: '',
    conflit: '',
    message: '',
    tags: []
  });

  const handleAddStory = () => {
    if (!story.histoire.trim()) return;

    const newStory: Story = {
      id: crypto.randomUUID(),
      ...story,
      platform: 'Generic',
      color: '#3B82F6'
    };

    setStoryBank([...storyBank, newStory]);
  };

  const handleNext = () => {
    if (story.histoire.trim()) {
      handleAddStory();
    }
    setOnboardingStep(3);
  };

  const canProceed = story.histoire.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Créez votre première histoire
        </h1>
        <p className="text-muted-foreground">
          Les meilleures histoires suivent une structure simple : une situation, un conflit, et une leçon
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="histoire" className="text-base font-medium">
            Histoire
          </Label>
          <Textarea
            id="histoire"
            value={story.histoire}
            onChange={(e) => setStory({ ...story, histoire: e.target.value })}
            placeholder="Décris une scène marquante de ton parcours..."
            className="min-h-[100px] text-base resize-none"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="conflit" className="text-base font-medium">
            Conflit
          </Label>
          <Textarea
            id="conflit"
            value={story.conflit}
            onChange={(e) => setStory({ ...story, conflit: e.target.value })}
            placeholder="Quel blocage as-tu rencontré ?"
            className="min-h-[80px] text-base resize-none"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-base font-medium">
            Message
          </Label>
          <Textarea
            id="message"
            value={story.message}
            onChange={(e) => setStory({ ...story, message: e.target.value })}
            placeholder="Quelle leçon en as-tu tirée ?"
            className="min-h-[80px] text-base resize-none"
            rows={3}
          />
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => setOnboardingStep(1)}
            variant="outline"
            className="flex-1 h-12"
          >
            Retour
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 h-12 text-lg"
          >
            {story.histoire.trim() ? 'Ajouter & Continuer' : 'Passer'}
          </Button>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { FileText, Sparkles } from 'lucide-react';
import type { TranscriptChunk } from '@/lib/schemas';

// Demo transcript for quick onboarding
const DEMO_TRANSCRIPT = `I remember when I first started my business, I had absolutely no idea what I was doing. I was fresh out of college with a computer science degree, thinking I knew everything.

My first client meeting was a disaster. I showed up in jeans and a t-shirt to a corporate office. The client looked at me like I was a kid who got lost. I tried to explain my app development process, but I was using all this technical jargon that meant nothing to them.

They asked me about my previous work, and I had to admit this was my first real client. The silence in that room was deafening. I thought I had blown it completely.

But then something unexpected happened. The client started laughing. Not at me, but because he said he appreciated my honesty. He told me about his first business meeting 20 years ago where he made similar mistakes.

That meeting taught me that authenticity beats perfection every time. The client ended up hiring me, not because I was the most polished, but because I was genuine. That project launched my career and taught me the most valuable lesson in business.`;

export default function OnboardingStep1b() {  
  const { setTranscript, setOnboardingStep } = useAppStore();
  const [transcriptText, setTranscriptText] = useState('');

  const segmentTranscript = (text: string): TranscriptChunk[] => {
    if (!text.trim()) return [];
    
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    return paragraphs.map((paragraph, index) => ({
      id: `chunk-${index + 1}`,
      text: paragraph.trim(),
      start: index * 30,
      end: (index + 1) * 30
    }));
  };

  const handleNext = () => {
    const chunks = segmentTranscript(transcriptText);
    setTranscript(chunks);
    setOnboardingStep(2);
  };

  const handleUseDemo = () => {
    setTranscriptText(DEMO_TRANSCRIPT);
    const chunks = segmentTranscript(DEMO_TRANSCRIPT);
    setTranscript(chunks);
    setOnboardingStep(2);
  };

  const canProceed = transcriptText.trim().length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Ajoutez votre transcript
        </h1>
        <p className="text-muted-foreground">
          Collez le transcript de votre interview pour générer automatiquement vos premières histoires
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="transcript" className="text-base font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Transcript d'interview
          </Label>
          <Textarea
            id="transcript"
            value={transcriptText}
            onChange={(e) => setTranscriptText(e.target.value)}
            placeholder="Collez ici le transcript de votre interview..."
            className="min-h-[200px] text-base resize-none font-mono text-sm"
            rows={8}
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
            onClick={handleUseDemo}
            variant="outline"
            className="flex-1 h-12"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Utiliser démo
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canProceed}
            className="flex-1 h-12 text-lg"
          >
            Continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
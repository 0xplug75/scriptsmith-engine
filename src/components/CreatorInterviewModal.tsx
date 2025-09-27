import React, { useState } from 'react';
import { FileText, Mic, Upload, Wand2, BookOpen, ChevronLeft, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useAppStore } from '@/lib/store';
import { llmCall, safeJSON } from '@/lib/llm-client';
import type { Story } from '@/lib/schemas';
import { toast } from '@/hooks/use-toast';
import TextInfoModal from './TextInfoModal';


interface CreatorInterviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type InputType = 'text' | 'audio' | 'cv';
type Step = 'select' | 'input' | 'preview';

// LLM System prompts
const TRANSCRIPT_TO_STORIES_SYSTEM = `You are a Story Extractor. From a transcript or long text, return ONLY STRICT JSON:
[{ "histoire": string, "conflit": string, "message": string, "platform": "LinkedIn"|"Instagram"|"TikTok"|"YouTube"|"Generic", "tags": string[] }]
Constraints: 3–8 items. Each field concise and specific. No extra text.`;

const CV_TO_STORIES_SYSTEM = `You are a Professional Experience Extractor. From a CV/resume, extract professional experiences and transform them into engaging stories. Return ONLY STRICT JSON:
[{ "histoire": string, "conflit": string, "message": string, "platform": "LinkedIn"|"Instagram"|"TikTok"|"YouTube"|"Generic", "tags": string[] }]
Focus on: achievements, challenges overcome, lessons learned, career pivots, project successes/failures. Constraints: 3–6 items. Each field concise and specific. No extra text.`;

export default function CreatorInterviewModal({ open, onOpenChange }: CreatorInterviewModalProps) {
  const { profile, storyBank, setStoryBank, setActiveTab } = useAppStore();
  const [step, setStep] = useState<Step>('select');
  const [inputType, setInputType] = useState<InputType>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedStories, setGeneratedStories] = useState<Story[]>([]);
  const [selectedStories, setSelectedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTextInfo, setShowTextInfo] = useState(false);

  const hydrateStory = (storyData: any): Story => ({
    id: `story-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    histoire: storyData.histoire || '',
    conflit: storyData.conflit || '',
    message: storyData.message || '',
    platform: storyData.platform || 'Generic',
    color: '#3B82F6',
    tags: storyData.tags || [],
    score: Math.random() * 0.5 + 0.3 // Random score between 0.3-0.8
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleGenerate = async () => {
    if (!textInput.trim() && !selectedFile) return;

    try {
      setLoading(true);
      let contentToProcess = textInput;

      // Handle file processing
      if (selectedFile) {
        if (inputType === 'audio' || inputType === 'cv') {
          // Save file temporarily and parse it
          const tempPath = `temp-${Date.now()}-${selectedFile.name}`;
          // Create a temporary file path for processing
          const blob = selectedFile;
          const buffer = await blob.arrayBuffer();
          const uint8Array = new Uint8Array(buffer);
          
          // For now, we'll show a message that file processing is not fully implemented
          toast({
            title: "Fonctionnalité en développement",
            description: "Le traitement des fichiers audio et CV sera bientôt disponible. Utilisez le texte pour l'instant.",
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      // Determine system prompt based on input type
      const systemPrompt = inputType === 'cv' ? CV_TO_STORIES_SYSTEM : TRANSCRIPT_TO_STORIES_SYSTEM;

      const response = await llmCall({
        model: 'gemini-1.5-pro',
        system: systemPrompt,
        user: JSON.stringify({
          profile,
          content: contentToProcess,
          input_type: inputType
        })
      });

      const storiesData = safeJSON<any[]>(response);
      const stories = storiesData.map(hydrateStory);
      
      setGeneratedStories(stories);
      setSelectedStories(stories); // Select all by default
      setStep('preview');

      toast({
        title: "Histoires générées!",
        description: `${stories.length} histoires extraites de votre contenu`
      });
    } catch (error) {
      console.error('Story generation error:', error);
      toast({
        title: "Échec de la génération",
        description: "Veuillez réessayer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (selectedStories.length === 0) return;
    
    // Add stories to the bank
    setStoryBank([...storyBank, ...selectedStories]);
    
    // Generate content for each story
    const { generateAllContent } = await import('@/lib/content-generator');
    for (const story of selectedStories) {
      if (story.histoire && story.conflit && story.message) {
        setTimeout(() => generateAllContent(story.id), 100);
      }
    }
    
    toast({
      title: "Histoires ajoutées!",
      description: `${selectedStories.length} histoires ajoutées avec génération de contenu automatique`
    });
    
    // Navigate to content page
    setActiveTab('output');
    onOpenChange(false);
    
    // Reset state
    resetModal();
  };

  const toggleStorySelection = (story: Story) => {
    setSelectedStories(prev => 
      prev.some(s => s.id === story.id)
        ? prev.filter(s => s.id !== story.id)
        : [...prev, story]
    );
  };

  const resetModal = () => {
    setStep('select');
    setInputType('text');
    setTextInput('');
    setSelectedFile(null);
    setGeneratedStories([]);
    setSelectedStories([]);
  };

  const handleClose = () => {
    onOpenChange(false);
    resetModal();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Interview créateur</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                Choisissez comment vous souhaitez créer vos histoires
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card 
                className={`cursor-pointer transition-all ${
                  inputType === 'text' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setInputType('text')}
              >
                <CardContent className="p-4 text-center space-y-3">
                  <FileText className="h-8 w-8 mx-auto text-primary" />
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <h3 className="font-semibold">Texte</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowTextInfo(true);
                        }}
                        className="h-5 w-5 p-0 hover:bg-primary/10"
                      >
                        <Info className="h-3 w-3 text-primary" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Interview écrite, expériences, anecdotes
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${
                  inputType === 'audio' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setInputType('audio')}
              >
                <CardContent className="p-4 text-center space-y-3">
                  <Mic className="h-8 w-8 mx-auto text-accent" />
                  <div>
                    <h3 className="font-semibold">Audio</h3>
                    <p className="text-sm text-muted-foreground">
                      Enregistrement, interview, témoignage
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className={`cursor-pointer transition-all ${
                  inputType === 'cv' ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-muted/50'
                }`}
                onClick={() => setInputType('cv')}
              >
                <CardContent className="p-4 text-center space-y-3">
                  <Upload className="h-8 w-8 mx-auto text-success" />
                  <div>
                    <h3 className="font-semibold">CV</h3>
                    <p className="text-sm text-muted-foreground">
                      Expériences professionnelles, parcours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep('input')}>
                Continuer
              </Button>
            </div>
          </div>
        )}

        {step === 'input' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('select')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">
                {inputType === 'text' && 'Saisissez votre contenu'}
                {inputType === 'audio' && 'Uploadez votre fichier audio'}
                {inputType === 'cv' && 'Uploadez votre CV'}
              </h3>
            </div>

            {inputType === 'text' && (
              <Card>
                <CardContent className="p-4 space-y-4">
                  <Textarea
                    placeholder="Décrivez vos expériences, anecdotes, parcours professionnel... Plus vous donnez de détails, plus les histoires générées seront riches et personnalisées."
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                </CardContent>
              </Card>
            )}

            {(inputType === 'audio' || inputType === 'cv') && (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="p-4 border-2 border-dashed border-muted-foreground/30 rounded-lg">
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-4">
                        {inputType === 'audio' && 'Formats supportés: MP3, WAV, M4A'}
                        {inputType === 'cv' && 'Formats supportés: PDF, DOC, DOCX'}
                      </p>
                      <input
                        type="file"
                        accept={inputType === 'audio' ? 'audio/*' : '.pdf,.doc,.docx'}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload">
                        <Button variant="outline" className="cursor-pointer" asChild>
                          <span>Choisir un fichier</span>
                        </Button>
                      </label>
                    </div>
                    {selectedFile && (
                      <p className="text-sm text-foreground">
                        Fichier sélectionné: {selectedFile.name}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
              >
                Retour
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={loading || (!textInput.trim() && !selectedFile)}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>Génération...</>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    Générer les histoires
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep('input')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="font-semibold">Sélectionnez vos histoires</h3>
            </div>

            <div className="grid gap-4 max-h-[400px] overflow-y-auto">
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
                        <h4 className="font-semibold text-foreground">{story.histoire}</h4>
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
                        {story.tags && story.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {story.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="px-2 py-1 bg-muted text-xs rounded-md"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {selectedStories.length} histoire(s) sélectionnée(s)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setStep('input')}
                >
                  Retour
                </Button>
                <Button
                  onClick={handleConfirm}
                  disabled={selectedStories.length === 0}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Ajouter les histoires ({selectedStories.length})
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
      <TextInfoModal 
        open={showTextInfo}
        onOpenChange={setShowTextInfo}
      />
    </Dialog>
  );
}
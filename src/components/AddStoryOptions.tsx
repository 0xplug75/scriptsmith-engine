import React, { useState } from 'react';
import { BookOpen, Mic } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CreatorInterviewModal from './CreatorInterviewModal';

interface AddStoryOptionsProps {
  onAddStory: () => void;
}

export default function AddStoryOptions({ onAddStory }: AddStoryOptionsProps) {
  const [showInterviewModal, setShowInterviewModal] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[120px]">
        {/* Manual Story Creation */}
        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-elegant-md hover:scale-[1.02] bg-gradient-card border-border/50 group"
          onClick={onAddStory}
        >
          <CardContent className="p-6 text-center space-y-3 h-full flex flex-col justify-center">
            <div className="flex justify-center">
              <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Ajouter une histoire</h3>
              <p className="text-sm text-muted-foreground">
                Créer manuellement une nouvelle histoire
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Creator Interview */}
        <Card 
          className="cursor-pointer transition-all duration-200 hover:shadow-elegant-md hover:scale-[1.02] bg-gradient-card border-border/50 group"
          onClick={() => setShowInterviewModal(true)}
        >
          <CardContent className="p-6 text-center space-y-3 h-full flex flex-col justify-center">
            <div className="flex justify-center">
              <div className="p-3 bg-accent/10 rounded-full group-hover:bg-accent/20 transition-colors">
                <Mic className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-foreground">Interview créateur</h3>
              <p className="text-sm text-muted-foreground">
                Générer des histoires à partir de texte, audio ou CV
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <CreatorInterviewModal 
        open={showInterviewModal}
        onOpenChange={setShowInterviewModal}
      />
    </>
  );
}
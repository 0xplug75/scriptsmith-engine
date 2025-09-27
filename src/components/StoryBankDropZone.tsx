import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface StoryBankDropZoneProps {
  onAddStory: () => void;
}

export default function StoryBankDropZone({ onAddStory }: StoryBankDropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const { assignments, setAssignments } = useAppStore();

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const storyId = e.dataTransfer.getData("application/onetake-story-id");
    const fromDate = e.dataTransfer.getData("application/onetake-from-date");
    
    if (storyId && fromDate) {
      // Remove story from calendar day
      setAssignments(prev => {
        const next = { ...prev };
        if (next[fromDate]) {
          next[fromDate] = next[fromDate].filter(id => id !== storyId);
          if (next[fromDate].length === 0) {
            delete next[fromDate];
          }
        }
        return next;
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div
      className={`
        relative min-h-[120px] border-2 border-dashed rounded-lg transition-all duration-200 
        flex items-center justify-center cursor-pointer group
        ${dragOver 
          ? 'border-accent bg-accent/10 text-accent' 
          : 'border-muted-foreground/30 text-muted-foreground hover:border-accent/50 hover:text-accent/70'
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={onAddStory}
    >
      <div className="text-center space-y-2">
        <PlusCircle className="h-8 w-8 mx-auto" />
        <div className="text-sm font-medium">
          {dragOver ? 'Déposer ici pour retirer du planning' : 'Ajouter une nouvelle histoire'}
        </div>
        <div className="text-xs opacity-70">
          Ou glissez depuis le calendrier pour retirer
        </div>
      </div>
    </div>
  );
}
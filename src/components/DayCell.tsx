import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import StoryCard from "./StoryCard";
import type { Story } from "@/lib/schemas";

interface DayCellProps {
  date: Date;
  iso: string;
  stories: Story[];
  isToday: boolean;
  isCurrentMonth: boolean;
  onDropStory: (storyId: string, dateISO: string, fromISO?: string) => void;
  onReorder: (fromIndex: number, toIndex: number, dateISO: string) => void;
  onEditStory: (story: Story) => void;
}

export default function DayCell({ 
  date, 
  iso, 
  stories, 
  isToday, 
  isCurrentMonth, 
  onDropStory, 
  onReorder,
  onEditStory 
}: DayCellProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleCopyDate = async () => {
    try { 
      await navigator.clipboard.writeText(iso); 
    } catch { 
      alert(iso); 
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const storyId = e.dataTransfer.getData("application/onetake-story-id");
    const fromDate = e.dataTransfer.getData("application/onetake-from-date") || "";
    
    if (storyId) {
      onDropStory(storyId, iso, fromDate);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  };

  const handleItemDragStart = (e: React.DragEvent, storyId: string, index: number) => {
    e.dataTransfer.setData("application/onetake-story-id", storyId);
    e.dataTransfer.setData("application/onetake-from-date", iso);
    e.dataTransfer.setData("application/onetake-from-index", String(index));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleItemDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    
    const fromDate = e.dataTransfer.getData("application/onetake-from-date");
    const fromIndex = parseInt(e.dataTransfer.getData("application/onetake-from-index"));
    
    // Only reorder if dropping within same day
    if (fromDate === iso && !isNaN(fromIndex) && fromIndex !== targetIndex) {
      onReorder(fromIndex, targetIndex, iso);
    }
  };

  const handleItemDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`
        relative min-h-[120px] p-2 border rounded-lg transition-all duration-200
        ${isCurrentMonth ? 'bg-card' : 'bg-muted/30'}
        ${isToday ? 'ring-2 ring-primary shadow-md' : ''}
        ${dragOver ? 'bg-accent/20 border-accent ring-2 ring-accent/50' : 'border-border'}
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Date Header */}
      <div className="flex items-center justify-between mb-2">
        <span className={`text-sm font-medium ${isCurrentMonth ? 'text-foreground' : 'text-muted-foreground'}`}>
          {date.getDate()}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopyDate}
          title={`Copier la date: ${iso}`}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>

      {/* Stories List */}
      <div className="space-y-1">
        {stories.map((story, index) => (
          <div
            key={story.id}
            draggable
            onDragStart={(e) => handleItemDragStart(e, story.id, index)}
            onDrop={(e) => handleItemDrop(e, index)}
            onDragOver={handleItemDragOver}
          >
            <StoryCard
              story={story}
              draggable={false} // Handled by parent div
              onEdit={onEditStory}
            />
          </div>
        ))}
      </div>

      {/* Drop Zone Indicator */}
      {dragOver && stories.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center border-2 border-dashed border-accent rounded-lg bg-accent/10">
          <span className="text-accent text-sm font-medium">Déposer ici</span>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Copy, Edit, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Story, Platform } from "@/lib/schemas";

const PLATFORM_COLORS = {
  Instagram: "bg-gradient-to-br from-pink-500 to-purple-600",
  LinkedIn: "bg-gradient-to-br from-blue-600 to-blue-700",
  TikTok: "bg-gradient-to-br from-black to-red-500",
  YouTube: "bg-gradient-to-br from-red-500 to-red-600",
  Generic: "bg-gradient-to-br from-gray-500 to-gray-600"
};

const PLATFORM_EMOJI = {
  Instagram: "📸",
  LinkedIn: "💼", 
  TikTok: "🎵",
  YouTube: "📺",
  Generic: "📝"
};

interface StoryCardProps {
  story: Story;
  draggable?: boolean;
  onEdit?: (story: Story) => void;
  onDelete?: (storyId: string) => void;
  onDuplicate?: (story: Story) => void;
  onGenerate?: (story: Story, format: string) => void;
}

export default function StoryCard({ 
  story, 
  draggable = true, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onGenerate 
}: StoryCardProps) {
  const [editing, setEditing] = useState(false);

  const handleCopyStory = async () => {
    const fullText = `Histoire: ${story.histoire}\n\nConflit: ${story.conflit}\n\nMessage: ${story.message}`;
    
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      alert(fullText);
    }
  };

  return (
    <div
      draggable={draggable && !editing}
      onDragStart={(e) => {
        if (editing) { 
          e.preventDefault(); 
          return; 
        }
        e.dataTransfer.setData("application/onetake-story-id", story.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className={`group flex items-center gap-2 rounded-xl px-3 py-2 text-white shadow-sm ${story.color} cursor-grab active:cursor-grabbing select-none hover:shadow-md transition-shadow`}
    >
      <span className="text-lg" title={`Platform: ${story.platform}`}>
        {PLATFORM_EMOJI[story.platform]}
      </span>
      
      <input
        className="flex-1 bg-transparent outline-none placeholder-white/70 text-sm font-medium"
        value={story.histoire}
        onFocus={() => setEditing(true)}
        onBlur={() => setEditing(false)}
        onChange={(e) => onEdit && onEdit({ ...story, histoire: e.target.value })}
        placeholder="Nouvelle histoire…"
      />
      
      <select
        title="Plateforme"
        className="rounded-md bg-white/20 px-2 py-1 text-xs backdrop-blur-sm border border-white/10 text-white"
        value={story.platform}
        onChange={(e) => {
          const platform = e.target.value as Platform;
          const color = PLATFORM_COLORS[platform];
          onEdit && onEdit({ ...story, platform, color });
        }}
      >
        {(["Instagram", "LinkedIn", "TikTok", "YouTube", "Generic"] as Platform[]).map(p => (
          <option key={p} value={p} className="text-gray-900">
            {PLATFORM_EMOJI[p]} {p}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
          onClick={handleCopyStory}
          title="Copier le contenu"
        >
          <Copy className="h-3 w-3" />
        </Button>
        
        {onDuplicate && (
          <Button
            variant="ghost"
            size="icon" 
            className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => onDuplicate(story)}
            title="Dupliquer"
          >
            <Edit className="h-3 w-3" />
          </Button>
        )}
        
        {onGenerate && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => onGenerate(story, 'all')}
            title="Générer contenu"
          >
            <ExternalLink className="h-3 w-3" />
          </Button>
        )}
        
        {onDelete && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-white/70 hover:text-red-200 hover:bg-red-500/20"
            onClick={() => onDelete(story.id)}
            title="Supprimer"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
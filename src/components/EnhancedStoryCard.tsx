import { useState } from "react";
import { Copy, Edit2, Trash2, ExternalLink, Save, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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

interface EnhancedStoryCardProps {
  story: Story;
  draggable?: boolean;
  onEdit?: (story: Story) => void;
  onDelete?: (storyId: string) => void;
  onDuplicate?: (story: Story) => void;
  onGenerate?: (story: Story, format: string) => void;
  onSuggestVariations?: (story: Story) => void;
}

export default function EnhancedStoryCard({ 
  story, 
  draggable = true, 
  onEdit, 
  onDelete, 
  onDuplicate, 
  onGenerate,
  onSuggestVariations
}: EnhancedStoryCardProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editedStory, setEditedStory] = useState(story);

  const handleSave = () => {
    if (onEdit) {
      onEdit(editedStory);
    }
    setEditing(false);
  };

  const handleCancel = () => {
    setEditedStory(story);
    setEditing(false);
  };

  const handleCopyStory = async () => {
    const fullText = `Histoire: ${story.histoire}\n\nConflit: ${story.conflit}\n\nMessage: ${story.message}`;
    
    try {
      await navigator.clipboard.writeText(fullText);
    } catch {
      alert(fullText);
    }
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
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
      className="group bg-card rounded-xl border shadow-elegant-sm hover:shadow-elegant-md transition-all duration-200 overflow-hidden"
    >
      {/* Header with platform indicator */}
      <div className={`px-4 py-3 text-white ${story.color}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{PLATFORM_EMOJI[story.platform]}</span>
            <Badge variant="secondary" className="text-xs bg-white/20 text-white border-white/20">
              {story.platform}
            </Badge>
          </div>
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
            
            <Button
              variant="ghost"
              size="icon" 
              className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setEditing(true)}
              title="Éditer"
            >
              <Edit2 className="h-3 w-3" />
            </Button>
            
            {onSuggestVariations && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white/70 hover:text-white hover:bg-white/10"
                onClick={() => onSuggestVariations(story)}
                title="Suggestions"
              >
                <Sparkles className="h-3 w-3" />
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
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Histoire</label>
              <Textarea
                value={editedStory.histoire}
                onChange={(e) => setEditedStory({ ...editedStory, histoire: e.target.value })}
                placeholder="Décris une scène précise qui t'a marqué..."
                className="mt-1 min-h-[80px] resize-none"
                rows={3}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Conflit</label>
              <Textarea
                value={editedStory.conflit}
                onChange={(e) => setEditedStory({ ...editedStory, conflit: e.target.value })}
                placeholder="Quel obstacle ou tension as-tu rencontré..."
                className="mt-1 min-h-[60px] resize-none"
                rows={2}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">Message</label>
              <Textarea
                value={editedStory.message}
                onChange={(e) => setEditedStory({ ...editedStory, message: e.target.value })}
                placeholder="Quelle leçon ou insight veux-tu transmettre..."
                className="mt-1 min-h-[60px] resize-none"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} size="sm" className="flex-1">
                <Save className="w-3 h-3 mr-1" />
                Sauver
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm" className="flex-1">
                <X className="w-3 h-3 mr-1" />
                Annuler
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Histoire - Always visible */}
            <div>
              <h3 className="font-semibold text-lg leading-tight text-foreground">
                {story.histoire}
              </h3>
            </div>

            {/* Conflit & Message - Visible by default with truncation */}
            <div className="space-y-2">
              {story.conflit && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Conflit</p>
                  <p className="text-sm text-foreground">
                    {expanded ? story.conflit : truncateText(story.conflit, 80)}
                  </p>
                </div>
              )}

              {story.message && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Message</p>
                  <p className="text-sm text-foreground">
                    {expanded ? story.message : truncateText(story.message, 80)}
                  </p>
                </div>
              )}

              {/* Show/Hide toggle for long content */}
              {(story.conflit?.length > 80 || story.message?.length > 80) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setExpanded(!expanded)}
                  className="text-xs text-muted-foreground hover:text-foreground p-0 h-auto"
                >
                  {expanded ? 'Voir moins' : 'Voir plus'}
                </Button>
              )}
            </div>

            {/* Tags */}
            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {story.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {story.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{story.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { Copy, Edit, Trash2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Story, Platform } from "@/lib/schemas";

const PLATFORM_COLORS = {
  Instagram: "bg-gradient-to-br from-pink-500 to-purple-600",
  LinkedIn: "bg-gradient-to-br from-blue-600 to-blue-700", 
  TikTok: "bg-gradient-to-br from-black to-red-500",
  YouTube: "bg-gradient-to-br from-red-500 to-red-600",
  Generic: "bg-gradient-to-br from-gray-500 to-gray-600"
};

interface StoryCardProps {
  story: Story;
  draggable?: boolean;
  onEdit?: (story: Story) => void;
  onDelete?: (storyId: string) => void;
  onDuplicate?: (story: Story) => void;
}

export default function UpdatedStoryCard({ 
  story, 
  draggable = true, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: StoryCardProps) {
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editStory, setEditStory] = useState({
    histoire: story.histoire,
    conflit: story.conflit,
    message: story.message
  });

  const handleSave = () => {
    onEdit?.({ ...story, ...editStory });
    setEditing(false);
  };

  const handleCopy = async () => {
    const text = `Histoire: ${story.histoire}\n\nConflit: ${story.conflit}\n\nMessage: ${story.message}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert(text);
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
      className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
    >
      {editing ? (
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Histoire</label>
            <Textarea
              value={editStory.histoire}
              onChange={(e) => setEditStory({ ...editStory, histoire: e.target.value })}
              placeholder="Décris une scène marquante..."
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Conflit</label>
            <Textarea
              value={editStory.conflit}
              onChange={(e) => setEditStory({ ...editStory, conflit: e.target.value })}
              placeholder="Quel blocage as-tu rencontré ?"
              rows={2}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">Message</label>
            <Textarea
              value={editStory.message}
              onChange={(e) => setEditStory({ ...editStory, message: e.target.value })}
              placeholder="Quelle leçon en as-tu tirée ?"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} size="sm">Sauver</Button>
            <Button onClick={() => setEditing(false)} variant="outline" size="sm">
              Annuler
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 
              className="font-semibold text-foreground cursor-pointer flex-1"
              onClick={() => setEditing(true)}
            >
              {story.histoire || 'Nouvelle histoire'}
            </h3>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
              <Button variant="ghost" size="sm" onClick={handleCopy}>
                <Copy className="h-3 w-3" />
              </Button>
              {onDuplicate && (
                <Button variant="ghost" size="sm" onClick={() => onDuplicate(story)}>
                  <Edit className="h-3 w-3" />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="sm" onClick={() => onDelete(story.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
          
          {(story.conflit || story.message) && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="p-0 h-auto text-xs text-muted-foreground"
              >
                {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                {expanded ? 'Réduire' : 'Voir détails'}
              </Button>
              
              {expanded && (
                <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {story.conflit && <p><strong>Conflit:</strong> {story.conflit}</p>}
                  {story.message && <p><strong>Message:</strong> {story.message}</p>}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
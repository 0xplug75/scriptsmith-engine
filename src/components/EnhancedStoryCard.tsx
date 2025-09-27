import React, { useState } from 'react';
import { Edit2, Trash2, Copy, Wand2, Lightbulb, MoreVertical, Star, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import type { Story, Platform } from '@/lib/schemas';
import { toast } from '@/hooks/use-toast';
import { generateLinkedIn, generateInstagram, generateTikTok } from '@/lib/content-generator';
import OutputsViewer from './OutputsViewer';

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
  onEdit?: (story: Story) => void;
  onDelete?: (story: Story) => void;
  onDuplicate?: (story: Story) => void;
  onGenerate?: (story: Story) => void;
  onSuggestVariations?: (story: Story) => void;
}

export default function EnhancedStoryCard({ story, onEdit, onDelete, onDuplicate, onGenerate, onSuggestVariations }: EnhancedStoryCardProps) {
  const { updateStory, favorites, toggleFavorite, generationLoading, outputsByStoryId } = useAppStore();
  const [editing, setEditing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editedStory, setEditedStory] = useState(story);
  
  const isFavorite = favorites.includes(story.id);
  const isGenerating = generationLoading === story.id;
  const hasOutputs = outputsByStoryId[story.id] && 
    (outputsByStoryId[story.id].linkedin || outputsByStoryId[story.id].instagram_carousel || outputsByStoryId[story.id].tiktok_script);

  const handleSave = () => {
    updateStory(editedStory);
    setEditing(false);
    if (onEdit) onEdit(editedStory);
    toast({
      title: "Histoire mise à jour",
      description: "Les modifications ont été sauvegardées"
    });
  };

  const handleCancel = () => {
    setEditedStory(story);
    setEditing(false);
  };

  const handleCopyStory = async () => {
    const storyText = `Histoire: ${story.histoire}\nConflit: ${story.conflit}\nMessage: ${story.message}`;
    try {
      await navigator.clipboard.writeText(storyText);
      toast({
        title: "Copiée !",
        description: "L'histoire a été copiée dans le presse-papiers"
      });
    } catch (error) {
      toast({
        title: "Erreur de copie",
        description: "Impossible de copier l'histoire",
        variant: "destructive"
      });
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const platformGradient = PLATFORM_COLORS[story.platform] || PLATFORM_COLORS.Generic;
  const platformEmoji = PLATFORM_EMOJI[story.platform] || PLATFORM_EMOJI.Generic;

  return (
    <Card 
      className={`group relative overflow-hidden transition-all duration-200 hover:shadow-md ${platformGradient} ${
        editing || isGenerating ? 'ring-2 ring-primary' : ''
      }`}
      draggable={!editing && !isGenerating}
      onDragStart={(e) => {
        if (editing || isGenerating) {
          e.preventDefault();
          return;
        }
        e.dataTransfer.setData('text/plain', JSON.stringify({
          type: 'story',
          story: story
        }));
      }}
    >
      <CardHeader className="pb-3">
        {/* Platform header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">{platformEmoji}</span>
            <Badge variant="secondary" className="bg-white/20 text-white/90 hover:bg-white/30">
              {story.platform}
            </Badge>
          </div>
        </div>

        {/* Action buttons */}
        <div className={`absolute top-2 right-2 flex gap-1 transition-opacity ${
          editing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}>
          {editing ? (
            <>
              <Button size="sm" variant="secondary" onClick={handleSave} className="h-8 px-2">
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={handleCancel} className="h-8 px-2">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => toggleFavorite(story.id)}
                className={`h-8 w-8 p-0 hover:bg-white/20 ${isFavorite ? 'text-yellow-400' : ''}`}
              >
                <Star className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
              </Button>

              <Button size="sm" variant="ghost" onClick={handleCopyStory} className="h-8 w-8 p-0 hover:bg-white/20">
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="h-8 w-8 p-0 hover:bg-white/20">
                <Edit2 className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-white/20">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onDuplicate && (
                    <DropdownMenuItem onClick={() => onDuplicate(story)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                  )}
                  {onSuggestVariations && (
                    <DropdownMenuItem onClick={() => onSuggestVariations(story)}>
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Suggest Variations
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem 
                      onClick={() => onDelete(story)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white/90 block mb-2">Histoire</label>
              <Textarea
                value={editedStory.histoire}
                onChange={(e) => setEditedStory({ ...editedStory, histoire: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Décris une scène précise qui t'a marqué."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-white/90 block mb-2">Conflit</label>
              <Textarea
                value={editedStory.conflit}
                onChange={(e) => setEditedStory({ ...editedStory, conflit: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Quel obstacle ou tension as-tu rencontré."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-white/90 block mb-2">Message</label>
              <Textarea
                value={editedStory.message}
                onChange={(e) => setEditedStory({ ...editedStory, message: e.target.value })}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                placeholder="Quelle leçon ou insight veux-tu transmettre."
              />
            </div>

            <Select
              value={editedStory.platform}
              onValueChange={(value: Platform) => setEditedStory({ ...editedStory, platform: value })}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LinkedIn">💼 LinkedIn</SelectItem>
                <SelectItem value="Instagram">📸 Instagram</SelectItem>
                <SelectItem value="TikTok">🎵 TikTok</SelectItem>
                <SelectItem value="YouTube">📺 YouTube</SelectItem>
                <SelectItem value="Generic">📝 Generic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-white/90 mb-1">Histoire</p>
              <p className="text-white/80 text-sm leading-relaxed">
                {expanded || story.histoire.length <= 100 
                  ? story.histoire 
                  : `${story.histoire.slice(0, 100)}...`}
              </p>
            </div>

            {story.conflit && (
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">Conflit</p>
                <p className="text-white/70 text-sm">
                  {expanded || story.conflit.length <= 80 
                    ? story.conflit 
                    : `${story.conflit.slice(0, 80)}...`}
                </p>
              </div>
            )}

            {story.message && (
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">Message</p>
                <p className="text-white/70 text-sm">
                  {expanded || story.message.length <= 80 
                    ? story.message 
                    : `${story.message.slice(0, 80)}...`}
                </p>
              </div>
            )}

            {(story.histoire.length > 100 || story.conflit.length > 80 || story.message.length > 80) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-0 h-auto"
              >
                {expanded ? 'Voir moins' : 'Voir plus'}
              </Button>
            )}

            {/* Content generation buttons */}
            <div className="flex flex-wrap gap-2 pt-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => generateLinkedIn(story.id)}
                disabled={isGenerating}
                className="text-xs bg-blue-600 hover:bg-blue-700 text-white border-0"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                LinkedIn
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => generateInstagram(story.id)}
                disabled={isGenerating}
                className="text-xs bg-pink-600 hover:bg-pink-700 text-white border-0"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                Instagram
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => generateTikTok(story.id)}
                disabled={isGenerating}
                className="text-xs bg-black hover:bg-gray-800 text-white border-0"
              >
                {isGenerating ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : null}
                TikTok
              </Button>
              {hasOutputs && (
                <OutputsViewer storyId={story.id}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-white/30 text-white/90 hover:bg-white/10"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    Voir
                  </Button>
                </OutputsViewer>
              )}
            </div>

            {story.tags && story.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-2">
                {story.tags.slice(0, 3).map((tag, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="text-xs bg-white/20 text-white/90 hover:bg-white/30"
                  >
                    {tag}
                  </Badge>
                ))}
                {story.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-white/20 text-white/70">
                    +{story.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
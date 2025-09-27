import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppStore } from '@/lib/store';
import type { Platform } from '@/lib/schemas';
import { User, Target } from 'lucide-react';

const PLATFORM_OPTIONS = [
  { value: "LinkedIn", label: "LinkedIn", description: "Professional networking", emoji: "💼" },
  { value: "Instagram", label: "Instagram", description: "Visual storytelling", emoji: "📸" },
  { value: "TikTok", label: "TikTok", description: "Short-form video", emoji: "🎵" },
  { value: "YouTube", label: "YouTube", description: "Video content", emoji: "🎥" },
  { value: "Generic", label: "Other", description: "General content", emoji: "✨" }
];

export default function ProfileForm() {
  const { profile, setProfile, setActiveTab, restartOnboarding } = useAppStore();
  const [localProfile, setLocalProfile] = useState(profile);

  const togglePlatform = (platformId: Platform) => {
    const newPlatforms = localProfile.platforms.includes(platformId)
      ? localProfile.platforms.filter(p => p !== platformId)
      : [...localProfile.platforms, platformId];
    
    setLocalProfile({ ...localProfile, platforms: newPlatforms });
  };

  const handleSave = () => {
    setProfile(localProfile);
    setActiveTab('story-bank');
  };

  const isComplete = localProfile.name.trim() && localProfile.platforms.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Profil Utilisateur</h2>
        <p className="text-lg text-muted-foreground">
          Gérez vos informations personnelles
        </p>
      </div>

      <Card className="shadow-elegant-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Informations personnelles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              value={localProfile.name}
              onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
              placeholder="Votre nom complet"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="role">Rôle (optionnel)</Label>
            <Input
              id="role"
              value={localProfile.role || ''}
              onChange={(e) => setLocalProfile({ ...localProfile, role: e.target.value })}
              placeholder="ex: Entrepreneur, Coach, Consultant..."
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-elegant-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-success" />
            Plateformes cibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PLATFORM_OPTIONS.map(platform => (
              <div
                key={platform.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  localProfile.platforms.includes(platform.value as Platform)
                    ? 'border-primary bg-primary/5 shadow-elegant-sm'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => togglePlatform(platform.value as Platform)}
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>{platform.emoji}</span>
                  {platform.label}
                </div>
                <div className="text-sm text-muted-foreground">{platform.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button 
          className="flex-1 shadow-elegant-md"
          onClick={handleSave}
          disabled={!isComplete}
          size="lg"
        >
          Sauvegarder & Continuer
        </Button>
        
        <Button 
          variant="outline"
          onClick={restartOnboarding}
          size="lg"
        >
          Redémarrer l'onboarding
        </Button>
      </div>
    </div>
  );
}
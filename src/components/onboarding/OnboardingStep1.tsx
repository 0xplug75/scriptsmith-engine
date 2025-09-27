import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAppStore } from '@/lib/store';
import type { Platform } from '@/lib/schemas';

const PLATFORMS: { id: Platform; label: string; emoji: string }[] = [
  { id: 'LinkedIn', label: 'LinkedIn', emoji: '💼' },
  { id: 'Instagram', label: 'Instagram', emoji: '📸' },
  { id: 'TikTok', label: 'TikTok', emoji: '🎵' },
  { id: 'YouTube', label: 'YouTube', emoji: '🎥' },
  { id: 'Generic', label: 'Autre', emoji: '✨' },
];

export default function OnboardingStep1() {
  const { profile, setProfile, setOnboardingStep } = useAppStore();
  const [localProfile, setLocalProfile] = useState(profile);

  const handlePlatformChange = (platformId: Platform, checked: boolean) => {
    const newPlatforms = checked
      ? [...localProfile.platforms, platformId]
      : localProfile.platforms.filter(p => p !== platformId);
    
    setLocalProfile({ ...localProfile, platforms: newPlatforms });
  };

  const handleNext = () => {
    setProfile(localProfile);
    setOnboardingStep(2);
  };

  const canProceed = localProfile.name.trim() && localProfile.platforms.length > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">
          Bienvenue sur OneTake
        </h1>
        <p className="text-muted-foreground">
          Commençons par configurer votre profil
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            value={localProfile.name}
            onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
            placeholder="Votre nom complet"
            className="text-lg h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Rôle (optionnel)</Label>
          <Input
            id="role"
            value={localProfile.role || ''}
            onChange={(e) => setLocalProfile({ ...localProfile, role: e.target.value })}
            placeholder="ex: Entrepreneur, Coach, Consultant..."
            className="text-lg h-12"
          />
        </div>

        <div className="space-y-4">
          <Label>Plateformes cibles</Label>
          <div className="grid grid-cols-2 gap-3">
            {PLATFORMS.map((platform) => (
              <div key={platform.id} className="flex items-center space-x-3 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <Checkbox
                  id={platform.id}
                  checked={localProfile.platforms.includes(platform.id)}
                  onCheckedChange={(checked) => handlePlatformChange(platform.id, checked as boolean)}
                />
                <label
                  htmlFor={platform.id}
                  className="flex items-center space-x-2 text-sm font-medium cursor-pointer flex-1"
                >
                  <span className="text-lg">{platform.emoji}</span>
                  <span>{platform.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full h-12 text-lg"
          size="lg"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}
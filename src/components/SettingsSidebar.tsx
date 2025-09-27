import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/lib/store';
import { Settings, User, RefreshCw, X } from 'lucide-react';
import { useState } from 'react';

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsSidebar({ isOpen, onClose }: SettingsSidebarProps) {
  const { profile, restartOnboarding } = useAppStore();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-80 bg-sidebar border-l border-sidebar-border z-50 shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-sidebar-foreground" />
              <h2 className="text-lg font-semibold text-sidebar-foreground">Paramètres</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-sidebar-accent"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4 space-y-6 overflow-y-auto">
            {/* Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-sidebar-primary" />
                <h3 className="font-medium text-sidebar-foreground">Profil</h3>
              </div>
              
              <div className="bg-sidebar-accent rounded-lg p-4 space-y-3">
                <div>
                  <Label className="text-sm font-medium text-sidebar-accent-foreground">Nom</Label>
                  <p className="text-sidebar-foreground text-sm mt-1">
                    {profile.name || 'Non défini'}
                  </p>
                </div>
                
                {profile.role && (
                  <div>
                    <Label className="text-sm font-medium text-sidebar-accent-foreground">Rôle</Label>
                    <p className="text-sidebar-foreground text-sm mt-1">{profile.role}</p>
                  </div>
                )}
                
                <div>
                  <Label className="text-sm font-medium text-sidebar-accent-foreground">Plateformes</Label>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {profile.platforms.length > 0 ? (
                      profile.platforms.map(platform => (
                        <Badge key={platform} variant="secondary" className="text-xs">
                          {platform}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sidebar-foreground text-sm">Aucune plateforme sélectionnée</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-sidebar-foreground">Actions</h3>
              
              <Button 
                onClick={() => {
                  restartOnboarding();
                  onClose();
                }} 
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Redémarrer l'onboarding
              </Button>
            </div>

            {/* App Info */}
            <div className="pt-4 border-t border-sidebar-border">
              <div className="text-xs text-sidebar-accent-foreground">
                <p>OneTake v1.0</p>
                <p>Générateur d'histoires IA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
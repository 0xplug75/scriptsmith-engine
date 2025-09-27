import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

export default function ProfileFormSimple() {
  const { profile, restartOnboarding } = useAppStore();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-card rounded-lg p-6 border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Profil</h2>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Nom</label>
            <p className="text-foreground">{profile.name || 'Non défini'}</p>
          </div>
          {profile.role && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Rôle</label>
              <p className="text-foreground">{profile.role}</p>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-muted-foreground">Plateformes</label>
            <p className="text-foreground">
              {profile.platforms.length > 0 
                ? profile.platforms.join(', ')
                : 'Aucune plateforme sélectionnée'
              }
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 border shadow-sm">
        <h3 className="text-lg font-medium mb-2">Paramètres</h3>
        <Button 
          onClick={restartOnboarding} 
          variant="outline"
          className="w-full"
        >
          Redémarrer l'onboarding
        </Button>
      </div>
    </div>
  );
}
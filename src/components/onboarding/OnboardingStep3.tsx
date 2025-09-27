import { Button } from '@/components/ui/button';
import { useAppStore } from '@/lib/store';

export default function OnboardingStep3() {
  const { setOnboardingComplete, setActiveTab } = useAppStore();

  const handleComplete = () => {
    setOnboardingComplete(true);
    setActiveTab('story-bank');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 text-center">
      <div className="space-y-4">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-foreground">
          Parfait ! Vous êtes prêt
        </h1>
        <p className="text-muted-foreground text-lg">
          Votre profil est configuré. Vous pouvez maintenant créer vos histoires et les planifier sur le calendrier.
        </p>
      </div>

      <div className="bg-muted/50 rounded-lg p-6 space-y-4">
        <h3 className="font-semibold text-foreground">Prochaines étapes :</h3>
        <ul className="text-sm text-muted-foreground space-y-2 text-left">
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Créez plus d'histoires dans la Story Bank</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Planifiez vos publications sur le calendrier</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary">•</span>
            <span>Utilisez le glisser-déposer pour organiser vos contenus</span>
          </li>
        </ul>
      </div>

      <Button 
        onClick={handleComplete}
        className="w-full h-14 text-lg"
        size="lg"
      >
        Accéder au Planner
      </Button>
    </div>
  );
}
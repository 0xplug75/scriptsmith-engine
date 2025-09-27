import { useAppStore } from '@/lib/store';
import MinimalTopBar from './MinimalTopBar';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep2 from './OnboardingStep2';
import OnboardingStep3 from './OnboardingStep3';

export default function OnboardingWizard() {
  const { onboardingStep } = useAppStore();

  const renderStep = () => {
    switch (onboardingStep) {
      case 1:
        return <OnboardingStep1 />;
      case 2:
        return <OnboardingStep2 />;
      case 3:
        return <OnboardingStep3 />;
      default:
        return <OnboardingStep1 />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MinimalTopBar />
      <div className="container mx-auto px-6 py-12">
        {renderStep()}
      </div>
    </div>
  );
}
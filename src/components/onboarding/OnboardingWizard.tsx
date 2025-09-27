import { useAppStore } from '@/lib/store';
import MinimalTopBar from './MinimalTopBar';
import OnboardingStep1 from './OnboardingStep1';
import OnboardingStep1b from './OnboardingStep1b';
import OnboardingStep2Enhanced from './OnboardingStep2Enhanced';
import OnboardingStep3 from './OnboardingStep3';
import ProgressBar from './ProgressBar';

export default function OnboardingWizard() {
  const { onboardingStep } = useAppStore();

  const renderStep = () => {
    switch (onboardingStep) {
      case 1:
        return <OnboardingStep1 />;
      case 1.5:
        return <OnboardingStep1b />;
      case 2:
        return <OnboardingStep2Enhanced />;
      case 3:
        return <OnboardingStep3 />;
      default:
        return <OnboardingStep1 />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <MinimalTopBar />
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <ProgressBar />
        </div>
        {renderStep()}
      </div>
    </div>
  );
}
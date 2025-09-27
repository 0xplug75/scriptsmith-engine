import { useAppStore } from '@/lib/store';

export default function ProgressBar() {
  const { onboardingStep } = useAppStore();
  // Account for 1.5 step (transcript)
  const normalizedStep = onboardingStep === 1.5 ? 1.5 : onboardingStep;
  const progress = (normalizedStep / 3) * 100;

  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
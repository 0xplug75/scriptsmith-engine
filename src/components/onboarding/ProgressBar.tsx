import { useAppStore } from '@/lib/store';

export default function ProgressBar() {
  const { onboardingStep } = useAppStore();
  const progress = (onboardingStep / 3) * 100;

  return (
    <div className="w-full bg-muted rounded-full h-2">
      <div 
        className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
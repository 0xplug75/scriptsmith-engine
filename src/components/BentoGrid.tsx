import { ReactNode } from 'react';

export interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

export interface BentoItemProps {
  children: ReactNode;
  size?: 'S' | 'M' | 'L';
  className?: string;
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
  return (
    <div className={`columns-1 md:columns-2 xl:columns-3 gap-4 space-y-4 ${className}`}>
      {children}
    </div>
  );
}

export function BentoItem({ children, size = 'M', className = '' }: BentoItemProps) {
  const sizeClasses = {
    S: 'min-h-[200px]',
    M: 'min-h-[280px]',
    L: 'min-h-[380px]'
  };

  return (
    <div className={`break-inside-avoid ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}

// Helper function to determine bento size based on story score
export function getBentoSize(score: number): 'S' | 'M' | 'L' {
  if (score >= 0.8) return 'L';  // Large for high-scoring stories
  if (score >= 0.4) return 'M';  // Medium for moderate stories
  return 'S';                    // Small for simple stories
}
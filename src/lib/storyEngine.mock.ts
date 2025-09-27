import type { Story } from "./schemas";

export function generateStoryBankMock(profile: any, transcript_text: string): Story[] {
  const mockStories: Story[] = [
    {
      id: '1',
      histoire: 'Mon premier échec entrepreneurial',
      conflit: 'J\'ai perdu tous mes économies en 3 mois',
      message: 'L\'échec m\'a appris la valeur de la validation marché',
      platform: 'LinkedIn',
      color: '#2563EB',
      tags: ['entrepreneuriat', 'échec', 'apprentissage']
    },
    {
      id: '2',
      histoire: 'Le client qui a changé ma vision',
      conflit: 'Un client mécontent m\'a envoyé un email cinglant',
      message: 'Écouter les critiques nous fait grandir',
      platform: 'Instagram',
      color: '#EC4899',
      tags: ['service client', 'croissance', 'feedback']
    }
  ];

  return mockStories;
}
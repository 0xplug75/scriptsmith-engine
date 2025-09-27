import React from 'react';
import { Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface TextInfoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TextInfoModal({ open, onOpenChange }: TextInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Interview par Texte - Guide Complet
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-sm leading-relaxed">
          <section>
            <h3 className="font-semibold text-foreground mb-3">🎯 Qu'est-ce que l'interview par texte ?</h3>
            <p className="text-muted-foreground">
              L'interview par texte vous permet de transformer vos expériences, anecdotes et parcours en histoires 
              captivantes pour vos réseaux sociaux. Notre IA analyse votre contenu et extrait automatiquement 
              les éléments narratifs les plus impactants.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-3">✍️ Que pouvez-vous saisir ?</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li><strong>• Expériences professionnelles :</strong> Projets réussis ou ratés, défis surmontés, moments clés de votre carrière</li>
              <li><strong>• Anecdotes personnelles :</strong> Situations marquantes, apprentissages de vie, échecs transformés en succès</li>
              <li><strong>• Témoignages clients :</strong> Retours positifs, cas d'usage, transformations obtenues</li>
              <li><strong>• Parcours entrepreneurial :</strong> Création d'entreprise, pivots, lessons learned</li>
              <li><strong>• Formations et certifications :</strong> Apprentissages, nouvelles compétences acquises</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-3">🚀 Comment bien rédiger votre contenu ?</h3>
            <div className="space-y-3 text-muted-foreground">
              <p><strong>1. Soyez spécifique :</strong> Donnez des détails concrets, des chiffres, des dates, des noms d'entreprises</p>
              <p><strong>2. Incluez le contexte :</strong> Décrivez la situation initiale, les enjeux, l'environnement</p>
              <p><strong>3. Montrez les obstacles :</strong> Quels défis avez-vous rencontrés ? Quelles difficultés ?</p>
              <p><strong>4. Révélez la solution :</strong> Comment avez-vous résolu le problème ? Quelle approche ?</p>
              <p><strong>5. Partagez l'impact :</strong> Quels résultats ? Quelles leçons ? Quelle transformation ?</p>
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-3">💡 Exemple de contenu optimal</h3>
            <div className="bg-muted p-4 rounded-lg text-muted-foreground italic">
              "En 2022, j'ai été chargé de relancer les ventes d'une startup SaaS en difficulté. 
              Le CA avait chuté de 40% en 6 mois, l'équipe était démotivée et les clients partaient. 
              J'ai d'abord passé 2 semaines à écouter les retours clients pour comprendre les vrais problèmes. 
              Résultat : le produit était trop complexe et le support client défaillant. 
              J'ai alors mis en place une nouvelle stratégie : simplification de l'interface, 
              formation intensive de l'équipe support, et programme de fidélisation. 
              En 8 mois, nous avons récupéré 80% des clients perdus et augmenté le CA de 60%. 
              La leçon : toujours écouter ses clients avant de chercher des solutions."
            </div>
          </section>

          <section>
            <h3 className="font-semibold text-foreground mb-3">🎨 Résultat attendu</h3>
            <p className="text-muted-foreground">
              Notre IA transformera votre texte en 3-8 histoires structurées, chacune adaptée aux codes 
              des réseaux sociaux (LinkedIn, Instagram, TikTok). Chaque histoire comprendra :
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground ml-4">
              <li>• Une accroche captivante</li>
              <li>• Un conflit/défi clairement identifié</li>
              <li>• Un message/leçon inspirant</li>
              <li>• Des tags pertinents pour votre secteur</li>
            </ul>
          </section>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Compris, commençons !
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
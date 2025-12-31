export interface Parcours {
  id?: number;
  titre: string;
  categorie: 'education' | 'experience';
  annee_debut: number;
  annee_fin?: number;
  entreprise: string;
  description: string;
  competences: string;
  realisations: string;
  icone: string;
  ordre: number;
  est_visible: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface Competence {
  id: number;
  titre: string;
  description: string;
  image?: string;
  niveau: number;
  categorie?: string;
  est_visible: boolean;
  created_at?: Date;
  updated_at?: Date;
}

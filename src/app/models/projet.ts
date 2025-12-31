export interface Projet {
    id?: number;
  titre: string;
  description: string;
  image?: string;
  technologies: string;
  lien_demo?: string;
  lien_github?: string;
  date_debut: Date;
  date_fin?: Date;
  est_public: boolean;
  competences?: number[];
  created_at?: Date;
  updated_at?: Date;

}

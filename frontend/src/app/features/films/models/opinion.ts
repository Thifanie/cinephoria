/** Un avis d'utilisateur */

export interface Opinion {
  idUser: number | null;
  idFilm: number;
  note: number;
  description: string;
}

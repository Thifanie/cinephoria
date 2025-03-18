/** Un avis d'utilisateur */

export interface Opinion {
  idOrder: number;
  idUser: number | null;
  idFilm: number;
  note: number;
  description: string;
}

/** Un film géré dans la filmothèque */

export interface Film {
  titre: string;
  genre: string;
  acteurs: [];
  description: string;
  ageMinimum: number;
  coupDeCoeur: boolean;
  note: number;
}

/** Une salle de cinéma */

export interface Room {
  id: number;
  name: string;
  places: number;
  idCinema: number;
  idQuality: number;
}

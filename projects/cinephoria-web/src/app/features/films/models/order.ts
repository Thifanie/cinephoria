/** Une réservation de séance */

export interface Order {
  idUser: number | null;
  idFilm: number;
  cinemaName: string;
  idSession: number | null;
  roomName: string;
  date: string;
  viewed: boolean;
  placesNumber: string;
  price: number | undefined;
}

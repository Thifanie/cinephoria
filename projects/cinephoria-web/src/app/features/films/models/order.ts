/** Une réservation de séance */

export interface Order {
  idUser: number | null;
  idFilm: number;
  cinemaName: string;
  idSession: number | null;
  roomName: string;
  date: Date;
  viewed: boolean;
  placesNumber: string;
  price: number | undefined;
}

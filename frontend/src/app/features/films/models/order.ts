/** Une réservation de séance */

export interface Order {
  id: number;
  idUser: number | null;
  idFilm: number;
  cinemaName: string;
  idSession: number | null;
  roomName: string;
  date: string;
  viewed: boolean;
  placesNumber: string;
  price: number | undefined;
  moviePoster: string;
  startHour: Date;
  endHour: Date;
  description: string;
  actors: string;
  title: string;
  sessionDate: string;
  quality: string;
  opinionSent: boolean;
  opinionDescription: string;
  note: number;
}
